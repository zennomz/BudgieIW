@extends('layouts.app')

@section('title', 'Compte vérifié - Budgie')

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
        <h1 class="text-2xl font-bold text-center mb-2">Compte vérifié avec succès !</h1>
        
        <!-- Message -->
        <p class="text-budgie-muted text-center mb-6">
            Votre adresse email a été vérifiée. Vous pouvez maintenant vous connecter et profiter de toutes les fonctionnalités de Budgie.
        </p>

        <!-- Alerte succès -->
        <x-alert type="success" class="mb-6">
            <div class="flex items-start gap-3">
                <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-sm">
                    Votre compte est maintenant actif et prêt à être utilisé.
                </p>
            </div>
        </x-alert>

        <!-- Action -->
        <a href="{{ route('login') }}">
            <x-button type="button" variant="primary" class="w-full">
                Se connecter
            </x-button>
        </a>
    </x-card>
</div>
@endsection
