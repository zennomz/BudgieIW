@extends('layouts.app')

@section('title', 'Partage accepté - Budgie')

@section('content')
<div class="max-w-lg mx-auto mt-16">
    <x-card>
        <!-- Icône succès -->
        <div class="flex justify-center mb-6">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-budgie-success/20 to-budgie-accent/20 flex items-center justify-center">
                <svg class="w-10 h-10 text-budgie-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
        </div>

        <!-- Titre -->
        <h1 class="text-2xl font-bold text-center mb-2">Partage accepté !</h1>

        <!-- Message -->
        <p class="text-budgie-muted text-center mb-6">
            Vous avez maintenant accès en lecture seule au compte <strong class="text-budgie-text">{{ $account->name }}</strong>.
        </p>

        <!-- Action -->
        <a href="{{ route('accounts.show', $account->id) }}">
            <x-button type="button" variant="primary" class="w-full">
                Voir le compte
            </x-button>
        </a>
    </x-card>
</div>
@endsection
