@extends('layouts.app')

@section('title', 'Comptes partagés - Budgie')

@section('content')
<div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
        <div>
            <h1 class="text-3xl font-bold">Comptes partagés avec moi</h1>
            <p class="text-budgie-muted mt-1">Accès en lecture seule.</p>
        </div>
        <a href="{{ route('accounts.index') }}">
            <x-button variant="secondary">
                Mes comptes
            </x-button>
        </a>
    </div>

    <!-- Liste des comptes partagés -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @forelse($accounts as $account)
            <x-card class="flex flex-col justify-between">
                <div>
                    <h3 class="text-lg font-semibold mb-1">{{ $account->name }}</h3>
                    <p class="text-sm text-budgie-muted mb-4">
                        {{ $account->description ?? 'Compte courant' }}
                    </p>
                </div>

                <div>
                    <a href="{{ route('accounts.show', $account->id) }}" class="inline-block">
                        <x-button variant="secondary">
                            Détails
                        </x-button>
                    </a>
                </div>
            </x-card>
        @empty
            <div class="col-span-full text-center py-12">
                <p class="text-budgie-muted text-lg">Aucun compte ne vous a été partagé pour le moment.</p>
            </div>
        @endforelse
    </div>
</div>
@endsection
