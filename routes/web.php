<?php

use App\Http\Controllers\BankController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', [TransactionController::class, 'index'])->name('dashboard');
    Route::get('/transaction/chart', [TransactionController::class, 'chart'])->name('transactions.chart');
    Route::get('/add-transaction', [TransactionController::class, 'create'])->name('add.transaction');
    Route::post('/store-transaction', [TransactionController::class, 'store'])->name('store.transaction');
    Route::get('/transaction/{transaction}/edit', [TransactionController::class, 'edit'])->name('edit.transaction');
    Route::put('/transactions/{transaction}/update', [TransactionController::class, 'update'])->name('transactions.update');
    Route::delete('/transactions/{transaction}/delete', [TransactionController::class, 'destroy'])->name('transactions.delete');
    Route::get('/transactions/{transaction}/print', [TransactionController::class, 'print'])->name('transactions.print');

    Route::get('/banks', [BankController::class, 'index'])->name('bank.index');
    Route::post('/store-bank', [BankController::class, 'store'])->name('store.bank');
    Route::delete('/banks/delete/{bank}', [BankController::class, 'destroy'])->name('banks.delete');
    Route::put('/update-bank/{bank}', [BankController::class, 'update']);

    Route::post('/transactions/{transaction}/payments', [PaymentController::class, 'store'])->name('transactions.payment.store');
    Route::post('/transactions/{transaction}/payments/{payment}', [PaymentController::class, 'update'])->name('transactions.payment.update');
    Route::delete('/payments/{payment}/delete', [PaymentController::class, 'destroy'])->name('payment.delete');
});

require __DIR__.'/auth.php';
