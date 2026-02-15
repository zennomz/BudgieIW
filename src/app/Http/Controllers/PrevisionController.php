<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Prevision;
use App\Models\Account;

class PrevisionController extends Controller
{
    public function index(Account $account)
    {
        $user = auth()->user();
        if (!$user || $account->user_id !== $user->id) {
            return response()->json(['error' => 'Accès non autorisé.'], 403);
        }

        $previsions = $account->previsions()->orderBy('id')->get();
        return response()->json($previsions);
    }

    public function show (Account $account, Prevision $prevision)
    {
        $user = auth()->user();
        if (!$user || $account->user_id !== $user->id) {
            return response()->json(['error' => 'Accès non autorisé.'], 403);
        }

        if ($prevision->account_id !== $account->id) {
            return response()->json(['error' => 'Ressource non trouvée.'], 404);
        }

        return response()->json($prevision);
    }

    public function store(Request $request, Account $account)
    {
        $user = auth()->user();
        if (!$user || $account->user_id !== $user->id) {
            return response()->json(['error' => 'Accès non autorisé.'], 403);
        }

        $data = $request->validate([
            'date_prevision' => ['required', 'date'],
            'total_income' => ['required', 'numeric', 'min:0'],
            'total_expense' => ['required', 'numeric', 'min:0'],
            'total_interest' => ['required', 'numeric', 'min:0'],
            'total_final' => ['required', 'numeric'],
        ]);

        $data['account_id'] = $account->id;

        $prevision = new Prevision($data);
        $prevision->save();

        return response()->json($prevision, 201);
    }

    public function destroy(Account $account, Prevision $prevision)
    {
        $user = auth()->user();
        if (!$user || $account->user_id !== $user->id) {
            return response()->json(['error' => 'Accès non autorisé.'], 403);
        }

        if ($prevision->account_id !== $account->id) {
            return response()->json(['error' => 'Ressource non trouvée.'], 404);
        }

        $prevision->delete();
        return response()->json(null, 204);
    }
}
