@extends('layouts.app')

@section('title', $account->name . ' - Budgie')

@section('content')
<div class="max-w-6xl mx-auto">
    <!-- Header avec navigation -->
    <div class="flex items-center gap-4 mb-12">
        <a href="{{ route('accounts.index') }}" class="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
        </a>
        <div class="flex-1">
            <h1 class="text-3xl font-bold">{{ $account->name }}</h1>
            <p class="text-budgie-muted">
                @if($account->description)
                    {{ $account->description }}
                @endif
                @if($account->rate_remuneration || $account->rate_imposition)
                    @if($account->description) · @endif
                    @if($account->rate_remuneration)
                        Taux {{ number_format($account->rate_remuneration, 1, ',', ' ') }}%
                    @endif
                    @if($account->rate_remuneration && $account->rate_imposition) - @endif
                    @if($account->rate_imposition)
                        Impôt {{ number_format($account->rate_imposition, 0, ',', ' ') }}%
                    @endif
                @endif
            </p>
        </div>
        <div class="flex items-center gap-2">
            <x-button variant="secondary" onclick="openEditModal()">
                Modifier
            </x-button>
            <x-button variant="secondary" onclick="confirmDelete()">
                Supprimer
            </x-button>
        </div>
    </div>

    <!-- Statistiques -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <x-card>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-budgie-muted mb-2">Solde actuel</h4>
            <p class="text-2xl font-bold {{ $balance >= 0 ? 'text-budgie-success' : 'text-budgie-danger' }}">
                {{ number_format($balance, 2, ',', ' ') }} €
            </p>
        </x-card>
        
        <x-card>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-budgie-muted mb-2">Total revenus</h4>
            <p class="text-2xl font-bold text-budgie-success">
                +{{ number_format($income_total, 2, ',', ' ') }} €
            </p>
        </x-card>
        
        <x-card>
            <h4 class="text-xs font-semibold uppercase tracking-wider text-budgie-muted mb-2">Total dépenses</h4>
            <p class="text-2xl font-bold text-budgie-danger">
                -{{ number_format($expense_total, 2, ',', ' ') }} €
            </p>
        </x-card>
    </div>

    <!-- Sections Revenus et Dépenses -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        <!-- Revenus -->
        <x-card>
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold">Revenus récents</h3>
                <a href="{{ route('incomes.index', $account->id) }}" class="text-budgie-accent text-sm hover:underline">
                    Voir tout
                </a>
            </div>
            
            @if($incomes->count() > 0)
                <div class="space-y-3">
                    @foreach($incomes as $income)
                        <div class="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                            <div>
                                <p class="font-medium">{{ $income->name }}</p>
                                <p class="text-sm text-budgie-muted">
                                    {{ $income->date_start ? $income->date_start->format('d/m/Y') : 'Sans date' }}
                                    @if($income->recurring)
                                        <span class="ml-2 px-2 py-0.5 text-xs bg-budgie-accent/20 text-budgie-accent rounded-full">Récurrent</span>
                                    @endif
                                </p>
                            </div>
                            <p class="text-budgie-success font-semibold">
                                +{{ number_format($income->amount, 2, ',', ' ') }} €
                            </p>
                        </div>
                    @endforeach
                </div>
            @else
                <p class="text-budgie-muted text-center py-4">Aucun revenu enregistré.</p>
            @endif
        </x-card>

        <!-- Dépenses -->
        <x-card>
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold">Dépenses récentes</h3>
                <a href="{{ route('expenses.index', $account->id) }}" class="text-budgie-accent text-sm hover:underline">
                    Voir tout
                </a>
            </div>
            
            @if($expenses->count() > 0)
                <div class="space-y-3">
                    @foreach($expenses as $expense)
                        <div class="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                            <div>
                                <p class="font-medium">{{ $expense->name }}</p>
                                <p class="text-sm text-budgie-muted">
                                    {{ $expense->date_start ? $expense->date_start->format('d/m/Y') : 'Sans date' }}
                                    @if($expense->recurring)
                                        <span class="ml-2 px-2 py-0.5 text-xs bg-budgie-danger/20 text-budgie-danger rounded-full">Récurrent</span>
                                    @endif
                                </p>
                            </div>
                            <p class="text-budgie-danger font-semibold">
                                -{{ number_format($expense->amount, 2, ',', ' ') }} €
                            </p>
                        </div>
                    @endforeach
                </div>
            @else
                <p class="text-budgie-muted text-center py-4">Aucune dépense enregistrée.</p>
            @endif
        </x-card>
    </div>

    <!-- Actions rapides -->
    <div class="flex items-center justify-center gap-4">
        <a href="{{ route('previsions.index', $account->id) }}">
            <x-button variant="secondary">
                Voir les prévisions
            </x-button>
        </a>
    </div>
