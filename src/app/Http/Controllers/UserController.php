<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function show(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Accès refusé.'], 401);
        }

        if ($request->expectsJson()) {
            return response()->json($user);
        }

        return view('profile.show', ['user' => $user]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Accès refusé.'], 401);
        }

        $data = $request->validate([
            'firstname' => ['sometimes', 'string', 'max:50'],
            'lastname' => ['sometimes', 'string', 'max:50'],
            'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'date_of_birth' => ['sometimes', 'nullable', 'date'],
            'numero_phone' => ['sometimes', 'nullable', 'string', 'max:20'],
        ]);

        $user->update($data);

        if ($request->expectsJson()) {
            return response()->json($user);
        }

        return redirect()->route('profile.show')->with('status', 'Profil mis a jour avec succes.');
    }

    public function destroy(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Accès refusé.'], 401);
        }
        $user->delete();
        return response()->json(null, 204);
    }
}
