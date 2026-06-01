@extends('layouts.app')

@section('title', 'Comptes - Budgie')

@section('content')
<div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold">Comptes</h1>
        
        <div class="flex items-center gap-4">
            <!-- Recherche -->
            <div class="relative">
                <input 
                    type="text" 
                    placeholder="Rechercher un compte..." 
                    class="w-64 px-4 py-2.5 bg-white/[0.06] border border-white/10 rounded-lg text-budgie-text placeholder-budgie-muted focus:outline-none focus:ring-2 focus:ring-budgie-accent focus:border-transparent transition-all"
                    id="search-accounts"
                />
            </div>
            
            <!-- Bouton Nouveau compte -->
            <x-button variant="primary" onclick="openModal()">
                Nouveau compte
            </x-button>
        </div>
    </div>

    <!-- Liste des comptes -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="accounts-grid">
        @forelse($accounts as $account)
            <x-card class="flex flex-col justify-between">
                <div>
                    <h3 class="text-lg font-semibold mb-1">{{ $account['name'] }}</h3>
                    <p class="text-sm text-budgie-muted mb-4">
                        @if($account['rate_remuneration'] || $account['rate_imposition'])
                            @if($account['rate_remuneration'])
                                Taux {{ number_format($account['rate_remuneration'], 1, ',', ' ') }}%
                            @endif
                            @if($account['rate_remuneration'] && $account['rate_imposition'])
                                -
                            @endif
                            @if($account['rate_imposition'])
                                Impôt {{ number_format($account['rate_imposition'], 0, ',', ' ') }}%
                            @endif
                        @else
                            {{ $account['description'] ?? 'Compte courant' }}
                        @endif
                    </p>
                </div>
                
                <div>
                    <p class="text-lg font-bold mb-4">
                        <span class="text-budgie-muted font-normal">Solde :</span>
                        {{ number_format($account['balance'], 2, ',', ' ') }} €
                    </p>
                    
                    <a href="{{ route('accounts.show', $account['id']) }}" class="inline-block">
                        <x-button variant="secondary">
                            Détails
                        </x-button>
                    </a>
                </div>
            </x-card>
        @empty
            <div class="col-span-full text-center py-12">
                <p class="text-budgie-muted text-lg">Aucun compte trouvé.</p>
                <p class="text-budgie-muted mt-2">Créez votre premier compte pour commencer.</p>
            </div>
        @endforelse
    </div>
</div>

<!-- Modal Nouveau compte -->
<div id="modal-new-account" class="fixed inset-0 z-50 hidden items-center justify-center bg-black/60 backdrop-blur-sm">
    <div class="bg-budgie-card border border-white/10 rounded-budgie p-6 max-w-md mx-4 shadow-budgie">
        <h2 class="text-xl font-bold mb-6">Nouveau compte</h2>
        
        <form id="form-new-account" class="space-y-4">
            @csrf
            <x-input label="Nom du compte" name="name" required placeholder="Ex: Société Générale" />
            
            <x-input label="Description" name="description" placeholder="Ex: Compte courant" />
            
            <div class="grid grid-cols-2 gap-4">
                <x-input 
                    label="Taux de rémunération (%)" 
                    name="rate_remuneration" 
                    type="number" 
                    step="0.01"
                    placeholder="Ex: 1.7" 
                />
                
                <x-input 
                    label="Taux d'imposition (%)" 
                    name="rate_imposition" 
                    type="number" 
                    step="0.01"
                    placeholder="Ex: 30" 
                />
            </div>
            
            <div class="flex justify-end gap-3 pt-4">
                <x-button variant="secondary" type="button" onclick="closeModal()">
                    Annuler
                </x-button>
                <x-button variant="primary" type="submit">
                    Créer le compte
                </x-button>
            </div>
        </form>
    </div>
</div>



<script>
    function openModal() {
        document.getElementById('modal-new-account').classList.remove('hidden');
        document.getElementById('modal-new-account').classList.add('flex');
    }
    
    function closeModal() {
        document.getElementById('modal-new-account').classList.add('hidden');
        document.getElementById('modal-new-account').classList.remove('flex');
    }
    
    // Fermer modal sur clic extérieur
    document.getElementById('modal-new-account').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // Soumission du formulaire
    document.getElementById('form-new-account').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.querySelector('#form-new-account button[type="submit"]');
        const cancelBtn = document.querySelector('#form-new-account button[type="button"]');
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        try {
            submitBtn.disabled = true;
            if (cancelBtn) cancelBtn.disabled = true;
            submitBtn.innerHTML = '<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> Création...';
            const response = await fetch('{{ route("accounts.store") }}', {
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
                alert(errorData.message || 'Erreur lors de la création du compte.');
                submitBtn.disabled = false;
                if (cancelBtn) cancelBtn.disabled = false;
                submitBtn.innerHTML = 'Créer le compte';
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la création du compte.');
            submitBtn.disabled = false;
            if (cancelBtn) cancelBtn.disabled = false;
            submitBtn.innerHTML = 'Créer le compte';
        }
    });
    
    // Recherche de comptes
    document.getElementById('search-accounts').addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('#accounts-grid > div');
        
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            if (text.includes(query)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
</script>
@endsection
