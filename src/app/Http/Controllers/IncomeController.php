<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Income;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class IncomeController extends Controller
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
        $incomes = $account->incomes()->orderByDesc('date_start')->orderByDesc('id')->get();

        return view('incomes.index', [
            'account' => $account,
            'incomes' => $incomes,
            'is_owner' => $account->isOwnedBy($user),
        ]);
    }

    public function userIncomes()
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['error' => 'Accès non autorisé.'], 401);
        }

        $accounts = Account::where('user_id', $user->id)->get();
        $accountIds = $accounts->pluck('id');

        $incomes = Income::whereIn('account_id', $accountIds)
            ->with('account')
            ->orderByDesc('date_start')
            ->orderByDesc('id')
            ->get();

        return view('incomes.all', [
            'incomes' => $incomes,
            'accounts' => $accounts,
        ]);

    }

    public function indexAll()
    {
        $incomes = Income::query()->orderByDesc('date_start')->orderByDesc('id')->get();
        return response()->json($incomes);
    }

    public function store(Request $request, Account $account)
    {
        $user = auth()->user();
        if ($account->user_id !== $user->id) {
            return response()->json(['error' => 'Accès non autorisé.'], 403);
        }

        //  2 revenus par compte
        if (!$user->isPremium() && $account->incomes()->count() >= 2) {
            return response()->json(['message' => 'Limite du plan gratuit atteinte (2 revenus par compte). Passez à un compte Premium pour en ajouter davantage.'], 403);
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
        $income = Income::create($data);
        return response()->json($income, 201);
    }

    public function update(Request $request, Account $account, Income $income)
    {
        $user = auth()->user();
        if ($account->user_id !== $user->id || $income->account_id !== $account->id) {
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
        $income->update($data);
        return response()->json($income);
    }

    public function destroy(Account $account, Income $income)
    {
        $user = auth()->user();
        if ($account->user_id !== $user->id || $income->account_id !== $account->id) {
            return response()->json(['error' => 'Accès non autorisé.'], 403);
        }

        $income->delete();
        return response()->json(null, 204);
    }
}
