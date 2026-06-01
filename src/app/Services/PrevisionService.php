<?php

namespace App\Services;

use App\Models\Account;
use Carbon\Carbon;

class PrevisionService
{
    /**
     * le solde net d'un compte jusqu'au mois choisi ...
     */
    public function projectAccount(Account $account, Carbon $moisCible): array
    {
        $debut = $this->idx(Carbon::parse($account->created_at));
        $fin   = $this->idx($moisCible);

        $solde = 0.0;
        $totalRevenus = 0.0;
        $totalDepenses = 0.0;
        $totalInterets = 0.0;

        // On charge une seule fois les mouvements du compte
        $revenus  = $account->incomes()->get();
        $depenses = $account->expenses()->get();

        $tauxMensuel = ((float) $account->rate_remuneration) / 100 / 12;
        $tauxNet     = 1 - ((float) $account->rate_imposition) / 100;

        for ($m = $debut; $m <= $fin; $m++) {
            //revenus du mois
            foreach ($revenus as $r) {
                if ($this->occursIn($r, $m)) {
                    $solde += (float) $r->amount;
                    $totalRevenus += (float) $r->amount;
                }
            }
            // dépenses du mois
            foreach ($depenses as $d) {
                if ($this->occursIn($d, $m)) {
                    $solde -= (float) $d->amount;
                    $totalDepenses += (float) $d->amount;
                }
            }
            //    les intérêts portent sur le solde de fin de mois)
            if ($tauxMensuel > 0) {
                $net = ($solde * $tauxMensuel) * $tauxNet;
                $solde += $net;
                $totalInterets += $net;
            }
        }

        return [
            'total_income'   => round($totalRevenus, 2),
            'total_expense'  => round($totalDepenses, 2),
            'total_interest' => round($totalInterets, 2),
            'total_final'    => round($solde, 2),
        ];
    }

    private function idx(Carbon $date): int
    {
        return $date->year * 12 + ($date->month - 1);
    }

    private function occursIn($t, int $m): bool
    {
        $debut = $this->idx(Carbon::parse($t->date_start));
        if ($m < $debut) {
            return false;
        }
        if ($t->date_end && $m > $this->idx(Carbon::parse($t->date_end))) {
            return false;
        }

        if (!$t->recurring) {
            return $m === $debut; // ponctuel le mois de début
        }

        return ($m - $debut) % $this->intervalMois($t) === 0;
    }

    private function intervalMois($t): int
    {
        return match ($t->value_recurring) {
            'YEARLY'  => 12,
            'MONTHLY' => 1,
            default   => 1,
        };
    }
}
