<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\Transaction;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function store(Request $request, Transaction $transaction)
    {
        $request->validate([
            'paid_amount' => 'required|numeric',
            'paid_on' => 'required|date',
            'bank_name' => 'nullable|exists:banks,id',
            'transfer_type' => 'required|in:cash,cheque,online_transfer',
            'transaction_type' => 'required|in:credit,debit',
        ]);

        DB::transaction(function () use ($request, $transaction) {
            $transaction->payments()->create([
                'paid_amount' => $request->paid_amount,
                'paid_on' => $request->paid_on,
                'bank_id' => $request->bank_name,
                'transfer_type' => $request->transfer_type,
            ]);

            if ($request->bank_name) {
                $bank = Bank::find($request->bank_name);
                if ($request->transaction_type === 'credit') {
                    $bank->balance += $request->paid_amount;
                } elseif ($request->transaction_type === 'debit') {
                    $bank->balance -= $request->paid_amount;
                }
                $bank->save();
            }

            $transaction->recalculateRemainingAmount();
        });

        return back()->with('success', 'Payment added successfully.');
    }

    public function update(Request $request, Transaction $transaction, Payment $payment)
    {
        $request->validate([
            'paid_amount' => 'required|numeric',
            'paid_on' => 'required|date',
            'bank_name' => 'nullable|exists:banks,id',
            'transfer_type' => 'required|in:cash,cheque,online_transfer',
            'transaction_type' => 'required|in:credit,debit',
        ]);

        DB::transaction(function () use ($request, $payment, $transaction) {
            $oldAmount = $payment->paid_amount;
            $payment->update([
                'paid_amount' => $request->paid_amount,
                'paid_on' => $request->paid_on,
                'bank_id' => $request->bank_name,
                'transfer_type' => $request->transfer_type,
            ]);

            if ($request->bank_name) {
                $bank = Bank::find($request->bank_name);
                $difference = $request->paid_amount - $oldAmount;
                if ($request->transaction_type === 'credit') {
                    $bank->balance += $difference;
                } elseif ($request->transaction_type === 'debit') {
                    $bank->balance -= $difference;
                }
                $bank->save();
            }

            $transaction->recalculateRemainingAmount();
        });

        return back()->with('success', 'Payment updated successfully.');
    }

    public function destroy(Payment $payment)
    {
        DB::transaction(function () use ($payment) {
            $amount = $payment->paid_amount;
            $transactionType = $payment->transaction->transaction_type;

            if ($payment->bank_id) {
                $bank = Bank::find($payment->bank_id);
                if ($transactionType === 'credit') {
                    $bank->balance -= $amount;
                } elseif ($transactionType === 'debit') {
                    $bank->balance += $amount;
                }
                $bank->save();
            }

            $payment->delete();
        });

        return back()->with('success', 'Payment deleted successfully.');
    }
}
