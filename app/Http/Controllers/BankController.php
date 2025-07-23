<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BankController extends Controller
{
    public function index(Request $request) {
        $query = Bank::query();

        if ($request->has('search')) {
            $query->where('bank_name', 'like', '%' . $request->search . '%');
        }

        $banks = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('BankIndex', [
            'banks' => [
                'data' => $banks->items(),
                'meta' => [
                    'current_page' => $banks->currentPage(),
                    'last_page' => $banks->lastPage(),
                    'per_page' => $banks->perPage(),
                    'total' => $banks->total(),
                ],
                'links' => $banks->toArray()['links'],
            ],
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'bank_name' => ['required', 'string', 'max:255'],
            'balance' => ['required', 'string']
        ]);

        Bank::create($validated);

        return redirect()->back()->with('success', 'Bank added successfully.');
    }

    public function destroy(Bank $bank) {
        $bank->delete();

        return redirect()->back()->with('success', 'Bank deleted successfully.');
    }

    public function update(Request $request, Bank $bank)
    {
        $validated = $request->validate([
            'bank_name' => ['required', 'string', 'max:255'],
            'balance' => ['required', 'numeric'],
        ]);

        $bank->update($validated);

        return redirect()->back()->with('success', 'Bank updated successfully.');
    }
}
