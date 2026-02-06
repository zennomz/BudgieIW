<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function indexAll()
    {
        $user = auth()->user();
        if (!$user || !$user->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $accounts = Account::query()->orderByDesc('created_at')->get();
        return response()->json($accounts);
    }

    public function index()
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $accounts = Account::query()->where('user_id', $user->id)->orderByAsc('name')->get();
        return response()->json($accounts);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'balance' => ['nullable', 'numeric'],
            'rate_remuneration' => ['nullable', 'numeric'],
            'rate_imposition' => ['nullable', 'numeric'],
        ]);

        $data['user_id'] = $user->id;
        $account = Account::create($data);
        return response()->json($account, 201);
    }

    public function show (Account $account)
    {
        $user = auth()->user();
        if (!$user || $account->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return response()->json($account);
    }

    public function destroy (Account $account)
    {
        $user = auth()->user();
        if (!$user || $account->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        $account->delete();
        return response()->json(null, 204);
    }
}
