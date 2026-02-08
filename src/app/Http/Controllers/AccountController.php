<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Expense;
use App\Models\Income;
use Illuminate\Http\Request;

class AccountController extends Controller
{
    public function indexAll()
    {
        $user = auth()->user();
        if (!$user || $user->role !== 'admin') {
            return response()->json(['error' => 'Accès non autorisé.'], 403);
        }
        $accounts = Account::query()->orderByDesc('created_at')->get();
        return response()->json($accounts);
    }

    public function index()
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Accès refusé.'], 401);
        }
        $accounts = Account::query()->where('user_id', $user->id)->orderByAsc('name')->get();

        $result = $accounts->map(function ($account) {
            $incomeTotal = Income::where('account_id', $account->id)->sum('amount');
            $expenseTotal = Expense::where('account_id', $account->id)->sum('amount');
            return [
                'id' => $account->id,
                'name' => $account->name,
                'description' => $account->description,
                'rate_remuneration' => $account->rate_remuneration,
                'rate_imposition' => $account->rate_imposition,
                'balance' => $incomeTotal - $expenseTotal,
            ];
        });
        return response()->json($result);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Accès refusé.'], 401);
        }
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'rate_remuneration' => ['nullable', 'numeric'],
            'rate_imposition' => ['nullable', 'numeric'],
        ]);

        $data['user_id'] = $user->id;
        $account = Account::create($data);
        return response()->json($account, 201);
    }

    public function update(Request $request, Account $account)
    {
        $user = auth()->user();
        if (!$user || $account->user_id !== $user->id) {
            return response()->json(['error' => 'Accès refusé.'], 403);
        }
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'description' => ['sometimes', 'string'],
            'rate_remuneration' => ['sometimes', 'numeric'],
            'rate_imposition' => ['sometimes', 'numeric'],
        ]);

        $account->update($data);
        return response()->json($account);
    }

    public function show (Account $account)
    {
        $user = auth()->user();
        if (!$user || $account->user_id !== $user->id) {
            return response()->json(['error' => 'Accès refusé.'], 403);
        }

        $incomeTotal = Income::where('account_id', $account->id)->sum('amount');
        $expenseTotal = Expense::where('account_id', $account->id)->sum('amount');
        return response()->json([
                'account' => $account,
                'income_total' => $incomeTotal,
                'expense_total' => $expenseTotal,
                'balance' => $incomeTotal - $expenseTotal,
                ]);
    }

    public function destroy (Account $account)
    {
        $user = auth()->user();
        if (!$user || $account->user_id !== $user->id) {
            return response()->json(['error' => 'Accès refusé.'], 403);
        }
        $account->delete();
        return response()->json(null, 204);
    }
}
