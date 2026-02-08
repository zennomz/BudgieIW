<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class UserController extends Controller
{
    public function show(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Accès refusé.'], 401);
        }
        return response()->json($user);
    }

    public function update(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Accès refusé.'], 401);
        }
        $data = $request->validate([
            'firstname' => ['sometimes', 'string', 'max:50'],
            'lastname' => ['sometimes', 'string', 'max:50'],
            'numero_phone' => ['sometimes', 'nullable', 'string', 'max:20'],
        ]);

        $user->update($data);
        return response()->json($user);
    }

    public function destroy(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Accès refusé.'], 401);
        }
        $user->delete();
        return response()->json(null, 204);
    }

    public function indexAll()
    {
        $user = auth()->user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['error' => 'Accès refusé.'], 403);
        }
        $users = User::query()->orderByDesc('created_at')->get();
        return response()->json($users);
    }

    public function updateAdmin(Request $request, User $user)
    {
        $admin = auth()->user();
        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['error' => 'Accès refusé.'], 403);
        }

        if ($user->id === $admin->id) {
            return response()->json(['error' => 'Vous ne pouvez pas modifier votre propre rôle ou statut.'], 403);
        }

        $data = $request->validate([
            'role' => ['sometimes', 'in:user,admin'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $user->update($data);
        return response()->json($user);
    }
}
