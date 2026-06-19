@extends('layouts.app')

@section('title', 'Dashboard Admin - Budgie')

@section('content')
<div class="max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-12">
        <div class="flex items-center gap-4">
            <h1 class="text-3xl font-bold">Gestion des Utilisateurs</h1>
        </div>

        <div class="flex items-center gap-4">
            <div class="relative">
                <input
                    type="text"
                    placeholder="Filtrer par nom, prénom ou email"
                    class="w-72 px-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-lg text-budgie-text placeholder-budgie-muted focus:outline-none focus:ring-2 focus:ring-budgie-accent focus:border-transparent transition-all"
                    id="search-users"
                />
            </div>
        </div>
    </div>

    <x-card :padded="false" class="overflow-hidden">
        <table class="w-full" id="users-table">
            <thead>
                <tr class="border-b border-white/10">
                    <th class="px-10 py-6 text-left text-xs font-semibold uppercase tracking-widest text-budgie-muted">ID</th>
                    <th class="px-10 py-6 text-left text-xs font-semibold uppercase tracking-widest text-budgie-muted">Utilisateur</th>
                    <th class="px-10 py-6 text-left text-xs font-semibold uppercase tracking-widest text-budgie-muted">Email</th>
                    <th class="px-10 py-6 text-left text-xs font-semibold uppercase tracking-widest text-budgie-muted">Rôle</th>
                    <th class="px-10 py-6 text-left text-xs font-semibold uppercase tracking-widest text-budgie-muted">Statut</th>
                    <th class="px-10 py-6 text-right text-xs font-semibold uppercase tracking-widest text-budgie-muted"></th>
                </tr>
            </thead>
            <tbody>
                @forelse($users as $user)
                    <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors" data-user-id="{{ $user->id }}">
                        <td class="px-8 py-5 text-budgie-muted font-mono">#{{ $user->id }}</td>
                        <td class="px-8 py-5 font-medium">{{ $user->firstname }} {{ $user->lastname }}</td>
                        <td class="px-8 py-5 text-budgie-muted">{{ $user->email }}</td>
                        <td class="px-8 py-5">
                            <span class="px-3 py-1 bg-white/10 rounded-lg font-semibold text-sm">
                                {{ ucfirst($user->role) }}
                            </span>
                        </td>
                        <td class="px-8 py-5">
                            @if($user->is_active)
                                <span class="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg font-semibold text-sm">
                                    Actif
                                </span>
                            @else
                                <span class="px-3 py-1.5 bg-budgie-danger/20 text-budgie-danger rounded-lg font-semibold text-sm">
                                    Inactif
                                </span>
                            @endif
                        </td>
                        <td class="px-8 py-5 text-right">
                            @if($user->id !== auth()->id())
                                <x-button variant="secondary" onclick="openEditModal({{ $user->id }}, {{ json_encode($user->firstname . ' ' . $user->lastname) }}, {{ json_encode($user->email) }}, {{ json_encode($user->role) }}, {{ $user->is_active ? 'true' : 'false' }})">
                                    Modifier
                                </x-button>
                            @else
                                <span class="text-xs text-budgie-muted italic">Compte Actuel</span>
                            @endif
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="px-8 py-16 text-center text-budgie-muted">
                            Aucun utilisateur trouvé.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </x-card>
</div>

<div id="modal-edit-user" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/60 backdrop-blur-sm">
    <div class="bg-budgie-card border border-white/10 rounded-budgie p-6 max-w-md mx-4 shadow-budgie w-full">
        <h2 class="text-xl font-bold mb-6">Modifier l'utilisateur</h2>

        <form id="form-edit-user" class="space-y-4">
            @csrf
            @method('PUT')
            <input type="hidden" id="edit-user-id">

            <x-input label="Utilisateur" name="fullname" type="text" disabled class="opacity-50 cursor-not-allowed bg-white/[0.02] border-white/5" />

            <x-input label="Adresse Email" name="email" type="email" disabled class="opacity-50 cursor-not-allowed bg-white/[0.02] border-white/5" />

            <div class="space-y-2">
                <label class="block text-sm text-budgie-muted">Rôle de l'utilisateur</label>
                <select name="role" class="w-full px-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-lg text-budgie-text focus:outline-none focus:ring-2 focus:ring-budgie-accent focus:border-transparent transition-all">
                    <option value="user" class="bg-budgie-card text-budgie-text">User</option>
                    <option value="admin" class="bg-budgie-card text-budgie-text">Admin</option>
                </select>
            </div>

            <div class="space-y-2 pt-2">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="is_active" id="edit-active-checkbox" class="w-4 h-4 rounded bg-white/10 border-white/20 text-budgie-accent focus:ring-budgie-accent">
                    <span class="text-sm text-budgie-muted">Compte actif</span>
                </label>
            </div>

            <div class="flex justify-end gap-3 pt-6">
                <x-button variant="secondary" type="button" onclick="closeEditModal()">
                    Annuler
                </x-button>
                <x-button variant="primary" type="submit">
                    Enregistrer
                </x-button>
            </div>
        </form>
    </div>
</div>

<script>
    function openEditModal(id, fullname, email, role, isActive) {
        document.getElementById('edit-user-id').value = id;
        const form = document.getElementById('form-edit-user');
        form.querySelector('[name="fullname"]').value = fullname;
        form.querySelector('[name="email"]').value = email;
        form.querySelector('[name="role"]').value = role;

        document.getElementById('edit-active-checkbox').checked = isActive;

        document.getElementById('modal-edit-user').classList.remove('hidden');
        document.getElementById('modal-edit-user').classList.add('flex');
    }

    function closeEditModal() {
        document.getElementById('modal-edit-user').classList.add('hidden');
        document.getElementById('modal-edit-user').classList.remove('flex');
    }

    document.getElementById('modal-edit-user').addEventListener('click', function(e) {
        if (e.target === this) closeEditModal();
    });

    document.getElementById('form-edit-user').addEventListener('submit', async function(e) {
        e.preventDefault();

        const userId = document.getElementById('edit-user-id').value;
        const submitBtn = this.querySelector('button[type="submit"]');
        const form = this;

        const data = {
            role: form.querySelector('[name="role"]').value,
            is_active: document.getElementById('edit-active-checkbox').checked ? 1 : 0
        };

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Enregistrement...';

            const response = await fetch(`/admin/utilisateurs/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                window.location.reload();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Erreur lors de la mise à jour de l\'utilisateur.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Enregistrer';
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur de communication avec le serveur.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Enregistrer';
        }
    });

    document.getElementById('search-users').addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#users-table tbody tr[data-user-id]');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            if (text.includes(query)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
</script>
@endsection
