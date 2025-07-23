<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Models\Bank;
use App\Models\Customer;
use App\Models\Payment;
use App\Models\Transaction;
use App\Models\Vehicle;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request) {
        $query = Transaction::with('customer', 'payments')->latest();

        if ($request->search) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->whereHas('customer', function ($q2) use ($searchTerm) {
                    $q2->where('customer_name', 'like', "%{$searchTerm}%");
                })
                    ->orWhere('total_amount', 'like', "%{$searchTerm}%")
                    ->orWhereHas('payments', function ($q3) use ($searchTerm) {
                        $q3->where('paid_amount', 'like', "%{$searchTerm}%");
                    })
                    ->orWhere('created_at', 'like', "%{$searchTerm}%")
                    ->orWhere('transaction_type', 'like', "%{$searchTerm}%");
            });
        }


        $perPage = $request->get('perPage', 10);
        $transactions = $query->paginate($perPage)->withQueryString();

        $credit = Payment::whereHas('transaction', fn($q) => $q->where('transaction_type', 'credit'))
            ->sum('paid_amount');

        $debit = Payment::whereHas('transaction', fn($q) => $q->where('transaction_type', 'debit'))
            ->sum('paid_amount');

        return Inertia::render('Dashboard', [
            'transactions' => $transactions,
            'credit' => $credit,
            'debit' => $debit,
            'filters' => [
                'search' => $request->search,
                'perPage' => $perPage,
            ]
        ]);
    }

    public function create() {
        $customers = Customer::all()->toArray();
        $banks = Bank::pluck('bank_name', 'id')->toArray();

        return Inertia::render('AddTransaction', [
            'customers' => $customers,
            'banks' => $banks,
        ]);
    }

    public function store(StoreTransactionRequest $request)
    {
        DB::beginTransaction();

        try {
            // Create or get Customer
            if ($request->isNewCustomer) {
                $customer = Customer::create([
                    'cnic' => $request->cnic,
                    'customer_name' => $request->customer_name,
                    'phone_no' => $request->phone_no,
                ]);
            } else {
                $customer = Customer::find($request->customer_id);
            }

            // Optional: Only create vehicle if at least one field is filled
            $vehicle = null;
            if ($request->filled('vehicle_name') || $request->filled('company') || $request->filled('model')) {
                $vehicle = Vehicle::create([
                    'customer_id' => $customer->id,
                    'vehicle_name' => $request->vehicle_name,
                    'company' => $request->company,
                    'model' => $request->model,
                ]);
            }

            // Create transaction
            $transaction = Transaction::create([
                'customer_id' => $customer->id,
                'vehicle_id' => optional($vehicle)->id,
                'transaction_type' => $request->transaction_type,
                'total_amount' => $request->total_amount,
                'remaining_amount' => $request->remaining_amount
            ]);

            // Create Payment
            $payment = Payment::create([
                'transaction_id' => $transaction->id,
                'paid_amount' => $request->paid_amount,
                'paid_on' => $request->paid_on,
                'bank_id' => $request->bank_id,
                'transfer_type' => $request->transfer_type,
            ]);

            // Update Bank Balance if bank_id is present
            if ($request->bank_id) {
                $bank = Bank::find($request->bank_id);

                if ($bank) {
                    if ($request->transaction_type === 'credit') {
                        $bank->balance += $request->paid_amount;
                    } elseif ($request->transaction_type === 'debit') {
                        $bank->balance -= $request->paid_amount;
                    }
                    $bank->save();
                }
            }

            DB::commit();

            return redirect()->back()->with('success', 'Entry recorded successfully!');

        } catch (\Exception $e) {
            DB::rollBack();

            return redirect()->back()->withErrors(['error' => 'Something went wrong: ' . $e->getMessage()]);
        }
    }

    public function edit(Transaction $transaction) {
        $banks = Bank::pluck('bank_name', 'id')->toArray();

        return Inertia::render('EditTransaction', [
            'transaction' => $transaction->load(['payments.bank']),
            'banks' => $banks,
            'payments' => $transaction->payments->sortByDesc('created_at')->values(),
            'customer' => $transaction->customer,
            'vehicle' => $transaction->vehicle,
        ]);
    }

    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        $data = $request->validated()['data'];

        // Store previous transaction type and amount
        $oldTransactionType = $transaction->transaction_type;

        // Update Customer Info
        $transaction->customer->update([
            'customer_name' => $data['customer_name'],
            'cnic' => $data['cnic'],
            'phone_no' => $data['phone_no'],
        ]);

        // Update Transaction Info
        $transaction->update([
            'total_amount' => $data['total_amount'],
            'transaction_type' => $data['transaction_type'],
        ]);

        // Adjust bank balance if transaction type has changed
        if ($oldTransactionType !== $data['transaction_type']) {
            foreach ($transaction->payments as $payment) {
                if ($payment->bank_id) {
                    $bank = $payment->bank;
                    $amount = $payment->paid_amount;

                    if ($oldTransactionType === 'debit' && $data['transaction_type'] === 'credit') {
                        $bank->balance += ($amount * 2); // revert previous debit and apply credit
                    } elseif ($oldTransactionType === 'credit' && $data['transaction_type'] === 'debit') {
                        $bank->balance -= ($amount * 2); // revert previous credit and apply debit
                    }

                    $bank->save();
                }
            }
        }

        // Update or Create Vehicle Info
        if (!empty($data['vehicle_name']) || !empty($data['model']) || !empty($data['company'])) {
            if ($transaction->vehicle) {
                $transaction->vehicle->update([
                    'vehicle_name' => $data['vehicle_name'] ?? null,
                    'model' => $data['model'] ?? null,
                    'company' => $data['company'] ?? null,
                ]);
            } else {
                $vehicle = Vehicle::create([
                    'vehicle_name' => $data['vehicle_name'] ?? null,
                    'model' => $data['model'] ?? null,
                    'company' => $data['company'] ?? null,
                ]);

                $transaction->vehicle_id = $vehicle->id;
                $transaction->save();
            }
        }

        return back()->with('success', 'Transaction updated successfully.');
    }

    public function chart(Request $request) {
        $credit = Payment::whereHas('transaction', fn($q) => $q->where('transaction_type', 'credit'))
            ->sum('paid_amount');

        $debit = Payment::whereHas('transaction', fn($q) => $q->where('transaction_type', 'debit'))
            ->sum('paid_amount');

        return Inertia::render('Chart', [
            'credit' => $credit,
            'debit' => $debit
        ]);
    }

    public function destroy(Transaction $transaction) {
        foreach ($transaction->payments as $payment) {
            if ($payment->bank_id) {
                $bank = $payment->bank;

                if ($bank) {
                    if ($transaction->transaction_type === 'credit') {
                        $bank->balance -= $payment->paid_amount;
                    } elseif ($transaction->transaction_type === 'debit') {
                        $bank->balance += $payment->paid_amount;
                    }
                    $bank->save();
                }
            }
        }

        $transaction->delete();

        return back()->with('success', 'Transaction deleted successfully.');
    }

    public function print(Transaction $transaction) {
        $transaction = $transaction->load(['payments', 'customer', 'vehicle']);
        $pdf = Pdf::loadView('invoices.transaction', compact('transaction'));

        return $pdf->download('invoice_' . $transaction->id . '.pdf');
    }
}
