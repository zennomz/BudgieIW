@extends('layouts.app')

@section('title', 'Connexion - Budgie')

@section('content')
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
    <!-- Formulaire de connexion -->
    <x-card>
        <h3 class="text-2xl font-bold mb-6">Se connecter</h3>

        @if($errors->any())
            <x-alert type="danger" class="mb-4">
                <ul class="list-disc list-inside space-y-1">
                    @foreach($errors->all() as $error)
                        <li class="text-sm">{{ $error }}</li>
                    @endforeach
                </ul>
            </x-alert>
        @endif

        <form method="POST" action="{{ route('login.store') }}" class="space-y-4">
            @csrf

            <x-input
                label="Email"
                name="email"
                type="email"
                :value="old('email')"
                placeholder="vous@exemple.com"
                required
            />

            <x-input
                label="Mot de passe"
                name="password"
                type="password"
                placeholder="••••••••"
                required
            />

            <x-button type="submit" variant="primary" class="w-full mt-6">
                Connexion
            </x-button>

            <p class="text-sm text-budgie-muted text-center mt-4">
                Pas de compte ?
                <a href="{{ route('register') }}" class="text-budgie-accent hover:underline">
                    Inscription
                </a>
            </p>
        </form>
    </x-card>

    <!-- Informations sécurité -->
    <x-card>
        <h3 class="text-xl font-bold mb-3">Sécurité</h3>
        <p class="text-sm text-budgie-muted leading-relaxed">
            Vos identifiants sont chiffrés et sécurisés. Ne partagez jamais votre mot de passe.
        </p>
    </x-card>
</div>
@endsection
