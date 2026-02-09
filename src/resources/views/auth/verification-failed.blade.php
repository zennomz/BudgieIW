@extends('layouts.app')

@section('title', 'Erreur de vérification - Budgie')

@section('content')
<div class="max-w-lg mx-auto mt-16">
    <x-card>
        <!-- Icône erreur -->
        <div class="flex justify-center mb-6">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-budgie-danger/20 to-budgie-warning/20 flex items-center justify-center">
                <svg class="w-10 h-10 text-budgie-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </div>
        </div>

        <!-- Titre -->
        <h1 class="text-2xl font-bold text-center mb-2">Échec de la vérification</h1>
        
        <!-- Message -->
        <p class="text-budgie-muted text-center mb-6">
            Le lien de vérification est invalide ou a expiré. Veuillez réessayer ou créer un nouveau compte.
        </p>

        <!-- Alerte erreur -->
        <x-alert type="danger" class="mb-6">
            <div class="flex items-start gap-3">
                <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-sm">
                    Le token de vérification n'a pas pu être validé.
                </p>
            </div>
        </x-alert>

        <!-- Actions -->
        <div class="space-y-3">
            <a href="{{ route('register') }}">
                <x-button type="button" variant="primary" class="w-full">
                    Créer un nouveau compte
                </x-button>
            </a>

            <p class="text-sm text-budgie-muted text-center">
                Déjà un compte vérifié ?
                <a href="{{ route('login') }}" class="text-budgie-accent hover:underline">
                    Se connecter
                </a>
            </p>
        </div>
    </x-card>
</div>
@endsection
