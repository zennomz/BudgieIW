<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Budgie</title>
  @vite(['resources/css/app.css','resources/js/app.js'])
</head>
<body>
  <nav style="display:flex;gap:12px;padding:12px;border-bottom:1px solid #ddd;">
    <a href="{{ route('home') }}">Accueil</a>
    @auth
      <span>Connecté</span>
      <form method="POST" action="{{ route('logout') }}">
        @csrf
        <button type="submit">Déconnexion</button>
      </form>
    @else
      <a href="{{ route('login') }}">Connexion</a>
      <a href="{{ route('register') }}">Inscription</a>
    @endauth
  </nav>

  <main style="max-width:720px;margin:24px auto;padding:0 12px;">
    @yield('content')
  </main>
</body>
</html>
