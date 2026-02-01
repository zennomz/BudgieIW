<?php
use App\Http\Controllers\Auth\AuthController;

use Illuminate\Support\Facades\Route;

Route::get('/', fn() => view('home'))
    ->name('home')
    ->middleware('auth');

Route::get('/inscription', [AuthController::class, 'showRegister'])->name('register');
Route::post('/inscription', [AuthController::class, 'register'])->name('register.store');

Route::get('/connexion', [AuthController::class, 'showLogin'])->name('login');
Route::post('/connexion', [AuthController::class, 'login'])->name('login.store');

Route::post('/deconnexion', [AuthController::class, 'logout'])->name('logout')->middleware('auth');
