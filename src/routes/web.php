<?php
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\PrevisionController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn() => view('home'))

    ->name('home')
    ->middleware('auth');

Route::get('/inscription', [AuthController::class, 'showRegister'])->name('register');
Route::post('/inscription', [AuthController::class, 'register'])->name('register.store');

Route::get('/connexion', [AuthController::class, 'showLogin'])->name('login');
Route::post('/connexion', [AuthController::class, 'login'])->name('login.store');

Route::post('/deconnexion', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

Route::middleware('auth')->group(function () {
    Route::get('/comptes', [AccountController::class, 'index'])->name('accounts.index');
    Route::post('/comptes', [AccountController::class, 'store'])->name('accounts.store');
    Route::get('/comptes/{account}', [ AccountController::class, 'show'])->name('accounts.show');
    Route::delete('/comptes/{account}', [AccountController::class, 'destroy'])->name('accounts.destroy');
    Route::get('/comptes/{account}/depenses', [ExpenseController::class, 'index'])->name('expenses.index');
    Route::get('/comptes/{account}/revenus', [IncomeController::class, 'index'])->name('incomes.index');
    Route::get('/comptes/{account}/previsions', [PrevisionController::class, 'index'])->name('previsions.index');
    Route::post('/comptes/{account}/previsions', [PrevisionController::class, 'store'])->name('previsions.store');
    Route::get('/comptes/{account}/previsions/{prevision}', [PrevisionController::class, 'show'])->name('previsions.show');
    Route::delete('/comptes/{account}/previsions/{prevision}', [PrevisionController::class, 'destroy'])->name('previsions.destroy');

    Route::middleware('admin')->group(function () {
        Route::get('/admin/comptes', [AccountController::class, 'indexAll'])->name('accounts.indexAll');
        Route::get('/admin/depenses', [ExpenseController::class, 'indexAll'])->name('expenses.indexAll');
        Route::put('/admin/depenses/{expense}', [ExpenseController::class, 'update'])->name('expenses.update');
        Route::post('/admin/depenses', [ExpenseController::class, 'store'])->name('expenses.store');
        Route::delete('/admin/depenses/{expense}', [ExpenseController::class, 'destroy'])->name('expenses.destroy');
        Route::get('/admin/revenus', [IncomeController::class, 'indexAll'])->name('incomes.indexAll');
        Route::put('/admin/revenus/{income}', [IncomeController::class, 'update'])->name('incomes.update');
        Route::post('/admin/revenus', [IncomeController::class, 'store'])->name('incomes.store');
        Route::delete('/admin/revenus/{income}', [IncomeController::class, 'destroy'])->name('incomes.destroy');
    });
});
