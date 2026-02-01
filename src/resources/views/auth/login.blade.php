<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Connexion · Budgie</title>
@vite(['resources/css/app.css','resources/js/app.js'])
</head>
<body>

<nav class="nav">
  <div class="nav-inner container">
    <a class="brand" href="{{ route('home') }}">
      <span class="logo"></span><strong>Budgie</strong>
    </a>
    <div class="nav-links">
      @guest
        <a class="cta" href="{{ route('login') }}">Se connecter</a>
      @endguest
      @auth
        <a href="{{ route('home') }}">Tableau de bord</a>
        <form method="POST" action="{{ route('logout') }}" style="display:inline">
          @csrf
          <button type="submit" class="btn">Déconnexion</button>
        </form>
      @endauth
    </div>
  </div>
</nav>

<main class="container">
<div class="grid grid-2">
  <form class="card padded form" method="POST" action="{{ route('login.store') }}">
    @csrf
    <h3>Se connecter</h3>

    @if($errors->any())
      <div style="padding:10px;background:rgba(255,107,107,.15);border:1px solid rgba(255,107,107,.3);border-radius:10px">
        <ul style="margin:0;padding-left:20px;color:var(--danger)">
          @foreach($errors->all() as $e)
            <li>{{ $e }}</li>
          @endforeach
        </ul>
      </div>
    @endif

    <label>Email</label>
    <input class="input" type="email" name="email" value="{{ old('email') }}" placeholder="vous@exemple.com" required>

    <label>Mot de passe</label>
    <input type="password" class="input" name="password" placeholder="••••••••" required>

    <button class="btn primary" type="submit">Connexion</button>
    <p class="tag">Pas de compte ? <a href="{{ route('register') }}" style="color:var(--accent)">Inscription</a></p>
  </form>
  <div class="card padded">
    <h3>Sécurité</h3>
    <p class="tag">Vos identifiants sont chiffrés. Ne partagez jamais votre mot de passe.</p>
  </div>
</div>
</main>
<footer class="footer container">© Budgie — Application de gestion budgétaire</footer>
</body>
</html>
