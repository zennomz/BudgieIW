<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\Income;
use App\Models\Expense;
use App\Services\PrevisionService;
use Carbon\Carbon;

class HomeController extends Controller
{
    public function index(PrevisionService $service)
    {
        $user = auth()->user();
        $accounts = Account::where('user_id', $user->id)->get();
        $accountIds = $accounts->pluck('id');

        // Solde par compte = total revenus - total dépenses
        $total = 0.0;
        $cash = 0.0;     // comptes non rémunérés
        $investi = 0.0;  // comptes rémunérés (taux > 0)
        foreach ($accounts as $account) {
            $balance = (float) Income::where('account_id', $account->id)->sum('amount')
                     - (float) Expense::where('account_id', $account->id)->sum('amount');
            $total += $balance;
            if ((float) $account->rate_remuneration > 0) {
                $investi += $balance;
            } else {
                $cash += $balance;
            }
        }

        // Derniers mouvements (revenus + dépenses) tous comptes confondus
        $incomes = Income::whereIn('account_id', $accountIds)->get()
            ->map(fn($i) => ['name' => $i->name, 'date' => $i->date_start, 'amount' => (float) $i->amount, 'type' => 'income']);
        $expenses = Expense::whereIn('account_id', $accountIds)->get()
            ->map(fn($e) => ['name' => $e->name, 'date' => $e->date_start, 'amount' => (float) $e->amount, 'type' => 'expense']);
        $movements = $incomes->concat($expenses)
            ->sortByDesc(fn($m) => $m['date'])
            ->take(4)
            ->values();

        // Prévision : solde net cumulé de tous les comptes au 31/12/2035
        $dateCible = Carbon::create(2035, 12, 1);
        $previsionTotal = 0.0;
        foreach ($accounts as $account) {
            $previsionTotal += $service->projectAccount($account, $dateCible)['total_final'];
        }

        return view('home', [
            'total'          => $total,
            'cash'           => $cash,
            'investi'        => $investi,
            'accountsCount'  => $accounts->count(),
            'movements'      => $movements,
            'previsionTotal' => $previsionTotal,
            'dateCible'      => $dateCible,
        ]);
    }
}
