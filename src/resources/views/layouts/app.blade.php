<!doctype html>
<html lang="fr" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Budgie - Gestion Budgétaire')</title>
    @vite(['resources/css/app.css','resources/js/app.js'])
</head>
<body class="h-full bg-budgie-bg text-budgie-text">
    <!-- Background gradient -->
    <div class="fixed inset-0 -z-10">
        <div class="absolute inset-0 bg-gradient-radial from-budgie-accent-2/25 via-transparent to-transparent opacity-50 blur-3xl" style="background: radial-gradient(1200px 800px at 20% -10%, rgba(124,77,255,.25), transparent 40%), radial-gradient(1200px 800px at 120% 10%, rgba(74,168,255,.18), transparent 50%), var(--budgie-bg);"></div>
    </div>

    <!-- Navigation -->
    <nav class="sticky top-0 z-50 backdrop-blur-lg bg-budgie-bg/55 border-b border-white/[0.06]">
        <div class="max-w-7xl mx-auto px-6">
            <div class="flex items-center justify-between h-16">
                <!-- Logo -->
                <a href="{{ route('home') }}" class="flex items-center gap-2.5">
                    <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-budgie-accent to-budgie-accent-2 shadow-budgie"></div>
                    <strong class="text-lg font-bold tracking-tight">Budgie</strong>
                </a>

                <!-- Nav -->
                <div class="flex items-center gap-1 flex-wrap">
                    <a href="{{ route('home') }}" class="px-3 py-2 rounded-full border border-transparent hover:border-white/10 hover:bg-white/5 transition-all text-sm">
                        Tableau de bord
                    </a>
                    <a href="{{ route('accounts.index') }}" class="px-3 py-2 rounded-full border border-transparent hover:border-white/10 hover:bg-white/5 transition-all text-sm">
                        Comptes
                    </a>
                    <a href="{{ route('expenses.userExpenses') }}" class="px-3 py-2 rounded-full border border-transparent hover:border-white/10 hover:bg-white/5 transition-all text-sm">
                        Dépenses
                    </a>
                    <a href="{{ route('incomes.userIncomes') }}" class="px-3 py-2 rounded-full border border-transparent hover:border-white/10 hover:bg-white/5 transition-all text-sm">
                        Revenus
                    </a>
                    <a href="#" class="px-3 py-2 rounded-full border border-transparent hover:border-white/10 hover:bg-white/5 transition-all text-sm">
                        Prévisions
                    </a>
                    <a href="#" class="px-3 py-2 rounded-full border border-transparent hover:border-white/10 hover:bg-white/5 transition-all text-sm">
                        Abonnements
                    </a>
                    <a href="{{ route('profile.show') }}" class="px-3 py-2 rounded-full border border-transparent hover:border-white/10 hover:bg-white/5 transition-all text-sm">
                        Profil
                    </a>
                    @auth
                        @if(auth()->user()->role === 'admin')
                            <a href="#" class="px-3 py-2 rounded-full border border-transparent hover:border-white/10 hover:bg-white/5 transition-all text-sm">
                                Admin
                            </a>
                        @endif
                    @endauth
                </div>

                <!-- Auth buttons -->
                <div class="flex items-center gap-2">
                    @auth
                        <form method="POST" action="{{ route('logout') }}" class="inline">
                            @csrf
                            <button type="submit" class="px-3 py-2 rounded-full border border-transparent hover:border-white/10 hover:bg-white/5 transition-all text-sm">
                                Déconnexion
                            </button>
                        </form>
                    @else
                        <a href="{{ route('login') }}" class="px-3.5 py-2 rounded-full bg-gradient-to-r from-budgie-accent to-budgie-accent-2 text-white shadow-budgie hover:opacity-90 transition-all text-sm font-medium">
                            Se connecter
                        </a>
                    @endauth
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-6 py-8">
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="mt-12 mb-6 text-center text-budgie-muted text-sm">
        <p>&copy; {{ date('Y') }} Budgie - Gestion budgétaire</p>
    </footer>
</body>
</html>
