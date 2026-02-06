<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Income;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class IncomeController extends Controller
{
    public function index(Account $account)
    {
        $user = auth()->user();
        if ($account->user_id !== $user->id) {
            abort(403);
        }
        $incomes = $account->incomes()->orderByDesc('date_start')->orderByDesc('id')->get();
        return response()->json($incomes);
    }

    public function indexAll()
    {
        $incomes = Income::query()->orderByDesc('date_start')->orderByDesc('id')->get();
        return response()->json($incomes);
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
        $income = Income::create($data);
        return response()->json($income, 201);
    }

    public function update(Request $request, Income $income)
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
        $income->update($data);
        return response()->json($income);
    }

    public function destroy(Income $income)
    {
        $income->delete();
        return response()->json(null, 204);
    }
}
