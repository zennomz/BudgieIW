@extends('layouts.app')

@section('title', 'Invitation invalide - Budgie')

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
        <h1 class="text-2xl font-bold text-center mb-2">Invitation invalide</h1>

        <!-- Message -->
        <p class="text-budgie-muted text-center mb-6">
            {{ $message ?? "Ce lien d'invitation est invalide, a déjà été utilisé ou a été révoqué." }}
        </p>

        <a href="{{ route('accounts.index') }}">
            <x-button type="button" variant="primary" class="w-full">
                Retour à mes comptes
            </x-button>
        </a>
    </x-card>
</div>
@endsection
