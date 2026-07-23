@extends('layouts.app')

@section('title', 'Accueil - Budgie')

@section('content')
<div class="max-w-6xl mx-auto">
    <!-- Hero Section -->
    <div class="grid grid-cols-1 lg:grid-cols-[1.2fr,0.8fr] gap-8 items-center py-12">
        <div class="space-y-6">
            <h1 class="text-4xl md:text-5xl font-bold leading-tight">
                Ton partenaire financier personnel
            </h1>

            <p class="text-lg text-budgie-muted leading-relaxed">
                Suivi des comptes, revenus, dépenses et prévisions sans connecter ta banque.
                Inspiré par Finary, pensé pour la confidentialité.
            </p>

            <div class="inline-block px-4 py-2 bg-budgie-accent/10 border border-budgie-accent/20 rounded-lg">
                <p class="text-budgie-accent font-medium">
                    Bienvenue <strong>{{ auth()->user()->firstname }} {{ auth()->user()->lastname }}</strong>
                </p>
            </div>
        </div>

        <!-- Dashboard Preview -->
        <x-card class="space-y-4">
            <!-- Valeur totale (mise en avant) -->
            <x-card :padded="false" class="p-4">
                <div class="flex items-end justify-between gap-3">
                    <div>
                        <h4 class="text-xs font-semibold uppercase tracking-wider text-budgie-muted mb-1.5">Valeur totale</h4>
                        <p class="text-3xl font-bold {{ $total >= 0 ? '' : 'text-budgie-danger' }}">{{ number_format($total, 2, ',', ' ') }} €</p>
                    </div>
                    <span class="text-sm font-medium text-budgie-muted whitespace-nowrap">{{ $accountsCount }} {{ $accountsCount > 1 ? 'comptes' : 'compte' }}</span>
                </div>
            </x-card>

            <!-- Cash / Investi -->
            <x-card :padded="false" class="p-4">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-budgie-muted mb-1.5">Investi</h4>
                <p class="text-lg font-bold">{{ number_format($investi, 2, ',', ' ') }} €</p>
                <span class="text-xs text-budgie-muted">Comptes rémunérés</span>
            </x-card>

            <!-- Mouvements récents -->
            <x-card :padded="false" class="p-4">
                <h4 class="text-sm font-bold mb-3">Mouvements récents</h4>
                <table class="w-full text-sm">
                    <thead>
                        <tr class="border-b border-white/10 text-left text-xs text-budgie-muted">
                            <th class="font-medium pb-2">Date</th>
                            <th class="font-medium pb-2">Libellé</th>
                            <th class="font-medium pb-2 text-right">Montant</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse($movements as $m)
                            <tr class="border-b border-white/5 last:border-0">
                                <td class="py-2 text-budgie-muted">{{ $m['date'] ? $m['date']->format('d/m/Y') : '—' }}</td>
                                <td class="py-2">{{ $m['name'] }}</td>
                                <td class="py-2 text-right font-medium {{ $m['type'] === 'income' ? 'text-budgie-success' : 'text-budgie-danger' }}">
                                    {{ $m['type'] === 'income' ? '+' : '-' }}{{ number_format($m['amount'], 2, ',', ' ') }} €
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="3" class="py-4 text-center text-budgie-muted">Aucun mouvement pour le moment.</td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </x-card>

            <!-- Prévision rapide -->
            <x-card :padded="false" class="p-4">
                <div class="flex items-center justify-between mb-2">
                    <h4 class="text-sm font-bold">Prévision rapide</h4>
                    <span class="text-xs text-budgie-muted">au {{ $dateCible->format('d/m/Y') }}</span>
                </div>
                <p class="text-sm text-budgie-muted mb-1">
                    Solde net estimé : <strong class="text-base {{ $prevision >= 0 ? 'text-budgie-text' : 'text-budgie-danger' }}">{{ number_format($prevision, 2, ',', ' ') }} €</strong>
                </p>
                <p class="text-xs text-budgie-muted mb-4">
                    Hypothèses : intérêts mensuels, revenus &amp; dépenses récurrentes.
                </p>
                <x-button variant="primary" class="w-full" onclick="location.href='{{ route('previsions.overview') }}'">
                    Ouvrir les prévisions
                </x-button>
            </x-card>
        </x-card>
    </div>
</div>
@endsection
