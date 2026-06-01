@extends('layouts.app')

@section('title', 'Prévisions - Budgie')

@section('content')
<div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
        <div>
            <h1 class="text-3xl font-bold">Prévisions</h1>
            <p class="text-budgie-muted">État projeté de tous vos comptes au mois choisi.</p>
        </div>

        <!-- Sélecteur de mois -->
        <form method="GET" action="{{ route('previsions.overview') }}" class="flex items-end gap-3">
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

    <!-- Tableau des comptes -->
    <x-card :padded="false" class="overflow-hidden">
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="border-b border-white/10 text-left text-xs uppercase tracking-wider text-budgie-muted">
                        <th class="px-6 py-4">Compte</th>
                        <th class="px-6 py-4 text-right">Revenus</th>
                        <th class="px-6 py-4 text-right">Dépenses</th>
                        <th class="px-6 py-4 text-right">Intérêts nets</th>
                        <th class="px-6 py-4 text-right">Solde net</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse($lignes as $ligne)
                        <tr class="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition-colors">
                            <td class="px-6 py-4">
                                <a href="{{ route('previsions.index', $ligne['account']->id) }}?month={{ $mois->format('Y-m') }}" class="font-medium hover:text-budgie-accent transition-colors">
                                    {{ $ligne['account']->name }}
                                </a>
                            </td>
                            <td class="px-6 py-4 text-right text-budgie-success">
                                +{{ number_format($ligne['total_income'], 2, ',', ' ') }} €
                            </td>
                            <td class="px-6 py-4 text-right text-budgie-danger">
                                -{{ number_format($ligne['total_expense'], 2, ',', ' ') }} €
                            </td>
                            <td class="px-6 py-4 text-right text-budgie-muted">
                                {{ number_format($ligne['total_interest'], 2, ',', ' ') }} €
                            </td>
                            <td class="px-6 py-4 text-right font-bold {{ $ligne['total_final'] >= 0 ? 'text-budgie-success' : 'text-budgie-danger' }}">
                                {{ number_format($ligne['total_final'], 2, ',', ' ') }} €
                            </td>
                        </tr>
                    @empty
                        <tr>
                            <td colspan="5" class="px-6 py-8 text-center text-budgie-muted">
                                Aucun compte. Créez d'abord un compte pour voir vos prévisions.
                            </td>
                        </tr>
                    @endforelse
                </tbody>
                @if(count($lignes) > 0)
                    <tfoot>
                        <tr class="border-t border-white/10 font-bold">
                            <td class="px-6 py-4">Total général</td>
                            <td class="px-6 py-4 text-right text-budgie-success">
                                +{{ number_format($totaux['total_income'], 2, ',', ' ') }} €
                            </td>
                            <td class="px-6 py-4 text-right text-budgie-danger">
                                -{{ number_format($totaux['total_expense'], 2, ',', ' ') }} €
                            </td>
                            <td class="px-6 py-4 text-right text-budgie-muted">
                                {{ number_format($totaux['total_interest'], 2, ',', ' ') }} €
                            </td>
                            <td class="px-6 py-4 text-right {{ $totaux['total_final'] >= 0 ? 'text-budgie-success' : 'text-budgie-danger' }}">
                                {{ number_format($totaux['total_final'], 2, ',', ' ') }} €
                            </td>
                        </tr>
                    </tfoot>
                @endif
            </table>
        </div>
    </x-card>
</div>
@endsection
