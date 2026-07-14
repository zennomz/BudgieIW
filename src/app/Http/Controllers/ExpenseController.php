<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ExpenseController extends Controller
{
    public function index(Request $request, Account $account)
    {
        $user = auth()->user();
        if (!$account->isAccessibleBy($user)) {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Accès non autorisé.'], 403);
            }
            return response()->view('accounts.share-failed', [
                'message' => "Vous n'avez plus accès à ce compte (le partage a peut-être été révoqué).",
            ], 403);
        }
        $expenses = $account->expenses()->orderByDesc('date_start')->orderByDesc('id')->get();

        return view('expenses.index', [
            'account' => $account,
            'expenses' => $expenses,
            'is_owner' => $account->isOwnedBy($user),
        ]);
    }

    public function userExpenses()
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Accès non autorisé.'], 401);
        }

        $accounts = Account::where('user_id', $user->id)->get();
        $accountIds = $accounts->pluck('id');

        $expenses = Expense::whereIn('account_id', $accountIds)
            ->with('account')
            ->orderByDesc('date_start')
            ->orderByDesc('id')
            ->get();

        return view('expenses.all', [
            'expenses' => $expenses,
            'accounts' => $accounts,
        ]);
    }

    public function indexAll()
    {
        $expenses = Expense::query()->orderByDesc('date_start')->orderByDesc('id')->get();
        return response()->json($expenses);
    }

    public function store(Request $request, Account $account)
    {
        $user = auth()->user();
        if ($account->user_id !== $user->id) {
            return response()->json(['error' => 'Accès non autorisé.'], 403);
        }

        //  7 dépenses par compte
        if (!$user->isPremium() && $account->expenses()->count() >= 7) {
            return response()->json(['message' => 'Limite du plan gratuit atteinte (7 dépenses par compte). Passez à un compte Premium pour en ajouter davantage.'], 403);
        }

        $recurringValues = ['MONTHLY', 'WEEKLY', 'YEARLY'];

        $data = $request->validate([
            'name' => ['required','string','max:100'],
            'description' => ['nullable','string'],
            'recurring' => ['required', 'boolean'],
            'value_recurring' => ['nullable', Rule::in($recurringValues)],
            'amount' => ['required', 'numeric', 'min:0'],
            'date_start' => ['required', 'date'],
            'date_end' => ['nullable', 'date', 'after_or_equal:date_start'],
        ]);

        $data['account_id'] = $account->id;

        if (empty($data['recurring'])) {
            $data['value_recurring'] = null;
        }
        $expense = Expense::create($data);
        return response()->json($expense, 201);
    }

    public function update(Request $request, Account $account, Expense $expense)
    {
        $user = auth()->user();
        if ($account->user_id !== $user->id || $expense->account_id !== $account->id) {
            return response()->json(['error' => 'Accès non autorisé.'], 403);
        }

        $recurringValues = ['MONTHLY', 'WEEKLY', 'YEARLY'];
        $data = $request->validate([
            'name' => ['sometimes','string','max:100'],
            'description' => ['nullable','string'],
            'recurring' => ['sometimes', 'boolean'],
            'value_recurring' => ['nullable', Rule::in($recurringValues)],
            'amount' => ['sometimes', 'numeric', 'min:0'],
            'date_start' => ['sometimes', 'date'],
            'date_end' => ['nullable', 'date'],
        ]);
        if (array_key_exists('recurring', $data) && empty($data['recurring'])) {
            $data['value_recurring'] = null;
        }
        $expense->update($data);
        return response()->json($expense);
    }

    public function destroy(Account $account, Expense $expense)
    {
        $user = auth()->user();
        if ($account->user_id !== $user->id || $expense->account_id !== $account->id) {
            return response()->json(['error' => 'Accès non autorisé.'], 403);
        }

        $expense->delete();
        return response()->json(null, 204);
    }
}