</div>

<!-- Modal Modifier le compte -->
<div id="modal-edit-account" class="fixed inset-0 z-50 hidden items-center justify-center bg-black">
    <div class="bg-budgie-card border border-white/10 rounded-budgie p-6 max-w-md w mx-4 shadow-budgie">
        <h2 class="text-xl font-bold mb-6">Modifier le compte</h2>
        
        <form id="form-edit-account" class="space-y-4">
            @csrf
            @method('PUT')
            <x-input label="Nom du compte" name="name" required :value="$account->name" />
            
            <x-input label="Description" name="description" :value="$account->description" />
            
            <div class="grid grid-cols-2 gap-4">
                <x-input 
                    label="Taux de rémunération (%)" 
                    name="rate_remuneration" 
                    type="number" 
                    step="0.01"
                    :value="$account->rate_remuneration" 
                />
                
                <x-input 
                    label="Taux d'imposition (%)" 
                    name="rate_imposition" 
                    type="number" 
                    step="0.01"
                    :value="$account->rate_imposition" 
                />
            </div>
            
            <div class="flex justify-end gap-3 pt-4">
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

<!-- Modal Confirmation suppression -->
<div id="modal-delete-account" class="fixed inset-0 z-50 hidden items-center justify-center bg-black backdrop-blur-sm">
    <div class="bg-budgie-card border border-white/10 rounded-budgie p-6 max-w-md shadow-budgie">
        <h2 class="text-xl font-bold mb-4 text-budgie-danger">Supprimer le compte</h2>
        <p class="text-budgie-muted mb-6">
            Êtes-vous sûr de vouloir supprimer le compte <strong class="text-budgie-text">{{ $account->name }}</strong> ? 
            Cette action est irréversible et supprimera également tous les revenus, dépenses et prévisions associés.
        </p>
        
        <div class="flex justify-end gap-3">
            <x-button variant="secondary" type="button" onclick="closeDeleteModal()">
                Annuler
            </x-button>
            <button 
                onclick="deleteAccount()"
                class="px-4 py-2.5 rounded-full font-medium transition-all duration-200 bg-budgie-danger text-white hover:opacity-90"
            >
                Supprimer
            </button>
        </div>
    </div>
</div>

<script>
    // Modal Edition
    function openEditModal() {
        document.getElementById('modal-edit-account').classList.remove('hidden');
        document.getElementById('modal-edit-account').classList.add('flex');
    }
    
    function closeEditModal() {
        document.getElementById('modal-edit-account').classList.add('hidden');
        document.getElementById('modal-edit-account').classList.remove('flex');
    }
    
    // Modal Suppression
    function confirmDelete() {
        document.getElementById('modal-delete-account').classList.remove('hidden');
        document.getElementById('modal-delete-account').classList.add('flex');
    }
    
    function closeDeleteModal() {
        document.getElementById('modal-delete-account').classList.add('hidden');
        document.getElementById('modal-delete-account').classList.remove('flex');
    }
    
    // Fermer modals sur clic extérieur
    ['modal-edit-account', 'modal-delete-account'].forEach(modalId => {
        document.getElementById(modalId).addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
                this.classList.remove('flex');
            }
        });
    });
    
    // Soumission du formulaire de modification
    document.getElementById('form-edit-account').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch('{{ route("accounts.update", $account->id) }}', {
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
                alert(errorData.message || 'Erreur lors de la modification du compte.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la modification du compte.');
        }
    });
    
    // Suppression du compte
    async function deleteAccount() {
        try {
            const response = await fetch('{{ route("accounts.destroy", $account->id) }}', {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json',
                },
            });
            
            if (response.ok) {
                window.location.href = '{{ route("accounts.index") }}';
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Erreur lors de la suppression du compte.');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression du compte.');
        }
    }
</script>
@endsection
