@extends('layouts.app')

@section('title', 'Prévisions - ' . $account->name . ' - Budgie')

@section('content')
<div class="max-w-6xl mx-auto">
    <!-- Header avec navigation -->
    <div class="flex flex-col md:flex-row md:items-center gap-4 mb-12">
        <a href="{{ route('accounts.show', $account->id) }}" class="p-2 rounded-lg hover:bg-white/5 transition-colors self-start">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
        </a>
        <div class="flex-1">
            <h1 class="text-3xl font-bold">Prévisions - {{ $account->name }}</h1>
            <p class="text-budgie-muted">
                État projeté au {{ $mois->locale('fr')->isoFormat('MMMM YYYY') }}.
            </p>
        </div>

        <!-- Sélecteur de mois -->
        <form method="GET" action="{{ route('previsions.index', $account->id) }}" class="flex items-end gap-3">
            <div class="w-48">
                <x-input
                    label="Mois cible"
                    name="month"
                    type="month"
                    :value="$mois->format('Y-m')"
                />
            </div>
            <x-button variant="primary" type="submit">Calculer</x-button>
        </form>
    </div>

    <!-- Cartes KPI -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <x-card>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-budgie-muted mb-2">Total revenus</h4>
            <p class="text-2xl font-bold text-budgie-success">
                +{{ number_format($resultat['total_income'], 2, ',', ' ') }} €
            </p>
        </x-card>

        <x-card>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-budgie-muted mb-2">Total dépenses</h4>
            <p class="text-2xl font-bold text-budgie-danger">
                -{{ number_format($resultat['total_expense'], 2, ',', ' ') }} €
            </p>
        </x-card>

        <x-card>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-budgie-muted mb-2">Intérêts nets</h4>
            <p class="text-2xl font-bold text-budgie-text">
                {{ number_format($resultat['total_interest'], 2, ',', ' ') }} €
            </p>
        </x-card>

        <x-card>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-budgie-muted mb-2">Solde net à la date</h4>
            <p class="text-2xl font-bold {{ $resultat['total_final'] >= 0 ? 'text-budgie-success' : 'text-budgie-danger' }}">
                {{ number_format($resultat['total_final'], 2, ',', ' ') }} €
            </p>
        </x-card>
    </div>
</div>
@endsection
