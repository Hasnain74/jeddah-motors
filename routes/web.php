<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\BankController;
use App\Http\Controllers\ChartController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
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
    Route::get('register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('register', [RegisteredUserController::class, 'store']);
    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::delete('/users/{user}/delete', [UserController::class, 'destroy'])->name('users.destroy');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}/update', [UserController::class, 'update'])->name('users.update');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/transactions', [TransactionController::class, 'index'])->name('dashboard');
    //Charts
    Route::get('/charts', [ChartController::class, 'index'])->name('charts.index');

    Route::get('/add-transaction', [TransactionController::class, 'create'])->name('transactions.add');
    Route::post('/store-transaction', [TransactionController::class, 'store'])->name('store.transaction');
    Route::get('/transaction/{transaction}/edit', [TransactionController::class, 'edit'])->name('transactions.edit');
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
