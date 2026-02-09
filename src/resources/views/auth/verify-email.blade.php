@extends('layouts.app')

@section('title', 'Vérifiez votre email - Budgie')

@section('content')
<div class="max-w-lg mx-auto mt-16">
    <x-card>
        <!-- Icône email -->
        <div class="flex justify-center mb-6">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-budgie-accent/20 to-budgie-accent-2/20 flex items-center justify-center">
                <svg class="w-10 h-10 text-budgie-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
            </div>
        </div>

        <!-- Titre -->
        <h1 class="text-2xl font-bold text-center mb-2">Compte créé avec succès !</h1>
        
        <!-- Message -->
        <p class="text-budgie-muted text-center mb-6">
            Un email de vérification a été envoyé à votre adresse. 
            Veuillez cliquer sur le lien dans l'email pour activer votre compte.
        </p>

        <!-- Alerte info -->
        <x-alert type="warning" class="mb-6">
            <div class="flex items-start gap-3">
                <svg class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <p class="text-sm">
                    Pensez à vérifier votre dossier spam si vous ne trouvez pas l'email.
                </p>
            </div>
        </x-alert>

        <!-- Actions -->
        <div class="space-y-3">
            <a href="{{ route('login') }}">
                <x-button type="button" variant="primary" class="w-full">
                    Aller à la connexion
                </x-button>
            </a>

            <p class="text-sm text-budgie-muted text-center">
                Vous n'avez pas reçu l'email ?
                <a href="{{ route('home') }}" class="text-budgie-accent hover:underline">
                    Renvoyer l'email
                </a>
            </p>
        </div>
    </x-card>
</div>
@endsection
