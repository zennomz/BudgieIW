@extends('layouts.app')

@section('title', 'Toutes les dépenses - Budgie')

@section('content')
<div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-12">
        <div class="flex items-center gap-4">
            <a href="{{ route('accounts.index') }}" class="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
            </a>
            <h1 class="text-3xl font-bold">Toutes les dépenses</h1>
        </div>
        
        <div class="flex items-center gap-4">
            <!-- Recherche -->
            <div class="relative">
                <input 
                    type="text" 
                    placeholder="Filtrer par nom ou description..." 
                    class="w-72 px-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-lg text-budgie-text placeholder-budgie-muted focus:outline-none focus:ring-2 focus:ring-budgie-accent focus:border-transparent transition-all"
                    id="search-expenses"
                />
            </div>
            
            <!-- Bouton Nouvelle dépense -->
            <x-button variant="primary" onclick="openModal()">
                Nouvelle dépense
            </x-button>
        </div>
    </div>

    <!-- Tableau des dépenses -->
    <x-card :padded="false" class="overflow-hidden">
        <table class="w-full" id="expenses-table">
            <thead>
                <tr class="border-b border-white/10">
                    <th class="px-10 py-6 text-left text-xs font-semibold uppercase tracking-widest text-budgie-muted">Nom</th>
                    <th class="px-10 py-6 text-left text-xs font-semibold uppercase tracking-widest text-budgie-muted">Compte</th>
                    <th class="px-10 py-6 text-left text-xs font-semibold uppercase tracking-widest text-budgie-muted">Récurrence</th>
                    <th class="px-10 py-6 text-left text-xs font-semibold uppercase tracking-widest text-budgie-muted">Montant</th>
                    <th class="px-10 py-6 text-left text-xs font-semibold uppercase tracking-widest text-budgie-muted">Période</th>
                    <th class="px-10 py-6 text-right text-xs font-semibold uppercase tracking-widest text-budgie-muted"></th>
                </tr>
            </thead>
            <tbody>
                @forelse($expenses as $expense)
                    <tr class="border-b border-white/5 hover:bg-white/[0.02] transition-colors" data-expense-id="{{ $expense->id }}" data-account-id="{{ $expense->account_id }}">
                        <td class="px-8 py-5 font-medium">{{ $expense->name }}</td>
                        <td class="px-8 py-5 text-budgie-muted">{{ $expense->account->name ?? 'N/A' }}</td>
                        <td class="px-8 py-5 text-budgie-muted">
                            @if($expense->recurring && $expense->value_recurring)
                                @switch($expense->value_recurring)
                                    @case('MONTHLY')
                                        Tous les 1 mois
                                        @break
                                    @case('WEEKLY')
                                        Toutes les semaines
                                        @break
                                    @case('YEARLY')
                                        Tous les ans
                                        @break
                                    @default
                                        {{ $expense->value_recurring }}
                                @endswitch
                            @else
                                Ponctuel
                            @endif
                        </td>
                        <td class="px-8 py-5">
                            <span class="px-3 py-1.5 bg-budgie-danger/20 text-budgie-danger rounded-lg font-semibold">
                                -{{ number_format($expense->amount, 2, ',', ' ') }} €
                            </span>
                        </td>
                        <td class="px-8 py-5 text-budgie-muted">
                            {{ $expense->date_start ? $expense->date_start->format('d/m/y') : '' }}
                            @if($expense->date_end)
                                → {{ $expense->date_end->format('d/m/y') }}
                            @endif
                        </td>
                        <td class="px-8 py-5 text-right">
                            <x-button variant="secondary" onclick="openEditModal({{ $expense->id }}, {{ $expense->account_id }}, {{ json_encode($expense->name) }}, {{ json_encode($expense->description ?? '') }}, {{ $expense->recurring ? 'true' : 'false' }}, {{ json_encode($expense->value_recurring ?? '') }}, {{ $expense->amount }}, {{ json_encode($expense->date_start ? $expense->date_start->format('Y-m-d') : '') }}, {{ json_encode($expense->date_end ? $expense->date_end->format('Y-m-d') : '') }})">
                                Éditer
                            </x-button>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="6" class="px-8 py-16 text-center text-budgie-muted">
                            Aucune dépense enregistrée.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </x-card>
</div>

