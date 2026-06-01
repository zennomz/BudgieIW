<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Account;
use App\Services\PrevisionService;
use Carbon\Carbon;

class PrevisionController extends Controller
{
    /**
     * Par défaut : décembre de l'année en cours.
     */
    private function moisChoisi(Request $request): Carbon
    {
        $month = $request->query('month');
        if ($month && preg_match('/^\d{4}-\d{2}$/', $month)) {
            return Carbon::createFromFormat('Y-m', $month)->startOfMonth();
        }
        return Carbon::create(now()->year, 12, 1);
    }

    /**
     * Page globale : état de tous mes comptes à une date choisie.
     */
    public function overview(Request $request, PrevisionService $service)
    {
        $user = auth()->user();
        if (!$user) {
            return redirect()->route('login');
        }

        $mois = $this->moisChoisi($request);
        $accounts = Account::where('user_id', $user->id)->orderBy('name')->get();

        $lignes = [];
        $totaux = ['total_income' => 0, 'total_expense' => 0, 'total_interest' => 0, 'total_final' => 0];

        foreach ($accounts as $account) {
            $r = $service->projectAccount($account, $mois);
            $lignes[] = ['account' => $account] + $r;
            foreach ($totaux as $k => $v) {
                $totaux[$k] = $v + $r[$k];
            }
        }

        return view('previsions.overview', [
            'lignes' => $lignes,
            'totaux' => $totaux,
            'mois'   => $mois,
        ]);
    }

    /**
     * Prévision d'un seul compte à une date choisie.
     */
    public function index(Request $request, Account $account, PrevisionService $service)
    {
        $user = auth()->user();
        if (!$user || $account->user_id !== $user->id) {
            return response()->json(['error' => 'Accès non autorisé.'], 403);
        }

        $mois = $this->moisChoisi($request);
        $resultat = $service->projectAccount($account, $mois);

        if ($request->expectsJson()) {
            return response()->json($resultat + ['month' => $mois->format('Y-m')]);
        }

        return view('previsions.index', [
            'account'  => $account,
            'resultat' => $resultat,
            'mois'     => $mois,
        ]);
    }
}
