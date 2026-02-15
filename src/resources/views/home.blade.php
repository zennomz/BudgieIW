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
        <x-card>
            
            <div class="grid grid-cols-3 gap-3 mb-4">
                <x-card :padded="false" class="p-4">
                    <h4 class="text-xs font-semibold uppercase tracking-wider text-budgie-muted mb-1.5">Valeur totale</h4>
                    <p class="">32 450 €</p>
                    <span class="">+2,3% ce mois</span>
                </x-card>

                <x-card :padded="false" class="p-4">
                    <h4 class="">Cash</h4>
                    <p class="">7 200 €</p>
                    <span class="">Comptes à vue</span>
                </x-card>

                <x-card :padded="false" class="p-4">
                    <h4 class="">Investi</h4>
                    <p class="">25 250 €</p>
                    <span class="">CTO, Livrets</span>
                </x-card>
            </div>

            <!-- Transactions Prévisions -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <x-card :padded="false" class="p-4">
                    <h4 class="text-sm font-bold mb-2">Mouvements récents</h4>
                    <table class="w-full text-sm">
                        <thead>
                            <tr class="border-b border-dashed border-white/5">
                                <th class="">Date</th>
                                <th class="">Libellé</th>
                                <th class="">Montant</th>
                            </tr>
                        </thead>
                        <tbody class="">
                            <tr>
                                <td >01/10/2025</td>
                                <td class="">Salaire</td>
                                <td class="">
                                    <span class="">+1 170 €</span>
                                </td>
                            </tr>
                            <tr>
                                <td class="">02/10/2025</td>
                                <td class="">Crédit Moto</td>
                                <td class="">
                                    <span class="">-250 €</span>
                                </td>
                            </tr>
                            <tr>
                                <td class="">05/10/2025</td>
                                <td class="">Alimentation CTO</td>
                                <td class="">
                                    <span class="">+50 €</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </x-card>

                <x-card :padded="false" class="p-4">
                    <h4 class="">Prévision rapide</h4>
                    <p class="">
                        Solde estimé au 31/12/2035 : <strong class="text-budgie-text">98 320 €</strong> (net)
                    </p>
                    <p class="">
                        Hypothèses: intérêts mensuels, revenus & dépenses récurrentes.
                    </p>
                    <x-button variant="primary" class="w-full text-sm">
                        Ouvrir les prévisions
                    </x-button>
                </x-card>
            </div>
        </x-card>
    </div>
</div>
@endsection
