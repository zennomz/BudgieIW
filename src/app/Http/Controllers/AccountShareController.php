<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Models\AccountShare;
use function App\Mail\shareAccountMail;
use Illuminate\Http\Request;

class AccountShareController extends Controller
{
    /**
     * Liste des comptes partagés avec l'utilisateur connecté (lecture seule).
     */
    public function shared()
    {
        $user = auth()->user();
        if (!$user) {
            return redirect()->route('login');
        }

        $accounts = $user->sharedAccounts()->orderBy('name')->get();

        return view('accounts.shared', ['accounts' => $accounts]);
    }

    /**
     * Envoie une invitation de partage pour un compte.
     */
    public function store(Request $request, Account $account)
    {
        $user = auth()->user();
        if (!$account->isOwnedBy($user)) {
            return response()->json(['error' => 'Accès non autorisé.'], 403);
        }

        $data = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $email = strtolower($data['email']);

        if ($email === strtolower($user->email)) {
            return response()->json(['message' => 'Vous ne pouvez pas partager un compte avec vous-même.'], 422);
        }

        $existing = AccountShare::where('account_id', $account->id)
            ->where('email', $email)
            ->whereIn('status', [AccountShare::STATUS_PENDING, AccountShare::STATUS_ACCEPTED])
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Ce compte est déjà partagé (ou une invitation est déjà en attente) avec cette adresse.'], 422);
        }

        $token = bin2hex(random_bytes(32));

        $share = AccountShare::updateOrCreate(
            ['account_id' => $account->id, 'email' => $email],
            [
                'user_id' => null,
                'token' => $token,
                'status' => AccountShare::STATUS_PENDING,
                'accepted_at' => null,
            ]
        );

        shareAccountMail($email, $account->name, trim($user->firstname . ' ' . $user->lastname), $token);

        return response()->json($share, 201);
    }

    /**
     * Révoque un partage (l'invité perd l'accès immédiatement).
     */
    public function destroy(Account $account, AccountShare $share)
    {
        $user = auth()->user();
        if (!$account->isOwnedBy($user) || $share->account_id !== $account->id) {
            return response()->json(['error' => 'Accès non autorisé.'], 403);
        }

        $share->update([
            'status' => AccountShare::STATUS_REVOKED,
            'token' => null,
        ]);

        return response()->json(null, 204);
    }

    /**
     * Acceptation d'une invitation via le lien reçu par email.
     */
    public function accept(Request $request)
    {
        $user = auth()->user();
        $email = $request->query('email');
        $token = $request->query('token');

        if (!$email || !$token) {
            return view('accounts.share-failed');
        }

        $share = AccountShare::where('email', strtolower($email))
            ->where('token', $token)
            ->where('status', AccountShare::STATUS_PENDING)
            ->first();

        if (!$share) {
            return view('accounts.share-failed');
        }

        if (strtolower($user->email) !== strtolower($email)) {
            return view('accounts.share-failed', [
                'message' => "Connectez-vous avec l'adresse email invitée ($email) pour accepter ce partage.",
            ]);
        }

        $share->update([
            'user_id' => $user->id,
            'status' => AccountShare::STATUS_ACCEPTED,
            'accepted_at' => now(),
            'token' => null,
        ]);

        return view('accounts.share-accepted', ['account' => $share->account]);
    }
}
