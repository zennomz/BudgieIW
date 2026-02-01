<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Accueil · Budgie</title>
@vite(['resources/css/app.css','resources/js/app.js'])
</head>
<body>

<nav class="nav">
  <div class="nav-inner container">
    <a class="brand" href="{{ route('home') }}">
      <span class="logo"></span><strong>Budgie</strong>
    </a>
    <div class="nav-links">
      @auth
        <a href="{{ route('home') }}">Tableau de bord</a>
        <form method="POST" action="{{ route('logout') }}" style="display:inline">
          @csrf
          <button type="submit" class="btn">Déconnexion</button>
        </form>
      @else
        <a class="cta" href="{{ route('login') }}">Se connecter</a>
      @endauth
    </div>
  </div>
</nav>

<main class="container">
<section class="page-hero">
  <div>
    <h1 class="hero-title">Ton partenaire financier personnel</h1>
    <p class="hero-sub">Suivi des comptes, revenus, dépenses et prévisions — sans connecter ta banque. Inspiré par Finary, pensé pour la confidentialité.</p>
    @auth
      <p class="tag" style="font-size:16px;margin-bottom:18px">Bienvenue <strong>{{ auth()->user()->prenom ?? '' }} {{ auth()->user()->nom ?? '' }}</strong></p>
    @endauth
    <div class="actions">
      @guest
        <a class="cta" href="{{ route('register') }}">Créer un compte</a>
      @endguest
      <a class="btn" href="{{ route('home') }}">Voir la démo</a>
    </div>
    <div class="row" style="margin-top:16px">
      <span class="badge">SSL</span>
      <span class="badge">Sans pub</span>
      <span class="badge">Export CSV</span>
    </div>
  </div>
  <div class="card padded">
    <div class="grid grid-3">
      <div class="kpi card padded"><h3>Valeur totale</h3><p>32 450 €</p><span class="tag">+2,3% ce mois</span></div>
      <div class="kpi card padded"><h3>Cash</h3><p>7 200 €</p><span class="tag">Comptes à vue</span></div>
      <div class="kpi card padded"><h3>Investi</h3><p>25 250 €</p><span class="tag">CTO, Livrets</span></div>
    </div>
    <div style="margin-top:14px" class="grid grid-2">
      <div class="card padded">
        <h3 style="margin:0 0 8px 0">Mouvements récents</h3>
        <table class="table">
          <thead><tr><th>Date</th><th>Libellé</th><th>Montant</th></tr></thead>
          <tbody>
            <tr><td>01/10/2025</td><td>Salaire</td><td class="status success">+1 170 €</td></tr>
            <tr><td>02/10/2025</td><td>Crédit Moto</td><td class="status danger">-250 €</td></tr>
            <tr><td>05/10/2025</td><td>Alimentation CTO</td><td class="status success">+50 €</td></tr>
          </tbody>
        </table>
      </div>
      <div class="card padded">
        <h3 style="margin:0 0 8px 0">Prévision rapide</h3>
        <p class="tag">Solde estimé au 31/12/2035 : <strong>98 320 €</strong> (net)</p>
        <p class="tag">Hypothèses: intérêts mensuels, revenus & dépenses récurrentes.</p>
        <a class="btn primary" href="#">Ouvrir les prévisions</a>
      </div>
    </div>
  </div>
</section>
</main>
<footer class="footer container">© Budgie — Application de gestion budgétaire</footer>
</body>
</html>