<!-- Modal Nouvelle dépense -->
<div id="modal-new-expense" class="fixed inset-0 z-50 hidden items-center justify-center bg-black">
    <div class="bg-budgie-card border border-white/10 rounded-budgie p-6 max-w-md mx-4 shadow-budgie">
        <h2 class="text-xl font-bold mb-6">Nouvelle dépense</h2>
        
        <form id="form-new-expense" class="space-y-4">
            @csrf
            
            <div>
                <label class="block text-sm text-budgie-muted mb-2">Compte</label>
                <select name="account_id" id="new-account-id" required class="w-full px-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-lg text-budgie-text focus:outline-none focus:ring-2 focus:ring-budgie-accent focus:border-transparent transition-all">
                    <option value="">Sélectionner un compte...</option>
                    @foreach($accounts as $account)
                        <option value="{{ $account->id }}">{{ $account->name }}</option>
                    @endforeach
                </select>
            </div>
            
            <x-input label="Nom" name="name" required placeholder="Ex: Crédit Moto" />
            
            <x-input label="Description" name="description" placeholder="Ex: Mensualité crédit" />
            
            <x-input label="Montant (€)" name="amount" type="number" step="0.01" required placeholder="Ex: 250" />
            
            <div class="grid grid-cols-2 gap-4">
                <x-input label="Date début" name="date_start" type="date" required />
                <x-input label="Date fin" name="date_end" type="date" />
            </div>
            
            <div class="space-y-2">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="recurring" id="recurring-checkbox" class="w-4 h-4 rounded bg-white/10 border-white/20 text-budgie-accent focus:ring-budgie-accent">
                    <span class="text-sm text-budgie-muted">Dépense récurrente</span>
                </label>
            </div>
            
            <div id="recurring-options" class="hidden">
                <label class="block text-sm text-budgie-muted mb-2">Fréquence</label>
                <select name="value_recurring" class="w-full px-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-lg text-budgie-text focus:outline-none focus:ring-2 focus:ring-budgie-accent focus:border-transparent transition-all">
                    <option value="">Sélectionner...</option>
                    <option value="WEEKLY">Toutes les semaines</option>
                    <option value="MONTHLY">Tous les mois</option>
                    <option value="YEARLY">Tous les ans</option>
                </select>
            </div>
            
            <div class="flex justify-end gap-3 pt-4">
                <x-button variant="secondary" type="button" onclick="closeModal()">
                    Annuler
                </x-button>
                <x-button variant="primary" type="submit">
                    Créer la dépense
                </x-button>
            </div>
        </form>
    </div>
</div>

<!-- Modal Éditer dépense -->
<div id="modal-edit-expense" class="fixed inset-0 z-50 hidden items-center justify-center bg-black">
    <div class="bg-budgie-card border border-white/10 rounded-budgie p-6 max-w-md mx-4 shadow-budgie">
        <h2 class="text-xl font-bold mb-6">Éditer la dépense</h2>
        
        <form id="form-edit-expense" class="space-y-4">
            @csrf
            @method('PUT')
            <input type="hidden" name="expense_id" id="edit-expense-id">
            <input type="hidden" name="account_id" id="edit-account-id">
            
            <x-input label="Nom" name="edit_name" required />
            
            <x-input label="Description" name="edit_description" />
            
            <x-input label="Montant (€)" name="edit_amount" type="number" step="0.01" required />
            
            <div class="grid grid-cols-2 gap-4">
                <x-input label="Date début" name="edit_date_start" type="date" required />
                <x-input label="Date fin" name="edit_date_end" type="date" />
            </div>
            
            <div class="space-y-2">
                <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" name="recurring" id="edit-recurring-checkbox" class="w-4 h-4 rounded bg-white/10 border-white/20 text-budgie-accent focus:ring-budgie-accent">
                    <span class="text-sm text-budgie-muted">Dépense récurrente</span>
                </label>
            </div>
            
            <div id="edit-recurring-options" class="hidden">
                <label class="block text-sm text-budgie-muted mb-2">Fréquence</label>
                <select name="value_recurring" id="edit-value-recurring" class="w-full px-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-lg text-budgie-text focus:outline-none focus:ring-2 focus:ring-budgie-accent focus:border-transparent transition-all">
                    <option value="">Sélectionner...</option>
                    <option value="WEEKLY">Toutes les semaines</option>
                    <option value="MONTHLY">Tous les mois</option>
                    <option value="YEARLY">Tous les ans</option>
                </select>
            </div>
            
            <div class="flex justify-between pt-4">
                <button type="button" onclick="deleteExpense()" class="px-4 py-2.5 rounded-full font-medium transition-all duration-200 bg-budgie-danger text-white hover:opacity-90">
                    Supprimer
                </button>
                <div class="flex gap-3">
                    <x-button variant="secondary" type="button" onclick="closeEditModal()">
                        Annuler
                    </x-button>
                    <x-button variant="primary" type="submit">
                        Enregistrer
                    </x-button>
                </div>
            </div>
        </form>
    </div>
