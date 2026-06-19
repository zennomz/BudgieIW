<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function indexAll()
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['error' => 'Accès refusé.'], 403);
        }
        $users = User::query()->orderByDesc('created_at')->get();
        return view('admin.dashbordadmin', compact('users'));
    }

    public function updateUser(Request $request, User $user)
    {
        $admin = Auth::user();
        if (!$admin || $admin->role !== 'admin') {
            return response()->json(['error' => 'Accès refusé.'], 403);
        }

        if ($user->id === $admin->id) {
            return response()->json(['error' => 'Vous ne pouvez pas modifier votre propre rôle ou statut.'], 403);
        }

        $data = $request->validate([
            'role' => ['required', 'in:user,admin'],
            'is_active' => ['required', 'boolean'],
        ]);

        $user->update($data);
        return response()->json($user);
    }
}
