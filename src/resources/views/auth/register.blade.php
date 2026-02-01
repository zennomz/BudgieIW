<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Inscription · Budgie</title>
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
<form class="card padded form" method="POST" action="{{ route('register.store') }}" style="max-width:640px;margin:auto">
  @csrf
  <h3>Créer un compte</h3>

  @if($errors->any())
    <div style="padding:10px;background:rgba(255,107,107,.15);border:1px solid rgba(255,107,107,.3);border-radius:10px">
      <ul style="margin:0;padding-left:20px;color:var(--danger)">
        @foreach($errors->all() as $e)
          <li>{{ $e }}</li>
        @endforeach
      </ul>
    </div>
  @endif

  <div class="row">
    <div style="flex:1">
      <label>Nom</label>
      <input class="input" type="text" name="nom" value="{{ old('nom') }}">
    </div>
    <div style="flex:1">
      <label>Prénom</label>
      <input class="input" type="text" name="prenom" value="{{ old('prenom') }}">
    </div>
  </div>

  <label>Email</label>
  <input class="input" type="email" name="email" value="{{ old('email') }}" required>

  <label>Mot de passe</label>
  <input type="password" class="input" name="password" required>

  <label>Confirmer le mot de passe</label>
  <input type="password" class="input" name="password_confirmation" required>

  <label>Date de naissance</label>
  <input class="input" type="date" name="date_naissance" value="{{ old('date_naissance') }}">

  <label>Téléphone</label>
  <input class="input" type="text" name="numero_telephone" value="{{ old('numero_telephone') }}">

  <button class="btn primary" type="submit">Créer mon compte</button>
  <p class="tag">Déjà un compte ? <a href="{{ route('login') }}" style="color:var(--accent)">Se connecter</a></p>
</form>
</main>
<footer class="footer container">© Budgie — Application de gestion budgétaire</footer>
</body>
</html>
