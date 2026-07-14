<?php
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\IncomeController;
use App\Http\Controllers\PrevisionController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\AccountShareController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])
    ->name('home')
    ->middleware('auth');

Route::get('/inscription', [AuthController::class, 'showRegister'])->name('register');
Route::post('/inscription', [AuthController::class, 'register'])->name('register.store');

Route::get('/verify-email', fn() => view('auth.verify-email'))->name('verification.notice');
Route::get('/verify', [AuthController::class, 'verify'])->name('verification.verify');

Route::get('/connexion', [AuthController::class, 'showLogin'])->name('login');
Route::post('/connexion', [AuthController::class, 'login'])->name('login.store');

Route::post('/deconnexion', [AuthController::class, 'logout'])->name('logout')->middleware('auth');

Route::middleware('auth')->group(function () {
    Route::get('/profil', [UserController::class, 'show'])->name('profile.show');
    Route::put('/profil', [UserController::class, 'update'])->name('profile.update');
    Route::delete('/profil', [UserController::class, 'destroy'])->name('profile.destroy');
    Route::get('/comptes', [AccountController::class, 'index'])->name('accounts.index');
    Route::post('/comptes', [AccountController::class, 'store'])->name('accounts.store');
    Route::get('/comptes/expenses', [ExpenseController::class, 'userExpenses'])->name('expenses.userExpenses');
    Route::get('/comptes/incomes', [IncomeController::class, 'userIncomes'])->name('incomes.userIncomes');
    Route::get('/comptes/partages', [AccountShareController::class, 'shared'])->name('accounts.shared');
    Route::get('/partages/accepter', [AccountShareController::class, 'accept'])->name('shares.accept');
    Route::put('/comptes/{account}', [AccountController::class, 'update'])->name('accounts.update');
    Route::get('/comptes/{account}', [ AccountController::class, 'show'])->name('accounts.show');
    Route::delete('/comptes/{account}', [AccountController::class, 'destroy'])->name('accounts.destroy');
    Route::post('/comptes/{account}/partages', [AccountShareController::class, 'store'])->name('accounts.shares.store');
    Route::delete('/comptes/{account}/partages/{share}', [AccountShareController::class, 'destroy'])->name('accounts.shares.destroy');
    Route::get('/comptes/{account}/depenses', [ExpenseController::class, 'index'])->name('expenses.index');
    Route::post('/comptes/{account}/depenses', [ExpenseController::class, 'store'])->name('expenses.store');
    Route::put('/comptes/{account}/depenses/{expense}', [ExpenseController::class, 'update'])->name('expenses.update');
    Route::delete('/comptes/{account}/depenses/{expense}', [ExpenseController::class, 'destroy'])->name('expenses.destroy');
    Route::get('/comptes/{account}/revenus', [IncomeController::class, 'index'])->name('incomes.index');
    Route::post('/comptes/{account}/revenus', [IncomeController::class, 'store'])->name('incomes.store');
    Route::put('/comptes/{account}/revenus/{income}', [IncomeController::class, 'update'])->name('incomes.update');
    Route::delete('/comptes/{account}/revenus/{income}', [IncomeController::class, 'destroy'])->name('incomes.destroy');
    Route::get('/previsions', [PrevisionController::class, 'overview'])->name('previsions.overview');
    Route::get('/comptes/{account}/previsions', [PrevisionController::class, 'index'])->name('previsions.index');

    Route::get('/abonnement', [SubscriptionController::class, 'index'])->name('subscription.index');
    Route::post('/abonnement/checkout', [SubscriptionController::class, 'checkout'])->name('subscription.checkout');
    Route::get('/abonnement/succes', [SubscriptionController::class, 'success'])->name('subscription.success');
    Route::get('/abonnement/annule', [SubscriptionController::class, 'cancel'])->name('subscription.cancel');
    Route::post('/abonnement/gratuit', [SubscriptionController::class, 'downgrade'])->name('subscription.downgrade');

    Route::middleware('admin')->group(function () {
        Route::get('/admin', [AdminController::class, 'indexAll'])->name('admin');
        Route::put('/admin/utilisateurs/{user}', [AdminController::class, 'updateUser'])->name('users.updateAdmin');
    });
});
