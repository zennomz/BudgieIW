<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session;

class SubscriptionController extends Controller
{

    public function index()
    {
        return view('subscription.index', [
            'user'   => auth()->user(),
            'limits' => ['accounts' => 2, 'expenses' => 7, 'incomes' => 2],
        ]);
    }


    public function checkout(Request $request)
    {
        $secret = config('services.stripe.secret');
        $price  = config('services.stripe.price');

        if (empty($secret) || empty($price)) {
            return redirect()->route('subscription.index')
                ->with('error', 'Stripe n\'est pas configuré (clés manquantes dans le .env).');
        }

        Stripe::setApiKey($secret);

        $session = Session::create([
            'mode' => 'subscription',
            'customer_email' => auth()->user()->email,
            'line_items' => [[
                'price' => $price,
                'quantity' => 1,
            ]],
            'success_url' => route('subscription.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'  => route('subscription.cancel'),
        ]);

        return redirect($session->url);
    }


    public function success(Request $request)
    {
        $sessionId = $request->query('session_id');

        if ($sessionId) {
            try {
                Stripe::setApiKey(config('services.stripe.secret'));
                $session = Session::retrieve($sessionId);

                if ($session->payment_status === 'paid') {
                    auth()->user()->update(['plan' => 'premium']);
                    return redirect()->route('subscription.index')
                        ->with('status', 'Paiement réussi ! Vous êtes maintenant Premium 🎉');
                }
            } catch (\Exception $e) {
                return redirect()->route('subscription.index')
                    ->with('error', 'Impossible de vérifier le paiement : ' . $e->getMessage());
            }
        }

        return redirect()->route('subscription.index')
            ->with('error', 'Le paiement n\'a pas pu être confirmé.');
    }

    /**
     * Paiement annule
     */
    public function cancel()
    {
        return redirect()->route('subscription.index')
            ->with('error', 'Paiement annulé. Vous êtes toujours sur le plan gratuit.');
    }


    public function downgrade()
    {
        auth()->user()->update(['plan' => 'free']);

        return redirect()->route('subscription.index')
            ->with('status', 'Vous êtes revenu au plan gratuit.');
    }
}
