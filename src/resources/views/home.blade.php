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
                Suivi des comptes, revenus, dépenses et prévisions — sans connecter ta banque.
                Inspiré par Finary, pensé pour la confidentialité.
            </p>

            <div class="inline-block px-4 py-2 bg-budgie-accent/10 border border-budgie-accent/20 rounded-lg">
                <p class="text-budgie-accent font-medium">
                    Bienvenue <strong>{{ auth()->user()->firstname }} {{ auth()->user()->lastname }}</strong>
                </p>
            </div>

            <div class="flex items-center gap-3 flex-wrap pt-2">
                <x-button variant="secondary" onclick="location.href='{{ route('home') }}'">
                    Voir la démo
                </x-button>
            </div>

            <div class="flex items-center gap-3 pt-2">
                <span class="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10">SSL</span>
                <span class="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10">Sans pub</span>
                <span class="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10">Export CSV</span>
            </div>
        </div>

        <!-- Dashboard Preview -->
        <x-card class="space-y-4">
            <!-- Valeur totale (mise en avant) -->
            <x-card :padded="false" class="p-4">
                <div class="flex items-end justify-between gap-3">
                    <div>
                        <h4 class="text-xs font-semibold uppercase tracking-wider text-budgie-muted mb-1.5">Valeur totale</h4>
                        <p class="text-3xl font-bold">32 450 €</p>
                    </div>
                    <span class="text-sm font-medium text-budgie-success whitespace-nowrap">+2,3 % ce mois</span>
                </div>
            </x-card>

            <!-- Cash / Investi -->
            <div class="grid grid-cols-2 gap-3">
                <x-card :padded="false" class="p-4">
                    <h4 class="text-xs font-semibold uppercase tracking-wider text-budgie-muted mb-1.5">Cash</h4>
                    <p class="text-lg font-bold">7 200 €</p>
                    <span class="text-xs text-budgie-muted">Comptes à vue</span>
                </x-card>

                <x-card :padded="false" class="p-4">
                    <h4 class="text-xs font-semibold uppercase tracking-wider text-budgie-muted mb-1.5">Investi</h4>
                    <p class="text-lg font-bold">25 250 €</p>
                    <span class="text-xs text-budgie-muted">CTO, Livrets</span>
                </x-card>
            </div>

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
                        <tr class="border-b border-white/5">
                            <td class="py-2 text-budgie-muted">01/10/2025</td>
                            <td class="py-2">Salaire</td>
                            <td class="py-2 text-right text-budgie-success font-medium">+1 170 €</td>
                        </tr>
                        <tr class="border-b border-white/5">
                            <td class="py-2 text-budgie-muted">02/10/2025</td>
                            <td class="py-2">Crédit Moto</td>
                            <td class="py-2 text-right text-budgie-danger font-medium">-250 €</td>
                        </tr>
                        <tr>
                            <td class="py-2 text-budgie-muted">05/10/2025</td>
                            <td class="py-2">Alimentation CTO</td>
                            <td class="py-2 text-right text-budgie-success font-medium">+50 €</td>
                        </tr>
                    </tbody>
                </table>
            </x-card>

            <!-- Prévision rapide -->
            <x-card :padded="false" class="p-4">
                <div class="flex items-center justify-between mb-2">
                    <h4 class="text-sm font-bold">Prévision rapide</h4>
                    <span class="text-xs text-budgie-muted">au 31/12/2035</span>
                </div>
                <p class="text-sm text-budgie-muted mb-1">
                    Solde net estimé : <strong class="text-budgie-text text-base">98 320 €</strong>
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
