<?php

namespace App\Http\Controllers;

use App\Models\Bank;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class ChartController extends Controller
{
    public function index(Request $request) {
        $bankBalance = Bank::sum('balance');
        $totalCreditPayments = Payment::whereHas('transaction', function ($q) {
            $q->where('transaction_type', 'credit');
        })->sum('paid_amount');
        $totalDebitPayments = Payment::whereHas('transaction', function ($q) {
            $q->where('transaction_type', 'debit');
        })->sum('paid_amount');

        $credit = $bankBalance + $totalCreditPayments;
        $debit = $totalDebitPayments;

        $baseQuery = Payment::query();
        $monthlyData = $this->buildMonthlyData($baseQuery);

        return Inertia::render('Chart', [
            'credit' => (float) $credit,
            'debit' => (float) $debit,
            'monthly_data' => $monthlyData,
        ]);
    }

    /**
     * Helper: build monthly data (last 6 months) from a base Payment query
     * $dateColumn should be like 'payments.created_at'
     */
    private function buildMonthlyData($baseQuery, string $dateColumn = 'payments.paid_on'): array
    {
        $sixMonthsAgo = Carbon::now()->subMonths(6)->startOfMonth();

        $clone = (clone $baseQuery);

        $monthlyData = $clone->select(
            DB::raw("MONTH({$dateColumn}) as month"),
            DB::raw("YEAR({$dateColumn}) as year"),
            DB::raw('SUM(CASE WHEN transactions.transaction_type = "credit" THEN payments.paid_amount ELSE 0 END) as credit'),
            DB::raw('SUM(CASE WHEN transactions.transaction_type = "debit" THEN payments.paid_amount ELSE 0 END) as debit')
        )
            ->join('transactions', 'payments.transaction_id', '=', 'transactions.id')
            ->where("{$dateColumn}", '>=', $sixMonthsAgo)
            ->groupBy('year', 'month')
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => Carbon::createFromDate($item->year, $item->month, 1)->format('M'),
                    'credit' => (float) $item->credit,
                    'debit' => (float) $item->debit,
                ];
            })
            ->toArray();

        return $this->fillMissingMonths($monthlyData);
    }

    /**
     * Fill missing months with zero values (last 6 months, oldest first)
     */
    private function fillMissingMonths($existingData): array
    {
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i)->format('M');
            $months[$month] = [
                'month' => $month,
                'credit' => 0,
                'debit' => 0
            ];
        }

        // Merge existing data
        foreach ($existingData as $data) {
            if (isset($months[$data['month']])) {
                $months[$data['month']] = $data;
            }
        }

        return array_values($months);
    }
}
