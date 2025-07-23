<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Transaction Invoice</title>
    <style>
        body { font-family: sans-serif; position: relative; }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .watermark {
            position: absolute;
            top: 25%;
            left: 0;
            width: 100%;
            text-align: center;
            opacity: 0.08;
            z-index: -1;
        }

        .section-title {
            margin-top: 20px;
            font-weight: bold;
        }

        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        .table th, .table td {
            border: 1px solid #ddd;
            padding: 8px;
        }

        .table th {
            background-color: #f4f4f4;
        }
    </style>
</head>
<body>
{{-- Watermark Logo --}}
<div class="watermark">
    <img src="{{ public_path('images/JM-Logo-transparent.PNG') }}" width="500" alt="Logo">
</div>

<div class="header">
    <h2>Customer Invoice</h2>
</div>

<div class="section-title">
    Customer{{ $transaction->vehicle ? ' & Vehicle' : '' }} Info
</div>
<table class="table">
    <tbody>
    <tr>
        <th>Customer</th>
        <td>{{ $transaction->customer->customer_name }}</td>
    </tr>
    <tr>
        <th>CNIC</th>
        <td>{{ $transaction->customer->cnic }}</td>
    </tr>
    <tr>
        <th>Phone</th>
        <td>{{ $transaction->customer->phone_no }}</td>
    </tr>
    @if ($transaction->vehicle)
        <tr>
            <th>Vehicle</th>
            <td>{{ $transaction->vehicle->vehicle_name }} {{ $transaction->vehicle->model }}</td>
        </tr>
    @endif
    </tbody>
</table>

<div class="section-title">Transaction Detail</div>
<table class="table">
    <thead>
    <tr>
        <th>Amount</th>
        <th>Remaining</th>
        <th>Type</th>
        <th>Date</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>PKR {{ number_format($transaction->total_amount) }}</td>
        <td>PKR {{ number_format($transaction->remaining_amount) }}</td>
        <td>{{ ucfirst($transaction->transaction_type) }}</td>
        <td>{{ \Carbon\Carbon::parse($transaction->created_at)->format('d M, Y') }}</td>
    </tr>
    </tbody>
</table>

<div class="section-title">Payments for this Transaction</div>
<table class="table">
    <thead>
    <tr>
        <th>#</th>
        <th>Paid Amount</th>
        <th>Transfer Type</th>
        <th>Bank</th>
        <th>Date</th>
    </tr>
    </thead>
    <tbody>
    @php $totalPaid = 0; @endphp
    @foreach ($transaction->payments as $index => $p)
        @php $totalPaid += $p->paid_amount; @endphp
        <tr>
            <td>{{ $index + 1 }}</td>
            <td>PKR {{ number_format($p->paid_amount) }}</td>
            <td>{{ ucwords(str_replace('_', ' ', $p->transfer_type)) }}</td>
            <td>{{ $p->bank->bank_name ?? '-' }}</td>
            <td>{{ \Carbon\Carbon::parse($p->created_at)->format('d M, Y') }}</td>
        </tr>
    @endforeach
    </tbody>
    <tfoot>
    <tr>
        <td colspan="1"></td>
        <td><strong>Total Paid:</strong>&nbsp;PKR {{ number_format($totalPaid) }}</td>
        <td colspan="3"></td>
    </tr>
    </tfoot>
</table>

</body>
</html>
