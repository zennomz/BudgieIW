<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use function App\Mail\confirmAccountMail;
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
        $confirmationToken = bin2hex(random_bytes(32));

        $user = User::create([
            'firstname' => $data['firstname'] ?? null,
            'lastname' => $data['lastname'] ?? null,
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'date_of_birth' => $data['date_of_birth'] ?? null,
            'numero_phone' => $data['numero_phone'] ?? null,
            'verification_token' => $confirmationToken
        ]);

        confirmAccountMail($user->email, $confirmationToken);
        return redirect()->route('verification.notice')->with('status', 'Un email de confirmation a été envoyé à votre adresse. Veuillez vérifier votre boîte de réception. Si vous ne le voyez pas, vérifiez votre dossier de spam.');
    }

    public function login(LoginRequest $request)
    {
        if (!Auth::attempt($request->validated())) {
            return back()->withErrors(['email' => 'Identifiants invalides'])->onlyInput('email');
        }

        $user = Auth::user();

        if (!$user->is_active) {
            Auth::logout();
            return back()->withErrors(['email' => 'Votre compte n\'est pas encore activé. Veuillez vérifier votre email.'])->onlyInput('email');
        }

        $request->session()->regenerate();
        return redirect()->intended(route('home'));
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login');
    }

    public function verify(Request $request)
    {
        $email = $request->query('email');
        $token = $request->query('token');

        if (!$email || !$token) {
            return view('auth.verification-failed');
        }

        $user = User::where('email', $email)
            ->where('verification_token', $token)
            ->first();

        if (!$user) {
            return view('auth.verification-failed');
        }

        $user->update([
            'verification_token' => null,
            'is_active' => true,
        ]);

        return view('auth.email-verified');
    }
}
