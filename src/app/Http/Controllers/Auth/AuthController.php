<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function showRegister() { return view('auth.register'); }
    public function showLogin() { return view('auth.login'); }

    public function register(RegisterRequest $request)
    {
        $data = $request->validated();

        $user = User::create([
            'name' => trim(($data['prenom'] ?? '') . ' ' . ($data['nom'] ?? '')),
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'nom' => $data['nom'] ?? null,
            'prenom' => $data['prenom'] ?? null,
            'date_naissance' => $data['date_naissance'] ?? null,
            'numero_telephone' => $data['numero_telephone'] ?? null,
        ]);

        Auth::login($user);
        return redirect()->route('home');
    }

    public function login(LoginRequest $request)
    {
        if (!Auth::attempt($request->validated())) {
            return back()->withErrors(['email' => 'Identifiants invalides'])->onlyInput('email');
        }

        $request->session()->regenerate();
        return redirect()->route('home');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login');
    }
}
