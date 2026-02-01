@extends('layouts.app')

@section('title', 'Inscription - Budgie')

@section('content')
<div class="max-w-2xl mx-auto mt-8">
    <x-card>
        <h3 class="text-2xl font-bold mb-6">Créer un compte</h3>

        @if($errors->any())
            <x-alert type="danger" class="mb-6">
                <ul class="list-disc list-inside space-y-1">
                    @foreach($errors->all() as $error)
                        <li class="text-sm">{{ $error }}</li>
                    @endforeach
                </ul>
            </x-alert>
        @endif

        <form method="POST" action="{{ route('register.store') }}" class="space-y-4">
            @csrf

            <!-- Nom et Prénom -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <x-input
                    label="Prénom"
                    name="firstname"
                    type="text"
                    :value="old('firstname')"
                    placeholder="John"
                />

                <x-input
                    label="Nom"
                    name="lastname"
                    type="text"
                    :value="old('lastname')"
                    placeholder="Doe"
                />
            </div>

            <!-- Email -->
            <x-input
                label="Email"
                name="email"
                type="email"
                :value="old('email')"
                placeholder="vous@exemple.com"
                required
            />

            <!-- Mots de passe -->
            <x-input
                label="Mot de passe"
                name="password"
                type="password"
                placeholder="Minimum 8 caractères"
                required
            />

            <x-input
                label="Confirmer le mot de passe"
                name="password_confirmation"
                type="password"
                placeholder="Répétez votre mot de passe"
                required
            />

            <!-- Date de naissance -->
            <x-input
                label="Date de naissance"
                name="date_of_birth"
                type="date"
                :value="old('date_of_birth')"
            />

            <!-- Téléphone -->
            <x-input
                label="Numéro de téléphone"
                name="numero_phone"
                type="tel"
                :value="old('numero_phone')"
                placeholder="+33 6 12 34 56 78"
            />

            <x-button type="submit" variant="primary" class="w-full mt-6">
                Créer mon compte
            </x-button>

            <p class="text-sm text-budgie-muted text-center mt-4">
                Déjà un compte ?
                <a href="{{ route('login') }}" class="text-budgie-accent hover:underline">
                    Se connecter
                </a>
            </p>
        </form>
    </x-card>
</div>
@endsection