</div>


<script>
    // Toggle recurring options
    document.getElementById('recurring-checkbox').addEventListener('change', function() {
        document.getElementById('recurring-options').classList.toggle('hidden', !this.checked);
    });
    
    document.getElementById('edit-recurring-checkbox').addEventListener('change', function() {
        document.getElementById('edit-recurring-options').classList.toggle('hidden', !this.checked);
    });

    // Modal Nouvelle dépense
    function openModal() {
        document.getElementById('modal-new-expense').classList.remove('hidden');
        document.getElementById('modal-new-expense').classList.add('flex');
    }
    
    function closeModal() {
        document.getElementById('modal-new-expense').classList.add('hidden');
        document.getElementById('modal-new-expense').classList.remove('flex');
        document.getElementById('form-new-expense').reset();
        document.getElementById('recurring-options').classList.add('hidden');
    }
    
    // Modal Éditer dépense
    function openEditModal(id, accountId, name, description, recurring, valueRecurring, amount, dateStart, dateEnd) {
        document.getElementById('edit-expense-id').value = id;
        document.getElementById('edit-account-id').value = accountId;
        document.getElementById('edit_name').value = name;
        document.getElementById('edit_description').value = description || '';
        document.getElementById('edit_amount').value = amount;
        document.getElementById('edit_date_start').value = dateStart;
        document.getElementById('edit_date_end').value = dateEnd;
        document.getElementById('edit-recurring-checkbox').checked = recurring;
        document.getElementById('edit-value-recurring').value = valueRecurring || '';
        document.getElementById('edit-recurring-options').classList.toggle('hidden', !recurring);
        
        document.getElementById('modal-edit-expense').classList.remove('hidden');
        document.getElementById('modal-edit-expense').classList.add('flex');
    }
    
    function closeEditModal() {
        document.getElementById('modal-edit-expense').classList.add('hidden');
        document.getElementById('modal-edit-expense').classList.remove('flex');
    }
    
    // Fermer modals sur clic extérieur
    ['modal-new-expense', 'modal-edit-expense'].forEach(modalId => {
        document.getElementById(modalId).addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
                this.classList.remove('flex');
            }
        });
    });
    
    // Soumission du formulaire de création
    document.getElementById('form-new-expense').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const accountId = formData.get('account_id');
        
        if (!accountId) {
            alert('Veuillez sélectionner un compte.');
            return;
        }
        
        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
            amount: parseFloat(formData.get('amount')),
            date_start: formData.get('date_start'),
            date_end: formData.get('date_end') || null,
            recurring: formData.has('recurring'),
            value_recurring: formData.get('value_recurring') || null,
        };
        
        try {
            const response = await fetch(`/comptes/${accountId}/depenses`, {
                method: 'POST',
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
                alert(errorData.message || 'Erreur lors de la création de la dépense.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la création de la dépense.');
        }
    });
    
    // Soumission du formulaire de modification
    document.getElementById('form-edit-expense').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const expenseId = formData.get('expense_id');
        const accountId = formData.get('account_id');
        const data = {
            name: formData.get('edit_name'),
            description: formData.get('edit_description'),
            amount: parseFloat(formData.get('edit_amount')),
            date_start: formData.get('edit_date_start'),
            date_end: formData.get('edit_date_end') || null,
            recurring: formData.has('recurring'),
            value_recurring: formData.get('value_recurring') || null,
        };
        
        try {
            const response = await fetch(`/comptes/${accountId}/depenses/${expenseId}`, {
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
                alert(errorData.message || 'Erreur lors de la modification de la dépense.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la modification de la dépense.');
        }
    });
    
    // Suppression d'une dépense
    async function deleteExpense() {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) return;
        
        const expenseId = document.getElementById('edit-expense-id').value;
        const accountId = document.getElementById('edit-account-id').value;
        
        try {
            const response = await fetch(`/comptes/${accountId}/depenses/${expenseId}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json',
                },
            });
            
            if (response.ok) {
                window.location.reload();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Erreur lors de la suppression de la dépense.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression de la dépense.');
        }
    }
    
    // Recherche/filtre
    document.getElementById('search-expenses').addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#expenses-table tbody tr[data-expense-id]');
        
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
