@extends('layouts.app')

@section('title', 'Abonnement - Budgie')

@section('content')
<div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="text-center mb-10">
        <h1 class="text-3xl font-bold mb-2">Choisissez votre abonnement</h1>
        <p class="text-budgie-muted">
            Votre plan actuel :
            @if($user->isPremium())
                <span class="inline-block px-3 py-1 rounded-full bg-budgie-accent/20 text-budgie-accent font-semibold">Premium</span>
            @else
                <span class="inline-block px-3 py-1 rounded-full bg-white/10 font-semibold">Gratuit</span>
            @endif
        </p>
    </div>
    <br>

    <!-- Messages flash -->
    @if(session('status'))
        <x-alert type="success" class="mb-6">{{ session('status') }}</x-alert>
    @endif
    @if(session('error'))
        <x-alert type="danger" class="mb-6">{{ session('error') }}</x-alert>
    @endif

    <!-- Plans -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Grrrrratos -->
        <x-card class="flex flex-col">
            <h2 class="text-xl font-bold mb-1">Gratuit</h2>
            <p class="text-3xl font-bold mb-4">0 € <span class="text-base font-normal text-budgie-muted">/ mois</span></p>
            <ul class="space-y-2 text-sm text-budgie-muted mb-6 flex-1">
                <li>✓ {{ $limits['accounts'] }} comptes maximum</li>
                <li>✓ {{ $limits['expenses'] }} dépenses par compte</li>
                <li>✓ {{ $limits['incomes'] }} revenus par compte</li>
            </ul>
            @if($user->isPremium())
                <form method="POST" action="{{ route('subscription.downgrade') }}">
                    @csrf
                    <x-button variant="secondary" type="submit" class="w-full">Revenir au gratuit</x-button>
                </form>
            @else
                <x-button variant="secondary" type="button" class="w-full" disabled>Plan actuel</x-button>
            @endif
        </x-card>

        <!-- Premium -->
        <x-card class="flex flex-col border-budgie-accent/40">
            <h2 class="text-xl font-bold mb-1">Premium</h2>
            <p class="text-3xl font-bold mb-4">19,00 € <span class="text-base font-normal text-budgie-muted">/ mois</span></p>
            <ul class="space-y-2 text-sm text-budgie-muted mb-6 flex-1">
                <li>✓ Comptes illimités</li>
                <li>✓ Dépenses illimitées</li>
                <li>✓ Revenus illimités</li>
            </ul>
            @if($user->isPremium())
                <x-button variant="primary" type="button" class="w-full" disabled>Plan actuel</x-button>
            @else
                <form method="POST" action="{{ route('subscription.checkout') }}">
                    @csrf
                    <x-button variant="primary" type="submit" class="w-full">Passer Premium</x-button>
                </form>
            @endif
        </x-card>
    </div>
</div>
@endsection
