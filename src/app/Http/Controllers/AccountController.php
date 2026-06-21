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
            return redirect()->route('login');
        }
        $accounts = Account::query()->where('user_id', $user->id)->orderBy('name')->get();

        $result = $accounts->map(function ($account) {
            $incomeTotal = (float) Income::where('account_id', $account->id)->sum('amount');
            $expenseTotal = (float) Expense::where('account_id', $account->id)->sum('amount');
            return [
                'id' => $account->id,
                'name' => $account->name,
                'description' => $account->description,
                'rate_remuneration' => $account->rate_remuneration,
                'rate_imposition' => $account->rate_imposition,
                'balance' => $incomeTotal - $expenseTotal,
            ];
        });

        return view('accounts.index', ['accounts' => $result]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Accès refusé.'], 401);
        }

        //    2 comptes maxx
        if (!$user->isPremium() && Account::where('user_id', $user->id)->count() >= 2) {
            return response()->json(['message' => 'Limite du plan gratuit atteinte (2 comptes). Passez à un compte Premium pour en créer davantage.'], 403);
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

    public function show(Account $account)
    {
        $user = auth()->user();
        if (!$user || $account->user_id !== $user->id) {
            return response()->json(['error' => 'Accès refusé.'], 403);
        }

        $incomeTotal = Income::where('account_id', $account->id)->sum('amount');
        $expenseTotal = Expense::where('account_id', $account->id)->sum('amount');

        $incomes = Income::where('account_id', $account->id)
            ->orderByDesc('date_start')
            ->take(5)
            ->get();

        $expenses = Expense::where('account_id', $account->id)
            ->orderByDesc('date_start')
            ->take(5)
            ->get();

        return view('accounts.show', [
            'account' => $account,
            'income_total' => $incomeTotal,
            'expense_total' => $expenseTotal,
            'balance' => $incomeTotal - $expenseTotal,
            'incomes' => $incomes,
            'expenses' => $expenses,
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
