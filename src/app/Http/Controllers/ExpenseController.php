<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ExpenseController extends Controller
{
    public function index(Account $account)
    {
        $user = auth()->user();
        if ($account->user_id !== $user->id) {
            abort(403);
        }
        $expenses = $account->expenses()->orderByDesc('date_start')->orderByDesc('id')->get();
        return response()->json($expenses);
    }

    public function indexAll()
    {
        $expenses = Expense::query()->orderByDesc('date_start')->orderByDesc('id')->get();
        return response()->json($expenses);
    }

    public function store(Request $request)
    {
        $recurringValues = ['MONTHLY', 'WEEKLY', 'YEARLY'];

        $data = $request->validate([
            'name' => ['required','string','max:100'],
            'description' => ['nullable','string'],
            'recurring' => ['required', 'boolean'],
            'value_recurring' => ['nullable', Rule::in($recurringValues)],
            'amount' => ['required', 'numeric', 'min:0'],
            'date_start' => ['required', 'date'],
            'date_end' => ['nullable', 'date', 'after_or_equal:date_start'],
            'account_id' => ['required', 'integer', 'exists:accounts,id'],
        ]);

        if (empty($data['recurring'])) {
            $data['value_recurring'] = null;
        }
        $expense = Expense::create($data);
        return response()->json($expense, 201);
    }

    public function update(Request $request, Expense $expense)
    {
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

    public function destroy(Expense $expense)
    {
        $expense->delete();
        return response()->json(null, 204);
    }
}
