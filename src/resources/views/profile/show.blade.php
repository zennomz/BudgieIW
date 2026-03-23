@extends('layouts.app')

@section('title', 'Profil - Budgie')

@section('content')
<div class="max-w-5xl mx-auto">
    <h1 class="text-3xl font-bold mb-8">Profil</h1>

    @if(session('status'))
        <x-alert type="success" class="mb-6">
            {{ session('status') }}
        </x-alert>
    @endif

    @if($errors->any())
        <x-alert type="danger" class="mb-6">
            <ul class="list-disc pl-5 space-y-1">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </x-alert>
    @endif

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <x-card class="p-6">
            <h2 class="text-2xl font-semibold mb-6">Informations</h2>

            <x-alert id="profile-success" type="success" class="mb-4 hidden"></x-alert>
            <x-alert id="profile-errors" type="danger" class="mb-4 hidden">
                <ul id="profile-errors-list" class="list-disc pl-5 space-y-1"></ul>
            </x-alert>

            <form id="profile-form" method="POST" action="{{ route('profile.update') }}" class="space-y-4">
                @csrf
                @method('PUT')

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <x-input
                        label="Prenom"
                        name="firstname"
                        :value="old('firstname', $user->firstname)"
                        required
                        placeholder="Ex: Jean"
                    />

                    <x-input
                        label="Nom"
                        name="lastname"
                        :value="old('lastname', $user->lastname)"
                        required
                        placeholder="Ex: Dupont"
                    />
                </div>

                <x-input
                    label="Email"
                    name="email"
                    type="email"
                    :value="old('email', $user->email)"
                    required
                />

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <x-input
                        label="Telephone"
                        name="numero_phone"
                        :value="old('numero_phone', $user->numero_phone)"
                        placeholder="Ex: +33 6 00 00 00 00"
                    />

                    <x-input
                        label="Date de naissance"
                        name="date_of_birth"
                        type="date"
                        :value="old('date_of_birth', optional($user->date_of_birth)->format('Y-m-d'))"
                    />
                </div>

                <x-button id="profile-submit" type="submit" variant="primary" class="w-full justify-center">
                    Enregistrer
                </x-button>
            </form>
        </x-card>

        <x-card class="p-6">
            <h2 class="text-2xl font-semibold mb-6">Abonnement</h2>

            <p class="text-budgie-muted mb-4">
                Plan actuel : Gratuit
            </p>

            <x-button variant="secondary" type="button">
                Voir les offres
            </x-button>
        </x-card>
    </div>

    <p class="text-budgie-muted mt-16 text-sm">
        &copy; Profil - Budgie
    </p>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('profile-form');
    if (!form) return;

    const submitButton = document.getElementById('profile-submit');
    const successBox = document.getElementById('profile-success');
    const errorBox = document.getElementById('profile-errors');
    const errorList = document.getElementById('profile-errors-list');
    const initialSubmitText = submitButton ? submitButton.textContent.trim() : 'Enregistrer';

    const hideMessages = () => {
        if (successBox) {
            successBox.classList.add('hidden');
            successBox.textContent = '';
        }
        if (errorBox) {
            errorBox.classList.add('hidden');
        }
        if (errorList) {
            errorList.innerHTML = '';
        }
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        hideMessages();

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Enregistrement...';
            submitButton.classList.add('opacity-70', 'cursor-not-allowed');
        }

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: new FormData(form),
                credentials: 'same-origin',
            });

            const payload = await response.json().catch(() => ({}));

            if (!response.ok) {
                if (response.status === 422 && payload.errors && errorList && errorBox) {
                    Object.values(payload.errors).flat().forEach((message) => {
                        const item = document.createElement('li');
                        item.textContent = message;
                        errorList.appendChild(item);
                    });
                    errorBox.classList.remove('hidden');
                } else if (errorList && errorBox) {
                    const item = document.createElement('li');
                    item.textContent = payload.message || 'Une erreur est survenue lors de la mise a jour.';
                    errorList.appendChild(item);
                    errorBox.classList.remove('hidden');
                }
                return;
            }

            if (successBox) {
                successBox.textContent = 'Profil mis a jour avec succes.';
                successBox.classList.remove('hidden');
            }
        } catch (error) {
            if (errorList && errorBox) {
                const item = document.createElement('li');
                item.textContent = 'Impossible de contacter le serveur. Reessaie dans quelques instants.';
                errorList.appendChild(item);
                errorBox.classList.remove('hidden');
            }
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = initialSubmitText;
                submitButton.classList.remove('opacity-70', 'cursor-not-allowed');
            }
        }
    });
});
</script>
@endsection
