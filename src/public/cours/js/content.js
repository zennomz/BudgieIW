/* =====================================================================
   Budgie — Cours interactif de révision (soutenance)
   content.js : TOUT le contenu structuré (aucune dépendance, chargé via <script src>)
   Chaque extrait de code est COPIÉ à l'identique du fichier source réel (chemin cité).
   Racine du code applicatif = src/
   ===================================================================== */

/* -------- FONCTIONNALITÉS (parcours complet, fichier par fichier) -------- */
const FEATURES = [

/* =====================================================================
   F1 — IDENTIFICATION (inscription / connexion / vérification email)
   ===================================================================== */
{
  id: "identification",
  icone: "🔐",
  titre: "Identification",
  sousTitre: "Inscription, connexion, déconnexion, vérification par email",
  resume: "Authentification faite maison (sans Breeze/Jetstream). L'utilisateur s'inscrit, reçoit un email de confirmation (jeton), active son compte, puis se connecte. Laravel gère la session et le hachage du mot de passe.",
  mantra: "Formulaire → Route → Form Request (validation) → Contrôleur → Modèle (hash) → Mail (jeton) → activation → session.",
  etapes: [
    {
      couche: "Route", dossier: "src/routes", fichier: "web.php", startLine: 17,
      lang: "php", difficulte: "facile",
      role: "Déclare les URL publiques d'auth et les relie aux méthodes du contrôleur.",
      oral: "Le routeur associe chaque URL à une méthode de contrôleur. GET affiche le formulaire, POST le traite. La déconnexion est protégée par le middleware 'auth'.",
      lignes: [
        { code: "Route::get('/inscription', [AuthController::class, 'showRegister'])->name('register');", exp: "⭐ Route::get = URL en lecture (afficher). Le tableau [Classe::class, 'methode'] dit QUEL contrôleur et QUELLE méthode. ::class donne le nom complet de la classe. ->name('register') = nom court pour générer l'URL ailleurs (route('register'))." },
        { code: "Route::post('/inscription', [AuthController::class, 'register'])->name('register.store');", exp: "POST = envoi de données (créer). Même URL que le GET mais verbe différent → traite le formulaire d'inscription." },
        { code: "Route::get('/verify-email', fn() => view('auth.verify-email'))->name('verification.notice');", exp: "fn() => ... est une fonction fléchée (closure courte). Ici la route renvoie directement une vue, sans passer par un contrôleur." },
        { code: "Route::get('/verify', [AuthController::class, 'verify'])->name('verification.verify');", exp: "Le lien reçu par email pointe ici (avec ?email=&token=) pour activer le compte." },
        { code: "Route::get('/connexion', [AuthController::class, 'showLogin'])->name('login');", exp: "Affiche le formulaire de connexion." },
        { code: "Route::post('/connexion', [AuthController::class, 'login'])->name('login.store');", exp: "Vérifie les identifiants et ouvre la session." },
        { code: "Route::post('/deconnexion', [AuthController::class, 'logout'])->name('logout')->middleware('auth');", exp: "⭐ ->middleware('auth') = filtre : seul un utilisateur déjà connecté peut se déconnecter." }
      ]
    },
    {
      couche: "Requête (Form Request)", dossier: "src/app/Http/Requests/Auth", fichier: "RegisterRequest.php", startLine: 22,
      lang: "php", difficulte: "cle",
      role: "Valide les données du formulaire d'inscription AVANT le contrôleur (séparation des responsabilités).",
      oral: "Une Form Request est une classe dédiée à la validation. Si une règle échoue, Laravel renvoie automatiquement l'utilisateur au formulaire avec les erreurs : le contrôleur n'est jamais atteint.",
      lignes: [
        { code: "public function authorize(): bool", exp: "Autorise (ou non) la requête. : bool = type de retour. Ici true = tout le monde peut s'inscrire." },
        { code: "    return true;", exp: "On autorise la requête sans condition." },
        { code: "public function rules(): array", exp: "Retourne le tableau des règles de validation." },
        { code: "    'email' => ['required','email','max:60','unique:users,email'],", exp: "⭐ required = obligatoire, email = format valide, max:60 = 60 caractères max, unique:users,email = pas déjà présent dans la colonne email de la table users (anti-doublon)." },
        { code: "    'password' => ['required','min:8','confirmed'],", exp: "⭐ min:8 = 8 caractères minimum. confirmed = un champ password_confirmation doit être identique (double saisie)." },
        { code: "    'firstname' => ['nullable','string','max:50'],", exp: "nullable = facultatif (peut être vide). string = chaîne de caractères." },
        { code: "    'date_of_birth' => ['nullable','date'],", exp: "date = doit être une date valide." },
        { code: "    'numero_phone' => ['nullable','string','max:20'],", exp: "Téléphone facultatif, 20 caractères max." }
      ]
    },
    {
      couche: "Contrôleur", dossier: "src/app/Http/Controllers/Auth", fichier: "AuthController.php", startLine: 19,
      lang: "php", difficulte: "cle",
      role: "Chef d'orchestre de l'auth : crée l'utilisateur, envoie l'email, ouvre/ferme la session, active le compte.",
      oral: "Le contrôleur reçoit une RegisterRequest DÉJÀ validée. Il hache le mot de passe, crée l'utilisateur inactif, génère un jeton, envoie l'email de confirmation, puis redirige.",
      lignes: [
        { code: "public function register(RegisterRequest $request)", exp: "⭐ Injection de dépendance : Laravel fabrique la RegisterRequest et la donne en paramètre. $request = l'objet requête (le $ préfixe toute variable en PHP)." },
        { code: "    $data = $request->validated();", exp: "-> = accès à une méthode/propriété d'un objet. validated() = uniquement les champs qui ont passé la validation (données sûres)." },
        { code: "    $confirmationToken = bin2hex(random_bytes(32));", exp: "⭐ random_bytes(32) = 32 octets aléatoires cryptographiques ; bin2hex les transforme en 64 caractères hexadécimaux → jeton imprévisible pour valider l'email." },
        { code: "    $user = User::create([", exp: "User::create([...]) = requête d'insertion via Eloquent (l'ORM). :: = appel statique (sur la classe, pas un objet)." },
        { code: "        'email' => $data['email'],", exp: "=> associe une clé à une valeur dans un tableau associatif. On reprend l'email validé." },
        { code: "        'password' => Hash::make($data['password']),", exp: "⭐ Hash::make = hachage bcrypt : on ne stocke JAMAIS le mot de passe en clair (sécurité)." },
        { code: "        'verification_token' => $confirmationToken", exp: "On stocke le jeton en base pour le comparer plus tard lors de la vérification." },
        { code: "    ]);", exp: "Fin du tableau et de l'appel create : $user contient l'utilisateur créé (is_active vaut false par défaut)." },
        { code: "    confirmAccountMail($user->email, $confirmationToken);", exp: "Appelle la fonction d'envoi d'email (définie dans app/Mail/WelcomeMail.php) avec l'adresse et le jeton." },
        { code: "    return redirect()->route('verification.notice')->with('status', '...');", exp: "Redirige vers la page « vérifiez votre email ». with('status', ...) = message flash (affiché une seule fois)." }
      ]
    },
    {
      couche: "Contrôleur", dossier: "src/app/Http/Controllers/Auth", fichier: "AuthController.php", startLine: 38,
      lang: "php", difficulte: "cle",
      role: "Connexion : vérifie identifiants + compte actif, puis régénère la session.",
      oral: "login() tente l'authentification. Si le couple email/mot de passe est bon MAIS que le compte n'est pas activé, on déconnecte et on renvoie une erreur. Sinon on régénère l'ID de session (anti fixation de session) et on va au tableau de bord.",
      lignes: [
        { code: "if (!Auth::attempt($request->validated())) {", exp: "⭐ Auth::attempt = compare email + mot de passe haché. ! = NON logique. Si l'authentification échoue, on entre dans le bloc." },
        { code: "    return back()->withErrors(['email' => 'Identifiants invalides'])->onlyInput('email');", exp: "back() = retour au formulaire ; withErrors = message d'erreur ; onlyInput('email') = re-remplit l'email (pas le mot de passe)." },
        { code: "$user = Auth::user();", exp: "Récupère l'utilisateur maintenant connecté." },
        { code: "if (!$user->is_active) {", exp: "⭐ Vérifie que le compte a été activé par email. Sinon connexion refusée." },
        { code: "    Auth::logout();", exp: "On annule la connexion ouverte par attempt()." },
        { code: "$request->session()->regenerate();", exp: "⭐ Régénère l'identifiant de session : protège contre le vol de session (session fixation)." },
        { code: "return redirect()->route('home');", exp: "Tout est bon → redirection vers le tableau de bord." }
      ]
    },
    {
      couche: "Contrôleur", dossier: "src/app/Http/Controllers/Auth", fichier: "AuthController.php", startLine: 63,
      lang: "php", difficulte: "cle",
      role: "Vérifie le jeton reçu par email et active le compte.",
      oral: "verify() lit email et token dans l'URL, cherche l'utilisateur correspondant, met verification_token à null et is_active à true. Le jeton devient inutilisable ensuite.",
      lignes: [
        { code: "$email = $request->query('email');", exp: "query('email') = paramètre d'URL ?email=... (méthode GET)." },
        { code: "$token = $request->query('token');", exp: "Récupère le jeton depuis l'URL." },
        { code: "$user = User::where('email', $email)", exp: "where(colonne, valeur) = clause SQL WHERE. Construit une requête filtrée." },
        { code: "    ->where('verification_token', $token)", exp: "Deuxième condition : le jeton doit correspondre exactement (chaînage de méthodes)." },
        { code: "    ->first();", exp: "first() = premier résultat ou null. Requête paramétrée par Eloquent = pas d'injection SQL." },
        { code: "$user->update([", exp: "Met à jour l'utilisateur trouvé." },
        { code: "    'verification_token' => null,", exp: "⭐ On efface le jeton : il ne pourra pas être réutilisé." },
        { code: "    'is_active' => true,", exp: "⭐ Le compte est activé : la connexion devient possible." }
      ]
    },
    {
      couche: "Modèle", dossier: "src/app/Models", fichier: "User.php", startLine: 13,
      lang: "php", difficulte: "cle",
      role: "Représente la table users ; définit champs remplissables, champs cachés, conversions et relations.",
      oral: "User étend Authenticatable : c'est le modèle d'authentification de Laravel. $fillable protège contre l'assignation de masse, $hidden cache le mot de passe, le cast 'hashed' hache automatiquement.",
      lignes: [
        { code: "class User extends Authenticatable", exp: "⭐ extends = héritage. Authenticatable apporte tout le nécessaire pour l'auth (sessions, identifiants)." },
        { code: "    use HasFactory, Notifiable;", exp: "use (dans une classe) = traits : morceaux de code réutilisables (fabriques de test, notifications)." },
        { code: "    protected $fillable = [", exp: "⭐ Liste blanche des colonnes remplissables en masse (create/update). Protège contre l'assignation de masse (mass assignment)." },
        { code: "        'email',", exp: "Un exemple de champ autorisé parmi firstname, lastname, password, role, plan, etc." },
        { code: "    protected $hidden = [", exp: "Champs masqués lors de la sérialisation JSON." },
        { code: "        'password',", exp: "⭐ Le mot de passe (haché) n'est jamais renvoyé dans une réponse JSON." },
        { code: "    protected function casts(): array", exp: "Définit les conversions de type automatiques (casts)." },
        { code: "            'is_active' => 'boolean',", exp: "La colonne is_active est convertie en vrai/faux (booléen) automatiquement." },
        { code: "            'password' => 'hashed',", exp: "⭐ Cast 'hashed' : toute écriture du mot de passe le hache automatiquement (bcrypt)." },
        { code: "    public function accounts()", exp: "Déclare une relation Eloquent." },
        { code: "        return $this->hasMany(Account::class);", exp: "⭐ hasMany = « un utilisateur a plusieurs comptes ». $this = l'objet courant." },
        { code: "    public function isPremium(): bool", exp: "Méthode métier pratique." },
        { code: "        return $this->plan === 'premium';", exp: "⭐ === = égalité stricte (valeur ET type). Vrai si l'abonnement est premium." }
      ]
    },
    {
      couche: "Mail", dossier: "src/app/Mail", fichier: "WelcomeMail.php", startLine: 8,
      lang: "php", difficulte: "piege",
      role: "Envoie l'email de confirmation via PHPMailer, en SMTP authentifié (Resend) configuré par variables d'environnement.",
      oral: "L'email n'est pas envoyé avec la façade Mail de Laravel mais avec la librairie PHPMailer, en SMTP authentifié et chiffré (STARTTLS) vers un vrai fournisseur (Resend). Toute la config vient du .env : aucun secret n'est écrit en dur. En local, Mailhog reste disponible.",
      lignes: [
        { code: "function confirmAccountMail($sendTo, $token)", exp: "Fonction simple (pas une classe Mailable). Chargée globalement via composer.json (autoload files).", detail: "`function` = mot-clé qui déclare une fonction. `confirmAccountMail` = son nom. `(` ouvre la liste des paramètres. `$sendTo` = 1er paramètre (le `$` marque une variable) : l'adresse du destinataire. `,` sépare les paramètres. `$token` = 2e paramètre : le jeton d'activation. `)` ferme la liste." },
        { code: "    $mail = new PHPMailer(true);", exp: "new = instancie un objet. true = active le mode exceptions (les erreurs deviennent des exceptions).", detail: "`$mail` = variable qui contiendra l'objet. `=` = affectation. `new` = crée un nouvel objet. `PHPMailer` = la classe. `(true)` = argument passé au constructeur : active le mode « exceptions ». `;` = fin d'instruction." },
        { code: "        $mail->isSMTP();", exp: "Utilise le protocole SMTP pour l'envoi (Simple Mail Transfer Protocol)." },
        { code: "        $mail->Host = env('MAIL_HOST', 'smtp.resend.com');", exp: "⭐ Host = serveur SMTP, lu depuis le .env (env). Le 2e argument est la valeur par défaut si la variable est absente.", detail: "`$mail` = l'objet mail. `->` = flèche : accède à un membre de l'objet. `Host` = propriété « serveur SMTP ». `=` = affectation. `env(` = fonction qui lit une variable d'environnement. `'MAIL_HOST'` = nom de la variable dans le .env. `,` = séparateur. `'smtp.resend.com'` = valeur par défaut si absente. `)` fin des arguments. `;` fin." },
        { code: "        $mail->Port = env('MAIL_PORT', 587);", exp: "⭐ Port SMTP (587 = port standard du SMTP chiffré par STARTTLS)." },
        { code: "        $mail->SMTPAuth = true;", exp: "⭐ Active l'authentification SMTP (identifiant + mot de passe requis)." },
        { code: "        $mail->Username = env('MAIL_USERNAME');", exp: "Identifiant SMTP, lu dans le .env (jamais en dur)." },
        { code: "        $mail->Password = env('MAIL_PASSWORD');", exp: "⭐ Mot de passe/clé SMTP, lu dans le .env (secret non versionné)." },
        { code: "        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;", exp: "⭐ Chiffrement STARTTLS : la connexion démarre en clair puis passe en TLS (chiffré). :: = accès à une constante de classe.", detail: "`$mail->SMTPSecure` = propriété « type de chiffrement ». `=` affecte. `PHPMailer` = la classe. `::` = opérateur de résolution de portée (accès statique). `ENCRYPTION_STARTTLS` = constante de classe valant la chaîne 'tls'. `;` fin." },
        { code: "        $appUrl = env('APP_URL', 'https://my-budgie.fr');", exp: "⭐ URL publique de l'app (HTTPS en production), lue dans le .env." },
        { code: "        $link = $appUrl . \"/verify?email=\" . urlencode($sendTo) . \"&token=\" . urlencode($token);", exp: "⭐ . = concaténation de chaînes en PHP. urlencode() protège les caractères spéciaux dans l'URL. On construit le lien d'activation.", detail: "`$link` = variable résultat. `=` affecte. `$appUrl` = base de l'URL. `.` = concaténation (colle deux chaînes). `\"/verify?email=\"` = morceau de texte. `urlencode($sendTo)` = encode l'email pour l'URL. de nouveau `.` puis `\"&token=\"` puis `urlencode($token)`. `;` fin." },
        { code: "        $mail->setFrom(env('MAIL_FROM_ADDRESS', 'noreply@my-budgie.fr'), 'Budgie');", exp: "Expéditeur affiché (adresse depuis le .env, nom « Budgie »)." },
        { code: "        $mail->isHTML(true);", exp: "Le corps est interprété comme du HTML (lien cliquable)." },
        { code: "        $mail->send();", exp: "Envoie effectivement l'email (peut lever une exception attrapée par le catch)." }
      ]
    },
    {
      couche: "Vue (Blade)", dossier: "src/resources/views/auth", fichier: "register.blade.php", startLine: 20,
      lang: "blade", difficulte: "facile",
      role: "Formulaire d'inscription, protégé par jeton CSRF, avec composants réutilisables.",
      oral: "Blade est le moteur de templates de Laravel. @csrf insère un jeton anti-CSRF, {{ }} échappe automatiquement le HTML (anti-XSS), et <x-input> est un composant réutilisable.",
      lignes: [
        { code: "<form id=\"register-form\" method=\"POST\" action=\"{{ route('register.store') }}\" class=\"space-y-4\">", exp: "⭐ {{ route('register.store') }} génère l'URL POST /inscription à partir du nom de route. method=POST = envoi de données." },
        { code: "    @csrf", exp: "⭐ Directive Blade : insère un champ caché avec le jeton CSRF. Sans lui, Laravel refuse le POST (erreur 419). Protège contre les requêtes forgées." },
        { code: "    <x-input label=\"Email\" name=\"email\" type=\"email\" :value=\"old('email')\" placeholder=\"vous@exemple.com\" required />", exp: "⭐ <x-input> = composant Blade réutilisable. :value=\"old('email')\" ré-affiche la valeur saisie après une erreur (le : signifie « expression PHP »)." },
        { code: "    <x-input label=\"Confirmer le mot de passe\" name=\"password_confirmation\" type=\"password\" ... required />", exp: "Le nom password_confirmation est celui attendu par la règle confirmed du RegisterRequest." },
        { code: "@if($errors->any())", exp: "Directive @if : affiche le bloc d'erreurs seulement si la validation a échoué." },
        { code: "    @foreach($errors->all() as $error)", exp: "@foreach = boucle sur chaque message d'erreur." },
        { code: "        <li class=\"text-sm\">{{ $error }}</li>", exp: "⭐ {{ $error }} : Blade échappe le contenu (les caractères < > deviennent inoffensifs) → protection XSS automatique." }
      ]
    },
    {
      couche: "Migration / BDD", dossier: "src/database/migrations", fichier: "2026_02_01_131145_create_users_table.php", startLine: 14,
      lang: "php", difficulte: "cle",
      role: "Décrit la structure de la table users (colonnes, types, contraintes).",
      oral: "Une migration est un fichier versionné qui crée/modifie une table. C'est le schéma de la base « en code », rejouable avec php artisan migrate.",
      lignes: [
        { code: "Schema::create('users', function (Blueprint $table) {", exp: "⭐ Crée la table users. $table (un Blueprint) sert à décrire les colonnes." },
        { code: "    $table->id();", exp: "Colonne id : clé primaire auto-incrémentée (identifiant unique)." },
        { code: "    $table->string('email', 60)->unique();", exp: "⭐ Colonne texte de 60 max, ->unique() = contrainte d'unicité en base (double garde-fou avec la validation)." },
        { code: "    $table->string('password', 255);", exp: "Stocke le mot de passe haché (bcrypt fait ~60 caractères)." },
        { code: "    $table->enum('role', ['admin', 'user'])->default('user');", exp: "⭐ enum = valeurs autorisées uniquement (admin ou user). default('user') = valeur par défaut." },
        { code: "    $table->string('verification_token', 64)->nullable();", exp: "Jeton d'activation, nullable (vidé après activation)." },
        { code: "    $table->boolean('is_active')->default(false);", exp: "⭐ Compte inactif par défaut : il faut valider l'email pour activer." }
      ]
    }
  ],
  quiz: [
    { q: "Où se fait la validation des données d'inscription ?", r: "Dans la Form Request RegisterRequest (méthode rules()), avant le contrôleur." },
    { q: "Comment le mot de passe est-il protégé ?", r: "Hash::make (bcrypt) à l'inscription + cast 'hashed' dans le modèle User ; jamais stocké en clair." },
    { q: "À quoi sert @csrf ?", r: "À insérer un jeton anti-CSRF ; sans lui Laravel rejette le POST (419)." },
    { q: "Comment un compte est-il activé ?", r: "Via le lien email /verify?email=&token= : verify() met is_active=true et efface le jeton." }
  ],
  examen: [
    { q: "Pourquoi une Form Request plutôt que valider dans le contrôleur ?", court: "Séparation des responsabilités + réutilisable.", exp: "La classe RegisterRequest isole les règles de validation et l'autorisation ; le contrôleur reste concentré sur la logique. Si la validation échoue, Laravel redirige automatiquement avec les erreurs.", ref: "app/Http/Requests/Auth/RegisterRequest.php" },
    { q: "Qu'est-ce que l'assignation de masse et comment est-elle bloquée ?", court: "Remplir des colonnes non voulues ; bloquée par $fillable.", exp: "Sans liste blanche, un attaquant pourrait injecter role=admin. $fillable n'autorise que les colonnes listées lors de create()/update().", ref: "app/Models/User.php (13)" },
    { q: "Pourquoi régénérer la session à la connexion ?", court: "Empêcher la fixation de session.", exp: "session()->regenerate() change l'ID de session après login, empêchant un attaquant qui aurait imposé un ID de réutiliser la session authentifiée.", ref: "app/Http/Controllers/Auth/AuthController.php (51)" },
    { q: "Quelle librairie envoie les emails, et pourquoi Mailhog ?", court: "PHPMailer en SMTP vers Mailhog.", exp: "PHPMailer envoie en SMTP direct ; Mailhog est un faux serveur SMTP de développement qui capte les mails (interface web port 8025) sans les envoyer réellement.", ref: "app/Mail/WelcomeMail.php (20-21)" }
  ],
  limites: [
    { titre: "Fonction mail globale", souci: "confirmAccountMail est une fonction chargée via autoload files, pas une classe Mailable Laravel (moins testable, pas de file d'attente).", correction: "Créer une classe Mailable (php artisan make:mail) et l'envoyer avec Mail::to()->queue() pour bénéficier des queues et des tests." },
    { titre: "Pas de limitation de tentatives", souci: "login() n'a pas de throttling : vulnérable au bruteforce.", correction: "Ajouter le middleware throttle sur la route de connexion ou RateLimiter." }
  ]
},

/* =====================================================================
   F2 — COMPTES (CRUD)
   ===================================================================== */
{
  id: "comptes",
  icone: "🏦",
  titre: "Comptes",
  sousTitre: "Créer, afficher, modifier, supprimer un compte ; calcul du solde",
  resume: "Un compte regroupe des revenus et des dépenses, avec un taux de rémunération et un taux d'imposition. Le solde affiché est recalculé : total des revenus − total des dépenses.",
  mantra: "Requête → Route (auth) → Contrôleur (vérifie le propriétaire + quota) → Modèle Account → BDD → Vue (grille + modal fetch).",
  etapes: [
    {
      couche: "Route", dossier: "src/routes", fichier: "web.php", startLine: 32,
      lang: "php", difficulte: "facile",
      role: "Routes CRUD des comptes, toutes dans le groupe middleware('auth').",
      oral: "Les routes comptes sont RESTful : GET /comptes liste, POST crée, GET /comptes/{account} affiche, PUT modifie, DELETE supprime. {account} est un paramètre de route lié automatiquement au modèle.",
      lignes: [
        { code: "Route::get('/comptes', [AccountController::class, 'index'])->name('accounts.index');", exp: "Liste des comptes de l'utilisateur." },
        { code: "Route::post('/comptes', [AccountController::class, 'store'])->name('accounts.store');", exp: "Crée un compte (POST)." },
        { code: "Route::put('/comptes/{account}', [AccountController::class, 'update'])->name('accounts.update');", exp: "⭐ {account} = paramètre. Le Route Model Binding transforme l'id en objet Account directement." },
        { code: "Route::get('/comptes/{account}', [ AccountController::class, 'show'])->name('accounts.show');", exp: "Détail d'un compte." },
        { code: "Route::delete('/comptes/{account}', [AccountController::class, 'destroy'])->name('accounts.destroy');", exp: "Supprime le compte (DELETE)." }
      ]
    },
    {
      couche: "Contrôleur", dossier: "src/app/Http/Controllers", fichier: "AccountController.php", startLine: 22,
      lang: "php", difficulte: "cle",
      role: "index() : liste les comptes de l'utilisateur avec leur solde calculé.",
      oral: "index() récupère uniquement les comptes de l'utilisateur connecté, puis pour chacun calcule le solde = somme des revenus − somme des dépenses, et renvoie la vue.",
      lignes: [
        { code: "$user = auth()->user();", exp: "⭐ auth()->user() = l'utilisateur connecté (via la session)." },
        { code: "$accounts = Account::query()->where('user_id', $user->id)->orderBy('name')->get();", exp: "⭐ On ne récupère QUE les comptes dont user_id = mon id (isolation des données). orderBy trie par nom, get() exécute la requête." },
        { code: "$result = $accounts->map(function ($account) {", exp: "map() applique une transformation à chaque compte (comme une boucle qui renvoie un nouveau tableau)." },
        { code: "    $incomeTotal = (float) Income::where('account_id', $account->id)->sum('amount');", exp: "⭐ sum('amount') = somme SQL des montants des revenus du compte. (float) = conversion en nombre décimal." },
        { code: "    $expenseTotal = (float) Expense::where('account_id', $account->id)->sum('amount');", exp: "Idem pour les dépenses." },
        { code: "        'balance' => $incomeTotal - $expenseTotal,", exp: "⭐ Solde = revenus − dépenses. Calculé à la volée (la colonne balance de la table n'est PAS utilisée)." },
        { code: "return view('accounts.index', ['accounts' => $result]);", exp: "Renvoie la vue avec les comptes et leurs soldes." }
      ]
    },
    {
      couche: "Contrôleur", dossier: "src/app/Http/Controllers", fichier: "AccountController.php", startLine: 46,
      lang: "php", difficulte: "cle",
      role: "store() : crée un compte, applique le quota du plan gratuit et valide les données.",
      oral: "store() vérifie d'abord le quota gratuit (2 comptes max), puis valide les données, rattache le compte à l'utilisateur et l'enregistre. Réponse en JSON consommée par le fetch de la vue.",
      lignes: [
        { code: "if (!$user->isPremium() && Account::where('user_id', $user->id)->count() >= 2) {", exp: "⭐ Quota : si l'utilisateur n'est PAS premium (!isPremium) ET qu'il a déjà ≥ 2 comptes, on bloque. && = ET logique." },
        { code: "    return response()->json(['message' => 'Limite du plan gratuit atteinte (2 comptes)...'], 403);", exp: "⭐ Réponse JSON avec code HTTP 403 (interdit). Le fetch de la vue affiche ce message." },
        { code: "$data = $request->validate([", exp: "Validation en ligne (le contrôleur valide lui-même ici, pas de Form Request dédiée)." },
        { code: "    'name' => ['required', 'string', 'max:100'],", exp: "Nom obligatoire, 100 caractères max." },
        { code: "    'rate_remuneration' => ['nullable', 'numeric'],", exp: "Taux de rémunération facultatif et numérique." },
        { code: "    'rate_imposition' => ['nullable', 'numeric'],", exp: "Taux d'imposition facultatif et numérique." },
        { code: "$data['user_id'] = $user->id;", exp: "⭐ On force le propriétaire = utilisateur connecté (jamais depuis le formulaire → sécurité)." },
        { code: "$account = Account::create($data);", exp: "Insertion en base via Eloquent." },
        { code: "return response()->json($account, 201);", exp: "⭐ 201 = « Created ». Renvoie le compte créé." }
      ]
    },
    {
      couche: "Contrôleur", dossier: "src/app/Http/Controllers", fichier: "AccountController.php", startLine: 87,
      lang: "php", difficulte: "cle",
      role: "show() : détaille un compte (solde + 5 derniers mouvements) ; accès au propriétaire OU à un invité en lecture seule.",
      oral: "Depuis le partage, show() ne teste plus seulement la propriété mais isAccessibleBy() : le propriétaire OU un invité dont le partage est accepté peut voir le compte. La variable is_owner sert à masquer les boutons de modification pour l'invité.",
      lignes: [
        { code: "public function show(Request $request, Account $account)", exp: "⭐ Route Model Binding : Laravel charge le compte depuis l'id de l'URL. $request sert à distinguer une réponse JSON d'une page HTML." },
        { code: "if (!$account->isAccessibleBy($user)) {", exp: "⭐⭐ Nouveau contrôle d'accès : vrai si je suis le propriétaire OU un invité au partage accepté (méthode définie dans le modèle Account). Voir la fonctionnalité Partage." },
        { code: "    if ($request->wantsJson()) {", exp: "wantsJson() = le client attend-il du JSON ? Permet de répondre différemment à l'API et au navigateur." },
        { code: "        return response()->json(['error' => 'Accès refusé.'], 403);", exp: "403 = interdit (pour un appel API)." },
        { code: "    return response()->view('accounts.share-failed', [...], 403);", exp: "Sinon, page « accès révoqué » avec le code 403." },
        { code: "$isOwner = $account->isOwnedBy($user);", exp: "⭐ isOwnedBy = suis-je le propriétaire ? Sert à afficher/masquer les actions d'écriture dans la vue." },
        { code: "return view('accounts.show', [ ... 'is_owner' => $isOwner, 'shares' => $isOwner ? $account->shares()->... : collect() ]);", exp: "⭐ On passe is_owner à la vue, et la liste des partages uniquement au propriétaire (sinon une collection vide). ?: = opérateur ternaire." }
      ]
    },
    {
      couche: "Modèle", dossier: "src/app/Models", fichier: "Account.php", startLine: 12,
      lang: "php", difficulte: "cle",
      role: "Modèle Account : champs remplissables, conversions décimales et relations Eloquent.",
      oral: "Account appartient à un User (belongsTo) et possède plusieurs revenus, dépenses et prévisions (hasMany). Ces relations permettent d'écrire $account->incomes() sans SQL manuel.",
      lignes: [
        { code: "protected $fillable = [ 'name', 'description', 'balance', 'rate_remuneration', 'rate_imposition', 'user_id', ];", exp: "Colonnes remplissables en masse (liste blanche)." },
        { code: "protected $casts = [ 'rate_remuneration' => 'decimal:2', ... ];", exp: "⭐ Casts : les taux sont convertis en décimaux à 2 chiffres." },
        { code: "public function user() { return $this->belongsTo(User::class); }", exp: "⭐ belongsTo = « ce compte appartient à un utilisateur » (relation inverse de hasMany)." },
        { code: "public function incomes() { return $this->hasMany(Income::class); }", exp: "⭐ hasMany = « un compte a plusieurs revenus ». Utilisé par le PrevisionService." },
        { code: "public function expenses() { return $this->hasMany(Expense::class); }", exp: "Relation vers les dépenses." }
      ]
    },
    {
      couche: "Migration / BDD", dossier: "src/database/migrations", fichier: "2026_02_01_134219_create_accounts_table.php", startLine: 14,
      lang: "php", difficulte: "cle",
      role: "Structure de la table accounts avec sa clé étrangère vers users.",
      oral: "La table accounts a une clé étrangère user_id vers users, avec suppression en cascade : supprimer un utilisateur supprime ses comptes.",
      lignes: [
        { code: "$table->string('name', 100);", exp: "Nom court du compte (100 max)." },
        { code: "$table->decimal('balance', 14, 2)->default(0.00);", exp: "decimal(14,2) = nombre à 14 chiffres dont 2 décimales. Colonne présente mais non utilisée pour le calcul du solde." },
        { code: "$table->decimal('rate_remuneration', 5, 2)->default(0.00);", exp: "⭐ Taux annuel de rémunération (ex : 1,70 %)." },
        { code: "$table->decimal('rate_imposition', 5, 2)->default(0.00);", exp: "Taux d'imposition sur les intérêts (ex : 30 %)." },
        { code: "$table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');", exp: "⭐ Clé étrangère : user_id pointe vers users.id. onDelete('cascade') = supprime les comptes si l'utilisateur est supprimé." }
      ]
    },
    {
      couche: "Vue (Blade)", dossier: "src/resources/views/accounts", fichier: "index.blade.php", startLine: 136,
      lang: "js", difficulte: "piege",
      role: "Grille des comptes + modal de création qui envoie les données en JSON via fetch, + filtre local.",
      oral: "La création de compte ne recharge pas la page : un fetch POST envoie les données en JSON avec le jeton CSRF dans l'en-tête. Le filtre de recherche est côté client (JavaScript).",
      lignes: [
        { code: "document.getElementById('form-new-account').addEventListener('submit', async function(e) {", exp: "Écoute l'envoi du formulaire. async = fonction asynchrone (permet await)." },
        { code: "    e.preventDefault();", exp: "⭐ Empêche le rechargement classique de la page : on gère l'envoi en JS." },
        { code: "    const data = Object.fromEntries(formData.entries());", exp: "Transforme les champs du formulaire en objet JavaScript." },
        { code: "    const response = await fetch('{{ route(\"accounts.store\") }}', {", exp: "⭐ fetch = requête HTTP en JS. L'URL est générée par Blade au rendu. await attend la réponse." },
        { code: "        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': '{{ csrf_token() }}', 'Accept': 'application/json' },", exp: "⭐ On envoie le jeton CSRF dans l'en-tête (obligatoire pour POST) et on demande du JSON." },
        { code: "        body: JSON.stringify(data),", exp: "Sérialise l'objet en texte JSON pour le corps de la requête." },
        { code: "    if (response.ok) { window.location.reload(); }", exp: "Si succès (2xx), on recharge la liste." },
        { code: "document.getElementById('search-accounts').addEventListener('input', function(e) {", exp: "⭐ Filtre de recherche : à chaque frappe, on masque les cartes qui ne contiennent pas le texte (recherche par nom court / description côté client)." }
      ]
    }
  ],
  quiz: [
    { q: "Comment est calculé le solde d'un compte ?", r: "Somme des revenus − somme des dépenses (sum('amount')), à la volée. La colonne balance n'est pas utilisée." },
    { q: "Comment est appliqué le quota du plan gratuit ?", r: "if (!isPremium() && count >= 2) → réponse JSON 403 dans store()." },
    { q: "Qu'est-ce que le Route Model Binding ?", r: "Laravel convertit {account} de l'URL en objet Account automatiquement (show(Account $account))." },
    { q: "Comment isole-t-on les comptes d'un utilisateur ?", r: "where('user_id', $user->id) partout + vérification $account->user_id !== $user->id." }
  ],
  examen: [
    { q: "Pourquoi calculer le solde à chaque requête plutôt que le stocker ?", court: "Toujours juste, pas de désynchronisation.", exp: "Recalculer sum(revenus)-sum(dépenses) évite qu'une colonne balance devienne fausse après un ajout/suppression. Inconvénient : coût de calcul (négligeable ici).", ref: "app/Http/Controllers/AccountController.php (31-39)" },
    { q: "Comment empêchez-vous un utilisateur de voir le compte d'un autre ?", court: "Vérif $account->user_id !== $user->id.", exp: "Chaque méthode compare le propriétaire du compte à l'utilisateur connecté et renvoie 403 sinon. C'est une autorisation manuelle (on pourrait utiliser des Policies).", ref: "app/Http/Controllers/AccountController.php (73, 90, 120)" },
    { q: "Pourquoi forcer user_id côté serveur ?", court: "Empêcher l'usurpation de propriétaire.", exp: "$data['user_id'] = $user->id ; on ne fait jamais confiance à un user_id venant du formulaire, sinon on créerait un compte au nom d'autrui.", ref: "app/Http/Controllers/AccountController.php (65)" }
  ],
  limites: [
    { titre: "Autorisations dans le contrôleur", souci: "La vérification du propriétaire est répétée dans chaque méthode (duplication).", correction: "Centraliser via une Policy (php artisan make:policy AccountPolicy) et $this->authorize('view', $account)." },
    { titre: "Colonne balance morte", souci: "La colonne balance existe mais n'est jamais utilisée.", correction: "La supprimer par une migration, ou la maintenir via un accessor calculé." }
  ]
},

/* =====================================================================
   F3 — DÉPENSES (CRUD)
   ===================================================================== */
{
  id: "depenses",
  icone: "💸",
  titre: "Dépenses",
  sousTitre: "CRUD des dépenses ; ponctuel ou récurrent (tous les N mois)",
  resume: "Une dépense appartient à un compte. Elle est soit ponctuelle, soit récurrente (mensuelle/annuelle) avec une date de début et une date de fin optionnelle. Quota gratuit : 7 dépenses par compte.",
  mantra: "Route (auth) → Contrôleur (propriétaire + quota 7 + validation) → Modèle Expense → BDD.",
  etapes: [
    {
      couche: "Route", dossier: "src/routes", fichier: "web.php", startLine: 34,
      lang: "php", difficulte: "facile",
      role: "Routes des dépenses, imbriquées sous un compte.",
      oral: "Les dépenses sont imbriquées : /comptes/{account}/depenses. Il existe aussi une route globale /comptes/expenses pour lister toutes les dépenses de l'utilisateur.",
      lignes: [
        { code: "Route::get('/comptes/expenses', [ExpenseController::class, 'userExpenses'])->name('expenses.userExpenses');", exp: "⭐ Toutes les dépenses de tous mes comptes (vue globale)." },
        { code: "Route::get('/comptes/{account}/depenses', [ExpenseController::class, 'index'])->name('expenses.index');", exp: "Dépenses d'UN compte précis." },
        { code: "Route::post('/comptes/{account}/depenses', [ExpenseController::class, 'store'])->name('expenses.store');", exp: "Créer une dépense sur ce compte." },
        { code: "Route::put('/comptes/{account}/depenses/{expense}', [ExpenseController::class, 'update'])->name('expenses.update');", exp: "⭐ Deux paramètres liés : {account} et {expense}." },
        { code: "Route::delete('/comptes/{account}/depenses/{expense}', [ExpenseController::class, 'destroy'])->name('expenses.destroy');", exp: "Supprimer une dépense." }
      ]
    },
    {
      couche: "Contrôleur", dossier: "src/app/Http/Controllers", fichier: "ExpenseController.php", startLine: 54,
      lang: "php", difficulte: "cle",
      role: "store() : quota 7, validation de la récurrence, rattachement au compte.",
      oral: "store() vérifie le propriétaire du compte, applique le quota gratuit (7 dépenses), valide la récurrence (MONTHLY/WEEKLY/YEARLY) et force value_recurring à null si la dépense est ponctuelle.",
      lignes: [
        { code: "if ($account->user_id !== $user->id) {", exp: "⭐ On vérifie que le compte parent m'appartient avant d'y ajouter une dépense." },
        { code: "if (!$user->isPremium() && $account->expenses()->count() >= 7) {", exp: "⭐ Quota gratuit : 7 dépenses par compte maximum. $account->expenses() utilise la relation hasMany." },
        { code: "$recurringValues = ['MONTHLY', 'WEEKLY', 'YEARLY'];", exp: "Valeurs autorisées de récurrence." },
        { code: "    'recurring' => ['required', 'boolean'],", exp: "recurring = vrai (récurrent) ou faux (ponctuel)." },
        { code: "    'value_recurring' => ['nullable', Rule::in($recurringValues)],", exp: "⭐ Rule::in limite la valeur à la liste autorisée (garde-fou)." },
        { code: "    'date_end' => ['nullable', 'date', 'after_or_equal:date_start'],", exp: "⭐ after_or_equal:date_start : la fin ne peut pas précéder le début (cohérence)." },
        { code: "$data['account_id'] = $account->id;", exp: "Rattache la dépense au compte." },
        { code: "if (empty($data['recurring'])) { $data['value_recurring'] = null; }", exp: "⭐ Si ponctuelle, on efface la fréquence (elle n'a pas de sens)." },
        { code: "$expense = Expense::create($data);", exp: "Insertion en base." }
      ]
    },
    {
      couche: "Contrôleur", dossier: "src/app/Http/Controllers", fichier: "ExpenseController.php", startLine: 26,
      lang: "php", difficulte: "facile",
      role: "userExpenses() : toutes les dépenses de l'utilisateur avec eager loading.",
      oral: "userExpenses() récupère les id de mes comptes, puis toutes les dépenses de ces comptes en chargeant la relation account d'un coup (with) pour éviter le problème N+1.",
      lignes: [
        { code: "$accountIds = $accounts->pluck('id');", exp: "pluck('id') = extrait seulement la colonne id de la collection." },
        { code: "$expenses = Expense::whereIn('account_id', $accountIds)", exp: "⭐ whereIn = WHERE account_id IN (...) : dépenses de tous mes comptes." },
        { code: "    ->with('account')", exp: "⭐ Eager loading : charge le compte lié en une requête (évite N+1 requêtes)." },
        { code: "    ->orderByDesc('date_start')->orderByDesc('id')->get();", exp: "Tri du plus récent au plus ancien." }
      ]
    },
    {
      couche: "Migration / BDD", dossier: "src/database/migrations", fichier: "2026_02_01_134340_create_expenses_table.php", startLine: 14,
      lang: "php", difficulte: "cle",
      role: "Structure de la table expenses (récurrence, montant, dates, clé étrangère).",
      oral: "La table expenses porte la récurrence (booléen + enum), le montant décimal, les dates début/fin et une clé étrangère account_id en cascade.",
      lignes: [
        { code: "$table->boolean('recurring')->default(false);", exp: "Ponctuelle (false) ou récurrente (true)." },
        { code: "$table->enum('value_recurring', ['MONTHLY', 'WEEKLY', 'YEARLY'])->nullable();", exp: "⭐ Fréquence limitée à 3 valeurs, nullable si ponctuelle." },
        { code: "$table->decimal('amount', 14, 2);", exp: "Montant à 2 décimales." },
        { code: "$table->date('date_start');", exp: "Date de début (obligatoire)." },
        { code: "$table->date('date_end')->nullable();", exp: "Date de fin optionnelle (N/A possible)." },
        { code: "$table->foreign('account_id')->references('id')->on('accounts')->onDelete('cascade');", exp: "⭐ Supprimer un compte supprime ses dépenses." }
      ]
    }
  ],
  quiz: [
    { q: "Quel est le quota gratuit de dépenses ?", r: "7 dépenses par compte (ExpenseController::store, ligne 62)." },
    { q: "Comment est validée la fréquence de récurrence ?", r: "Rule::in(['MONTHLY','WEEKLY','YEARLY']) sur value_recurring." },
    { q: "Que se passe-t-il si la dépense est ponctuelle ?", r: "value_recurring est forcé à null (empty($data['recurring']))." },
    { q: "C'est quoi l'eager loading ->with('account') ?", r: "Charger la relation en une seule requête pour éviter le problème N+1." }
  ],
  examen: [
    { q: "Qu'est-ce que le problème N+1 et comment l'évitez-vous ?", court: "1 requête + N requêtes de relation ; évité par with().", exp: "Sans eager loading, afficher le compte de chaque dépense déclenche 1 requête par dépense. ->with('account') précharge tout en 2 requêtes.", ref: "app/Http/Controllers/ExpenseController.php (37)" },
    { q: "Comment garantissez-vous la cohérence des dates ?", court: "Règle after_or_equal:date_start.", exp: "La validation refuse une date de fin antérieure à la date de début.", ref: "app/Http/Controllers/ExpenseController.php (75)" },
    { q: "Une dépense peut-elle être ajoutée à n'importe quel compte ?", court: "Non, seulement au sien.", exp: "store() renvoie 403 si $account->user_id !== $user->id.", ref: "app/Http/Controllers/ExpenseController.php (57)" }
  ],
  limites: [
    { titre: "WEEKLY non géré dans le calcul", souci: "L'enum autorise WEEKLY mais le PrevisionService le traite comme mensuel (default => 1).", correction: "Gérer WEEKLY à part (approximation ~4,33 semaines/mois) ou retirer WEEKLY de l'enum si non voulu." }
  ]
},

/* =====================================================================
   F4 — REVENUS (CRUD)
   ===================================================================== */
{
  id: "revenus",
  icone: "💰",
  titre: "Revenus",
  sousTitre: "CRUD des revenus ; structure jumelle des dépenses",
  resume: "Un revenu est structurellement identique à une dépense (mêmes champs) mais s'ajoute au solde. Quota gratuit : 2 revenus par compte.",
  mantra: "Route (auth) → Contrôleur (propriétaire + quota 2 + validation) → Modèle Income → BDD.",
  etapes: [
    {
      couche: "Route", dossier: "src/routes", fichier: "web.php", startLine: 35,
      lang: "php", difficulte: "facile",
      role: "Routes des revenus, symétriques à celles des dépenses.",
      oral: "Les revenus suivent exactement le même schéma que les dépenses, avec le préfixe /revenus.",
      lignes: [
        { code: "Route::get('/comptes/incomes', [IncomeController::class, 'userIncomes'])->name('incomes.userIncomes');", exp: "Tous les revenus de l'utilisateur." },
        { code: "Route::get('/comptes/{account}/revenus', [IncomeController::class, 'index'])->name('incomes.index');", exp: "Revenus d'un compte." },
        { code: "Route::post('/comptes/{account}/revenus', [IncomeController::class, 'store'])->name('incomes.store');", exp: "Créer un revenu." },
        { code: "Route::put('/comptes/{account}/revenus/{income}', [IncomeController::class, 'update'])->name('incomes.update');", exp: "Modifier un revenu." },
        { code: "Route::delete('/comptes/{account}/revenus/{income}', [IncomeController::class, 'destroy'])->name('incomes.destroy');", exp: "Supprimer un revenu." }
      ]
    },
    {
      couche: "Contrôleur", dossier: "src/app/Http/Controllers", fichier: "IncomeController.php", startLine: 55,
      lang: "php", difficulte: "cle",
      role: "store() : identique aux dépenses, mais quota de 2 revenus par compte.",
      oral: "Seule différence notable avec les dépenses : le quota est de 2 revenus par compte au lieu de 7 dépenses.",
      lignes: [
        { code: "if ($account->user_id !== $user->id) {", exp: "Vérification du propriétaire du compte." },
        { code: "if (!$user->isPremium() && $account->incomes()->count() >= 2) {", exp: "⭐ Quota gratuit : 2 revenus par compte (différence avec les dépenses)." },
        { code: "    'amount' => ['required', 'numeric', 'min:0'],", exp: "Montant obligatoire, numérique, positif." },
        { code: "    'date_start' => ['required', 'date'],", exp: "Date de début obligatoire." },
        { code: "$data['account_id'] = $account->id;", exp: "Rattache le revenu au compte." },
        { code: "$income = Income::create($data);", exp: "Insertion en base." },
        { code: "return response()->json($income, 201);", exp: "201 = créé." }
      ]
    },
    {
      couche: "Modèle", dossier: "src/app/Models", fichier: "Income.php", startLine: 12,
      lang: "php", difficulte: "facile",
      role: "Modèle Income : mêmes champs que Expense, relation vers Account.",
      oral: "Income et Expense sont des jumeaux : mêmes $fillable, mêmes casts, même relation belongsTo(Account).",
      lignes: [
        { code: "protected $fillable = [ 'name', 'description', 'recurring', 'value_recurring', 'amount', 'date_start', 'date_end', 'account_id', ];", exp: "Colonnes remplissables (identiques à Expense)." },
        { code: "protected $casts = [ 'recurring' => 'boolean', 'amount' => 'decimal:2', 'date_start' => 'date', 'date_end' => 'date', ];", exp: "⭐ Conversions : booléen, décimal, dates." },
        { code: "public function account() { return $this->belongsTo(Account::class); }", exp: "Un revenu appartient à un compte." }
      ]
    }
  ],
  quiz: [
    { q: "Quel est le quota gratuit de revenus ?", r: "2 revenus par compte (IncomeController::store, ligne 63)." },
    { q: "Quelle est la différence de structure entre Income et Expense ?", r: "Aucune : mêmes colonnes et casts ; seule la logique (ajoute au solde) et le quota diffèrent." }
  ],
  examen: [
    { q: "Pourquoi deux contrôleurs quasi identiques (Income/Expense) ?", court: "Clarté métier, quotas différents.", exp: "Séparer revenus et dépenses rend le code lisible et permet des règles différentes (quota 2 vs 7). On pourrait factoriser dans un trait/classe abstraite.", ref: "app/Http/Controllers/IncomeController.php vs ExpenseController.php" },
    { q: "Le signe (+/−) d'un revenu est-il stocké ?", court: "Non, le montant est positif.", exp: "Les revenus s'ajoutent et les dépenses se soustraient dans le calcul du solde ; le montant reste positif en base (min:0).", ref: "app/Services/PrevisionService.php (34,41)" }
  ],
  limites: [
    { titre: "Duplication Income/Expense", souci: "Deux contrôleurs presque identiques.", correction: "Factoriser la logique commune (validation, quota) dans une classe de base ou un trait." }
  ]
},

/* =====================================================================
   F5 — PRÉVISIONS & CALCUL D'INTÉRÊTS (le cœur du projet)
   ===================================================================== */
{
  id: "previsions",
  icone: "📈",
  titre: "Prévisions",
  sousTitre: "Projeter le solde net de chaque compte à un mois choisi",
  resume: "La prévision simule, mois par mois, l'état d'un compte : elle applique revenus et dépenses selon leur récurrence, puis ajoute les intérêts nets (taux annuel converti en mensuel, diminué de l'imposition). C'est LA fonctionnalité la plus technique.",
  mantra: "Route → Contrôleur (choix du mois) → PrevisionService.projectAccount (boucle mensuelle : revenus − dépenses + intérêts nets) → Vue (tableau).",
  etapes: [
    {
      couche: "Route", dossier: "src/routes", fichier: "web.php", startLine: 47,
      lang: "php", difficulte: "facile",
      role: "Deux routes : vue globale (tous les comptes) et détail d'un compte.",
      oral: "GET /previsions donne l'état de tous mes comptes ; GET /comptes/{account}/previsions détaille un compte.",
      lignes: [
        { code: "Route::get('/previsions', [PrevisionController::class, 'overview'])->name('previsions.overview');", exp: "⭐ Vue d'ensemble : projette tous les comptes." },
        { code: "Route::get('/comptes/{account}/previsions', [PrevisionController::class, 'index'])->name('previsions.index');", exp: "Prévision détaillée d'un seul compte." }
      ]
    },
    {
      couche: "Contrôleur", dossier: "src/app/Http/Controllers", fichier: "PrevisionController.php", startLine: 15,
      lang: "php", difficulte: "cle",
      role: "Détermine le mois cible (défaut décembre courant) et cumule les projections.",
      oral: "moisChoisi() lit ?month=YYYY-MM et le valide par une expression régulière, sinon retourne décembre de l'année en cours. overview() appelle le service pour chaque compte et additionne les totaux.",
      lignes: [
        { code: "private function moisChoisi(Request $request): Carbon", exp: "⭐ Retourne un objet Carbon (librairie de dates). private = utilisable seulement dans cette classe." },
        { code: "    $month = $request->query('month');", exp: "Lit le paramètre d'URL ?month=." },
        { code: "    if ($month && preg_match('/^\\d{4}-\\d{2}$/', $month)) {", exp: "⭐ preg_match = expression régulière. ^\\d{4}-\\d{2}$ = 4 chiffres, tiret, 2 chiffres (format AAAA-MM). Sécurise l'entrée." },
        { code: "        return Carbon::createFromFormat('Y-m', $month)->startOfMonth();", exp: "Crée la date au 1er du mois demandé." },
        { code: "    return Carbon::create(now()->year, 12, 1);", exp: "⭐ Par défaut : 1er décembre de l'année en cours." },
        { code: "    $r = $service->projectAccount($account, $mois);", exp: "⭐ Appelle le service métier pour projeter ce compte." },
        { code: "    $lignes[] = ['account' => $account] + $r;", exp: "[] = ajoute au tableau. + fusionne deux tableaux associatifs (compte + résultats)." },
        { code: "        $totaux[$k] = $v + $r[$k];", exp: "Cumule chaque total (revenus, dépenses, intérêts, solde) sur tous les comptes." }
      ]
    },
    {
      couche: "Service", dossier: "src/app/Services", fichier: "PrevisionService.php", startLine: 13,
      lang: "php", difficulte: "piege",
      role: "projectAccount() : simule mois par mois le solde net jusqu'au mois cible. LE cœur du calcul.",
      oral: "On convertit les dates en index de mois. On parcourt chaque mois du début (création du compte) jusqu'à la cible : on ajoute les revenus du mois, on retire les dépenses, puis on ajoute les intérêts nets sur le solde de fin de mois.",
      lignes: [
        { code: "public function projectAccount(Account $account, Carbon $moisCible): array", exp: "⭐ Reçoit le compte et le mois cible, retourne un tableau de 4 totaux." },
        { code: "$debut = $this->idx(Carbon::parse($account->created_at));", exp: "⭐ idx() transforme la date de création en numéro de mois absolu (voir étape suivante)." },
        { code: "$fin   = $this->idx($moisCible);", exp: "Numéro de mois de la cible." },
        { code: "$solde = 0.0;", exp: "Solde courant (démarre à 0). Le .0 force un flottant." },
        { code: "$revenus  = $account->incomes()->get();", exp: "⭐ Charge les revenus UNE seule fois (hors de la boucle → performance)." },
        { code: "$depenses = $account->expenses()->get();", exp: "Charge les dépenses une seule fois." },
        { code: "$tauxMensuel = ((float) $account->rate_remuneration) / 100 / 12;", exp: "⭐⭐ Conversion taux ANNUEL en MENSUEL : /100 pour passer du pourcentage au ratio, /12 pour le répartir sur 12 mois." },
        { code: "$tauxNet     = 1 - ((float) $account->rate_imposition) / 100;", exp: "⭐⭐ Facteur net après impôt : ex. 30 % d'impôt → tauxNet = 1 − 0,30 = 0,70 (on garde 70 % des intérêts)." },
        { code: "for ($m = $debut; $m <= $fin; $m++) {", exp: "⭐ Boucle mois par mois, du début du compte jusqu'au mois cible. $m++ = incrémente." },
        { code: "    foreach ($revenus as $r) {", exp: "Pour chaque revenu, on teste s'il s'applique ce mois." },
        { code: "        if ($this->occursIn($r, $m)) {", exp: "⭐ occursIn décide si le mouvement tombe ce mois (récurrence)." },
        { code: "            $solde += (float) $r->amount;", exp: "+= ajoute le montant du revenu au solde." },
        { code: "    foreach ($depenses as $d) {", exp: "Idem pour les dépenses." },
        { code: "            $solde -= (float) $d->amount;", exp: "−= retire le montant de la dépense." },
        { code: "    if ($tauxMensuel > 0) {", exp: "On ne calcule les intérêts que si le compte est rémunéré." },
        { code: "        $net = ($solde * $tauxMensuel) * $tauxNet;", exp: "⭐⭐ Intérêts du mois : solde × taux mensuel, puis × facteur net (après impôt)." },
        { code: "        $solde += $net;", exp: "⭐ Intérêts composés : ils s'ajoutent au solde, donc génèrent des intérêts le mois suivant." },
        { code: "        $totalInterets += $net;", exp: "Cumule le total des intérêts." },
        { code: "return [ 'total_income' => round($totalRevenus, 2), ... 'total_final' => round($solde, 2), ];", exp: "⭐ round(x, 2) arrondit à 2 décimales. Renvoie revenus, dépenses, intérêts et solde net final." }
      ]
    },
    {
      couche: "Service", dossier: "src/app/Services", fichier: "PrevisionService.php", startLine: 61,
      lang: "php", difficulte: "piege",
      role: "Fonctions utilitaires : indexation des mois et test de récurrence.",
      oral: "idx() transforme une date en numéro de mois absolu pour comparer facilement. occursIn() décide si un mouvement tombe un mois donné (ponctuel = uniquement le mois de début ; récurrent = tous les N mois). intervalMois() donne N.",
      lignes: [
        { code: "private function idx(Carbon $date): int", exp: "Retourne un entier (int) : le numéro de mois absolu." },
        { code: "    return $date->year * 12 + ($date->month - 1);", exp: "⭐⭐ année×12 + (mois−1). Ex : 2025-03 → 2025×12 + 2 = 24302. Permet de comparer/soustraire des mois par de simples entiers." },
        { code: "private function occursIn($t, int $m): bool", exp: "Le mouvement $t s'applique-t-il au mois $m ? Retourne vrai/faux." },
        { code: "    $debut = $this->idx(Carbon::parse($t->date_start));", exp: "Mois de début du mouvement." },
        { code: "    if ($m < $debut) { return false; }", exp: "⭐ Avant le début → n'existe pas encore." },
        { code: "    if ($t->date_end && $m > $this->idx(Carbon::parse($t->date_end))) { return false; }", exp: "⭐ Après la date de fin (si définie) → terminé." },
        { code: "    if (!$t->recurring) { return $m === $debut; }", exp: "⭐ Ponctuel : vrai uniquement le mois de début." },
        { code: "    return ($m - $debut) % $this->intervalMois($t) === 0;", exp: "⭐⭐ Récurrent : % = modulo (reste de division). Si l'écart en mois est un multiple de l'intervalle → le mouvement tombe ce mois-là." },
        { code: "private function intervalMois($t): int", exp: "Donne l'intervalle en mois selon la fréquence." },
        { code: "    return match ($t->value_recurring) {", exp: "match = aiguillage (comme switch mais renvoie une valeur, PHP 8)." },
        { code: "        'YEARLY'  => 12,", exp: "Annuel = tous les 12 mois." },
        { code: "        'MONTHLY' => 1,", exp: "Mensuel = tous les mois." },
        { code: "        default   => 1,", exp: "⭐ Piège : WEEKLY retombe ici (traité comme mensuel). Limite connue." }
      ]
    },
    {
      couche: "Vue (Blade)", dossier: "src/resources/views/previsions", fichier: "overview.blade.php", startLine: 15,
      lang: "blade", difficulte: "facile",
      role: "Sélecteur de mois + tableau récapitulatif de tous les comptes avec un total général.",
      oral: "Un formulaire GET envoie le mois choisi. Un tableau Blade affiche chaque compte (revenus, dépenses, intérêts nets, solde net) et un pied de tableau avec le total général.",
      lignes: [
        { code: "<form method=\"GET\" action=\"{{ route('previsions.overview') }}\" class=\"flex items-end gap-3\">", exp: "⭐ Formulaire GET : le mois passe en paramètre d'URL (?month=)." },
        { code: "    <x-input label=\"Mois cible\" name=\"month\" type=\"month\" :value=\"$mois->format('Y-m')\" />", exp: "Sélecteur de mois HTML, pré-rempli avec le mois courant formaté." },
        { code: "@forelse($lignes as $ligne)", exp: "⭐ @forelse = boucle avec un cas @empty si le tableau est vide." },
        { code: "    {{ number_format($ligne['total_final'], 2, ',', ' ') }} €", exp: "⭐ number_format(nombre, 2 décimales, ',' décimale, ' ' milliers) → format français (ex : 12 345,67 €)." },
        { code: "class=\"... {{ $ligne['total_final'] >= 0 ? 'text-budgie-success' : 'text-budgie-danger' }}\"", exp: "⭐ Ternaire ?: → vert si solde positif, rouge si négatif." },
        { code: "    <td class=\"px-6 py-4\">Total général</td>", exp: "Le pied de tableau (tfoot) cumule tous les comptes." }
      ]
    }
  ],
  quiz: [
    { q: "Comment le taux annuel devient-il mensuel ?", r: "rate_remuneration / 100 / 12 (pourcentage → ratio → réparti sur 12 mois)." },
    { q: "Comment l'imposition est-elle prise en compte ?", r: "tauxNet = 1 − rate_imposition/100 ; les intérêts sont multipliés par ce facteur." },
    { q: "Comment sait-on qu'un mouvement tombe un mois donné ?", r: "occursIn() : ponctuel → mois de début ; récurrent → (m − début) % intervalle == 0, entre date_start et date_end." },
    { q: "Que fait idx() ?", r: "Convertit une date en numéro de mois absolu : année*12 + (mois−1), pour comparer les mois en entiers." },
    { q: "Les intérêts sont-ils simples ou composés ?", r: "Composés : $solde += $net chaque mois, donc les intérêts produisent des intérêts." }
  ],
  examen: [
    { q: "Expliquez la formule des intérêts nets mensuels.", court: "(solde × taux/100/12) × (1 − imposition/100).", exp: "Le taux annuel est ramené au mois (/12), appliqué au solde de fin de mois, puis réduit par le facteur net d'imposition. Ajouté au solde → intérêts composés.", ref: "app/Services/PrevisionService.php (27-28, 47-49)" },
    { q: "Pourquoi indexer les mois avec idx() ?", court: "Comparer/soustraire des mois avec de simples entiers.", exp: "année*12+(mois-1) donne un numéro continu ; l'écart entre deux mois et le test modulo de récurrence deviennent triviaux, sans gérer les passages d'année.", ref: "app/Services/PrevisionService.php (61-64)" },
    { q: "Le calcul est-il fait en base ou en PHP ? Avantages/inconvénients ?", court: "En PHP, à chaque requête.", exp: "projectAccount boucle en mémoire. Avantage : logique claire et testable. Inconvénient : recalcul à chaque affichage (pas de cache) et coût sur de longues périodes.", ref: "app/Services/PrevisionService.php (30-51)" },
    { q: "Où est le défaut sur WEEKLY ?", court: "intervalMois: default => 1 (traité comme mensuel).", exp: "L'enum autorise WEEKLY mais le match ne le gère pas explicitement : il retombe sur 1 mois. Limite assumée.", ref: "app/Services/PrevisionService.php (83-90)" }
  ],
  limites: [
    { titre: "WEEKLY = mensuel", souci: "La fréquence hebdomadaire n'est pas correctement modélisée (le modèle est mensuel).", correction: "Convertir en équivalent mensuel (~4,33) ou changer le pas de simulation." },
    { titre: "Pas de mise en cache", souci: "La projection est recalculée à chaque affichage.", correction: "Mémoriser dans la table previsions ou un cache si les données n'ont pas changé." },
    { titre: "Intérêts dès le mois de création", souci: "Les intérêts sont appliqués chaque mois y compris le premier, sur un solde parfois négatif.", correction: "Décider d'une convention (intérêts sur solde positif uniquement, ou à partir du mois suivant)." }
  ]
},

/* =====================================================================
   F6 — ADMINISTRATION
   ===================================================================== */
{
  id: "administration",
  icone: "🛡️",
  titre: "Administration",
  sousTitre: "Middleware admin + gestion des utilisateurs (rôle, statut)",
  resume: "Un espace réservé aux administrateurs (protégé par un middleware) qui liste les utilisateurs et permet de changer leur rôle et leur statut d'activation.",
  mantra: "Route (auth → admin) → Middleware (rôle admin ? sinon 403) → Contrôleur → Vue (table + modal PUT en fetch).",
  etapes: [
    {
      couche: "Route", dossier: "src/routes", fichier: "web.php", startLine: 56,
      lang: "php", difficulte: "cle",
      role: "Groupe de routes admin imbriqué dans le groupe auth, protégé par le middleware admin.",
      oral: "Les routes admin sont dans un double filtre : d'abord 'auth' (connecté), puis 'admin' (rôle admin). C'est de la défense en profondeur.",
      lignes: [
        { code: "Route::middleware('admin')->group(function () {", exp: "⭐ Applique le middleware 'admin' à tout le groupe (déjà à l'intérieur du groupe 'auth')." },
        { code: "    Route::get('/admin', [AdminController::class, 'indexAll'])->name('admin');", exp: "Tableau de bord admin." },
        { code: "    Route::put('/admin/utilisateurs/{user}', [AdminController::class, 'updateUser'])->name('users.updateAdmin');", exp: "Modifier le rôle/statut d'un utilisateur (PUT)." }
      ]
    },
    {
      couche: "Middleware", dossier: "src/app/Http/Middleware", fichier: "AdminMiddleware.php", startLine: 11,
      lang: "php", difficulte: "cle",
      role: "Filtre exécuté AVANT le contrôleur : bloque quiconque n'est pas admin.",
      oral: "Un middleware est un filtre placé entre la requête et le contrôleur. handle() laisse passer ($next) seulement si l'utilisateur est admin, sinon abort(403).",
      lignes: [
        { code: "public function handle(Request $request, Closure $next): Response", exp: "⭐ handle reçoit la requête et $next (la suite du traitement). Closure = fonction anonyme." },
        { code: "    $user = auth()->user();", exp: "Utilisateur connecté." },
        { code: "    if (!$user || $user->role !== 'admin') {", exp: "⭐ Si non connecté OU rôle différent de 'admin' → on bloque." },
        { code: "        abort(403, 'Unauthorized');", exp: "⭐ abort(403) interrompt tout et renvoie « accès interdit »." },
        { code: "    return $next($request);", exp: "⭐ Sinon on passe la main au contrôleur (la requête continue)." }
      ]
    },
    {
      couche: "Configuration", dossier: "src/bootstrap", fichier: "app.php", startLine: 15,
      lang: "php", difficulte: "cle",
      role: "Enregistre les middlewares : l'alias 'admin' et le middleware global CheckUserActive.",
      oral: "Depuis Laravel 11, il n'y a plus de fichier Kernel : les middlewares se configurent dans bootstrap/app.php. On y crée l'alias 'admin' (utilisé dans les routes) et on ajoute CheckUserActive à toutes les requêtes web.",
      lignes: [
        { code: "->withMiddleware(function (Middleware $middleware) {", exp: "Bloc de configuration des middlewares (Laravel 11). Reçoit un objet $middleware." },
        { code: "    $middleware->alias(['admin' => AdminMiddleware::class]);", exp: "⭐ Crée l'alias 'admin' → AdminMiddleware. C'est ce nom court qu'on écrit dans les routes : ->middleware('admin'). => associe la clé à la valeur.", detail: "`$middleware` = l'objet de config. `->alias(` = méthode qui enregistre des raccourcis. `[` ouvre un tableau. `'admin'` = la clé (le nom court). `=>` = associe clé et valeur. `AdminMiddleware::class` = le nom complet de la classe (::class donne son chemin). `]` ferme le tableau. `)` fin d'appel. `;` fin." },
        { code: "    $middleware->web(append: [CheckUserActive::class]);", exp: "⭐ Ajoute CheckUserActive à la FIN de la pile du groupe 'web' : il s'exécute sur chaque page. append: = argument nommé (PHP 8).", detail: "`->web(` = configure le groupe de middlewares « web ». `append:` = nom d'argument (PHP 8) : « ajouter à la fin ». `[CheckUserActive::class]` = tableau contenant la classe à ajouter. `)` `;` fin." }
      ]
    },
    {
      couche: "Middleware", dossier: "src/app/Http/Middleware", fichier: "CheckUserActive.php", startLine: 17,
      lang: "php", difficulte: "cle",
      role: "Déconnecte immédiatement un utilisateur dont le compte a été désactivé par un admin.",
      oral: "Ce middleware s'exécute à chaque requête web. Si l'utilisateur connecté n'est plus actif (is_active = false, par exemple désactivé depuis la page admin), on le déconnecte et on le renvoie au login avec un message. C'est le pendant de la désactivation côté admin.",
      lignes: [
        { code: "public function handle(Request $request, Closure $next): Response", exp: "Signature standard d'un middleware : reçoit la requête et $next (la suite du traitement)." },
        { code: "if (Auth::check() && !Auth::user()->is_active) {", exp: "⭐ Auth::check() = un utilisateur est-il connecté ? && = ET. !Auth::user()->is_active = son compte est désactivé (! = négation).", detail: "`if (` = test conditionnel. `Auth::check()` = méthode statique : y a-t-il une session connectée ? (`::` = accès statique). `&&` = ET logique (les deux doivent être vrais). `!` = NON (inverse le booléen). `Auth::user()` = l'utilisateur connecté. `->is_active` = sa propriété « actif ». `)` `{` ouvre le bloc si vrai." },
        { code: "    Auth::logout();", exp: "Ferme la session d'authentification (déconnexion)." },
        { code: "    $request->session()->invalidate();", exp: "⭐ Invalide toute la session (efface les données de session)." },
        { code: "    $request->session()->regenerateToken();", exp: "Régénère le jeton CSRF après déconnexion (sécurité)." },
        { code: "    return redirect()->route('login')->with('error', 'Votre compte a été désactivé par un administrateur.');", exp: "⭐ Redirige vers la page de connexion avec un message flash d'erreur." },
        { code: "return $next($request);", exp: "⭐ Sinon (compte actif), la requête continue normalement vers la suite." }
      ]
    },
    {
      couche: "Contrôleur", dossier: "src/app/Http/Controllers", fichier: "AdminController.php", startLine: 21,
      lang: "php", difficulte: "cle",
      role: "updateUser() : modifie rôle et statut, en s'interdisant de se modifier soi-même.",
      oral: "updateUser() re-vérifie le rôle admin (défense en profondeur), empêche l'admin de changer son propre rôle/statut (pour ne pas se verrouiller), valide puis met à jour.",
      lignes: [
        { code: "if (!$admin || $admin->role !== 'admin') {", exp: "⭐ Deuxième contrôle du rôle (même si le middleware l'a déjà fait) : ceinture + bretelles." },
        { code: "if ($user->id === $admin->id) {", exp: "⭐ Empêche de se modifier soi-même (éviter de se retirer les droits par erreur)." },
        { code: "    return response()->json(['error' => 'Vous ne pouvez pas modifier votre propre rôle ou statut.'], 403);", exp: "Refus explicite." },
        { code: "$data = $request->validate([ 'role' => ['required', 'in:user,admin'], 'is_active' => ['required', 'boolean'], ]);", exp: "⭐ in:user,admin limite le rôle aux valeurs valides ; is_active doit être un booléen." },
        { code: "$user->update($data);", exp: "Applique les changements." }
      ]
    },
    {
      couche: "Vue (Blade)", dossier: "src/resources/views/admin", fichier: "dashbordadmin.blade.php", startLine: 143,
      lang: "js", difficulte: "cle",
      role: "Table des utilisateurs + modal d'édition qui envoie un PUT en fetch (avec spoofing de méthode).",
      oral: "La table liste les utilisateurs (échappés par Blade). Le modal envoie un fetch PUT avec le jeton CSRF. Un filtre client cache les lignes non correspondantes.",
      lignes: [
        { code: "onclick=\"openEditModal({{ $user->id }}, {{ json_encode($user->firstname . ' ' . $user->lastname) }}, {{ json_encode($user->email) }}, {{ json_encode($user->role) }}, {{ $user->is_active ? 'true' : 'false' }})\"", exp: "⭐ json_encode échappe proprement les valeurs pour les injecter en JS (protège contre l'injection dans l'attribut onclick)." },
        { code: "@method('PUT')", exp: "⭐ Directive Blade : ajoute un champ caché _method=PUT (les formulaires HTML ne connaissent que GET/POST : c'est le « method spoofing »)." },
        { code: "const response = await fetch(`/admin/utilisateurs/${userId}`, {", exp: "⭐ Gabarit de chaîne (backticks) : ${userId} insère l'identifiant dans l'URL." },
        { code: "    method: 'PUT',", exp: "Ici le fetch utilise directement le verbe PUT." },
        { code: "    headers: { ... 'X-CSRF-TOKEN': '{{ csrf_token() }}', 'Accept': 'application/json' },", exp: "Jeton CSRF obligatoire + on demande du JSON." },
        { code: "    body: JSON.stringify(data),", exp: "Envoie { role, is_active } en JSON." }
      ]
    }
  ],
  quiz: [
    { q: "Comment l'espace admin est-il protégé ?", r: "Double middleware : 'auth' puis 'admin' (AdminMiddleware vérifie role === 'admin', sinon abort 403)." },
    { q: "Pourquoi re-vérifier le rôle dans le contrôleur ?", r: "Défense en profondeur : ne pas dépendre uniquement du middleware." },
    { q: "Pourquoi l'admin ne peut-il pas se modifier lui-même ?", r: "Pour éviter de se retirer ses propres droits (verrouillage)." },
    { q: "C'est quoi @method('PUT') ?", r: "Le method spoofing : un champ caché _method=PUT car les <form> HTML ne gèrent que GET/POST." }
  ],
  examen: [
    { q: "Qu'est-ce qu'un middleware et où s'exécute-t-il ?", court: "Un filtre avant le contrôleur.", exp: "Le middleware intercepte la requête, effectue une vérification (ici le rôle admin) et décide de continuer ($next) ou d'interrompre (abort 403).", ref: "app/Http/Middleware/AdminMiddleware.php (11-18)" },
    { q: "Pourquoi json_encode dans l'attribut onclick ?", court: "Échapper et éviter l'injection.", exp: "Les données utilisateur (nom, email) sont converties en littéraux JS sûrs ; sans cela, un nom contenant une apostrophe ou du code casserait/injecterait du JS.", ref: "resources/views/admin/dashbordadmin.blade.php (60)" },
    { q: "Comment un <form> envoie-t-il un PUT ?", court: "Champ caché _method=PUT (@method).", exp: "HTML ne supporte que GET/POST ; Laravel lit _method pour router vers la bonne action. Ici le fetch peut aussi mettre directement method:'PUT'.", ref: "resources/views/admin/dashbordadmin.blade.php (86)" }
  ],
  limites: [
    { titre: "Autorisation dupliquée", souci: "Le rôle est vérifié dans le middleware ET le contrôleur.", correction: "C'est acceptable (défense en profondeur) mais on pourrait s'appuyer sur des Gates/Policies pour uniformiser." }
  ]
},

/* =====================================================================
   F7 — ABONNEMENTS (Stripe) & QUOTAS
   ===================================================================== */
{
  id: "abonnements",
  icone: "💳",
  titre: "Abonnements",
  sousTitre: "Stripe Checkout : passage Premium, retour Gratuit, quotas",
  resume: "L'utilisateur peut passer au plan Premium via Stripe Checkout (paiement récurrent). Après paiement confirmé, plan devient 'premium' et les quotas sautent. Les clés Stripe restent dans le .env.",
  mantra: "Vue (plans) → Route → Contrôleur (Session Stripe) → Stripe → callback success (paiement payé → plan=premium) → quotas levés.",
  etapes: [
    {
      couche: "Route", dossier: "src/routes", fichier: "web.php", startLine: 50,
      lang: "php", difficulte: "facile",
      role: "Routes du parcours d'abonnement (page, checkout, retours succès/annulation, downgrade).",
      oral: "index affiche les plans, checkout crée la session Stripe, success et cancel sont les URL de retour de Stripe, downgrade repasse en gratuit.",
      lignes: [
        { code: "Route::get('/abonnement', [SubscriptionController::class, 'index'])->name('subscription.index');", exp: "Page de comparaison des plans." },
        { code: "Route::post('/abonnement/checkout', [SubscriptionController::class, 'checkout'])->name('subscription.checkout');", exp: "⭐ Démarre le paiement (crée la session Stripe)." },
        { code: "Route::get('/abonnement/succes', [SubscriptionController::class, 'success'])->name('subscription.success');", exp: "URL de retour après paiement réussi." },
        { code: "Route::get('/abonnement/annule', [SubscriptionController::class, 'cancel'])->name('subscription.cancel');", exp: "URL de retour si l'utilisateur annule." },
        { code: "Route::post('/abonnement/gratuit', [SubscriptionController::class, 'downgrade'])->name('subscription.downgrade');", exp: "Repasser au plan gratuit." }
      ]
    },
    {
      couche: "Contrôleur", dossier: "src/app/Http/Controllers", fichier: "SubscriptionController.php", startLine: 21,
      lang: "php", difficulte: "cle",
      role: "checkout() : crée une session Stripe Checkout en mode abonnement et redirige vers Stripe.",
      oral: "checkout() lit les clés Stripe depuis la config (jamais en dur), refuse si non configuré, crée une session d'abonnement avec les URL de retour, puis redirige le navigateur vers l'URL Stripe.",
      lignes: [
        { code: "$secret = config('services.stripe.secret');", exp: "⭐ config() lit config/services.php qui lit le .env. Les secrets ne sont JAMAIS écrits dans le code." },
        { code: "if (empty($secret) || empty($price)) {", exp: "Si les clés manquent, on ne tente pas d'appeler Stripe." },
        { code: "Stripe::setApiKey($secret);", exp: "⭐ Authentifie la librairie Stripe avec la clé secrète." },
        { code: "$session = Session::create([", exp: "Crée une session de paiement hébergée par Stripe (Checkout)." },
        { code: "    'mode' => 'subscription',", exp: "⭐ Mode abonnement (paiement récurrent), pas paiement unique." },
        { code: "    'customer_email' => auth()->user()->email,", exp: "Pré-remplit l'email du client." },
        { code: "    'line_items' => [[ 'price' => $price, 'quantity' => 1, ]],", exp: "⭐ Le produit facturé = l'ID de prix Stripe (défini dans le .env)." },
        { code: "    'success_url' => route('subscription.success') . '?session_id={CHECKOUT_SESSION_ID}',", exp: "⭐ Stripe remplacera {CHECKOUT_SESSION_ID} par l'identifiant réel pour vérifier le paiement au retour." },
        { code: "return redirect($session->url);", exp: "Redirige le navigateur vers la page de paiement Stripe." }
      ]
    },
    {
      couche: "Contrôleur", dossier: "src/app/Http/Controllers", fichier: "SubscriptionController.php", startLine: 48,
      lang: "php", difficulte: "cle",
      role: "success() : vérifie le paiement côté Stripe avant de passer l'utilisateur en Premium.",
      oral: "Au retour, on ne fait pas confiance à l'URL : on récupère la session chez Stripe et on ne passe en Premium QUE si payment_status vaut 'paid'.",
      lignes: [
        { code: "$sessionId = $request->query('session_id');", exp: "Récupère l'identifiant de session renvoyé par Stripe." },
        { code: "$session = Session::retrieve($sessionId);", exp: "⭐ Interroge Stripe pour connaître le vrai statut (source de vérité = Stripe, pas l'URL)." },
        { code: "if ($session->payment_status === 'paid') {", exp: "⭐ On vérifie que le paiement est réellement effectué." },
        { code: "    auth()->user()->update(['plan' => 'premium']);", exp: "⭐ Passe l'utilisateur en Premium (les quotas ne s'appliquent plus)." },
        { code: "} catch (\\Exception $e) {", exp: "try/catch : si l'appel Stripe échoue, on gère l'erreur proprement." }
      ]
    },
    {
      couche: "Configuration", dossier: "src/config", fichier: "services.php", startLine: 26,
      lang: "php", difficulte: "cle",
      role: "Expose les clés Stripe depuis les variables d'environnement.",
      oral: "Les identifiants Stripe sont lus via env() : ils vivent dans le .env (non versionné), pas dans le code source. C'est une exigence de sécurité de l'énoncé.",
      lignes: [
        { code: "'stripe' => [", exp: "Section de configuration Stripe." },
        { code: "    'key' => env('STRIPE_KEY'),", exp: "⭐ env('STRIPE_KEY') lit la variable d'environnement (clé publique)." },
        { code: "    'secret' => env('STRIPE_SECRET'),", exp: "⭐ Clé secrète : jamais en clair dans le dépôt Git." },
        { code: "    'price' => env('STRIPE_PRICE_ID'),", exp: "Identifiant du prix/produit Stripe." }
      ]
    },
    {
      couche: "Migration / Quotas", dossier: "src/database/migrations", fichier: "2026_06_20_000000_add_plan_to_users_table.php", startLine: 11,
      lang: "php", difficulte: "facile",
      role: "Ajoute la colonne plan (free/premium) qui commande tous les quotas.",
      oral: "Cette migration ajoute la colonne plan. isPremium() la lit, et chaque contrôleur (comptes, dépenses, revenus) l'utilise pour appliquer les limites du plan gratuit.",
      lignes: [
        { code: "Schema::table('users', function (Blueprint $table) {", exp: "Schema::table = MODIFIER une table existante (pas la créer)." },
        { code: "    $table->enum('plan', ['free', 'premium'])->default('free')->after('role');", exp: "⭐ Ajoute plan (free par défaut), placé après la colonne role." },
        { code: "// Rappel — quotas appliqués : AccountController:54 (2), ExpenseController:62 (7), IncomeController:63 (2)", exp: "⭐ Les 3 quotas gratuits : 2 comptes, 7 dépenses/compte, 2 revenus/compte." }
      ]
    },
    {
      couche: "Vue (Blade)", dossier: "src/resources/views/subscription", fichier: "index.blade.php", startLine: 40,
      lang: "blade", difficulte: "facile",
      role: "Affiche les deux plans et le bon bouton selon le plan actuel.",
      oral: "La vue montre Gratuit et Premium. Selon isPremium(), on affiche « Passer Premium » (POST checkout) ou « Revenir au gratuit » (POST downgrade).",
      lignes: [
        { code: "<li>✓ {{ $limits['accounts'] }} comptes maximum</li>", exp: "⭐ Les limites viennent du contrôleur : ['accounts'=>2,'expenses'=>7,'incomes'=>2]." },
        { code: "@if($user->isPremium())", exp: "Affiche un bouton différent si déjà premium." },
        { code: "    <form method=\"POST\" action=\"{{ route('subscription.downgrade') }}\">", exp: "Formulaire pour repasser gratuit." },
        { code: "<form method=\"POST\" action=\"{{ route('subscription.checkout') }}\">", exp: "⭐ Le bouton « Passer Premium » lance le checkout Stripe." }
      ]
    }
  ],
  quiz: [
    { q: "Où sont stockées les clés Stripe ?", r: "Dans le .env, lues via env() dans config/services.php ; jamais dans le code." },
    { q: "Comment confirme-t-on un paiement ?", r: "success() interroge Stripe (Session::retrieve) et vérifie payment_status === 'paid'." },
    { q: "Quels sont les quotas du plan gratuit ?", r: "2 comptes, 7 dépenses par compte, 2 revenus par compte." },
    { q: "Quel mode Stripe est utilisé ?", r: "'subscription' (abonnement récurrent)." }
  ],
  examen: [
    { q: "Pourquoi vérifier le paiement côté serveur et pas via l'URL ?", court: "L'URL est falsifiable.", exp: "Un utilisateur pourrait appeler /abonnement/succes à la main. On interroge donc Stripe (Session::retrieve) pour connaître le vrai payment_status avant de passer Premium.", ref: "app/Http/Controllers/SubscriptionController.php (55-57)" },
    { q: "Comment les secrets restent-ils hors du code ?", court: "Variables d'environnement (.env).", exp: "config/services.php lit env('STRIPE_SECRET'). Le .env n'est pas versionné (seul .env.example l'est, vide). Exigence de sécurité de l'énoncé.", ref: "config/services.php (26-30)" },
    { q: "Où sont réellement appliqués les quotas ?", court: "Dans store() de chaque contrôleur.", exp: "AccountController (2), ExpenseController (7), IncomeController (2) testent !isPremium() && count>=limite → 403. La colonne plan pilote isPremium().", ref: "app/Http/Controllers/AccountController.php (54)" }
  ],
  limites: [
    { titre: "Pas de webhook Stripe", souci: "Le passage Premium dépend du retour navigateur ; si l'utilisateur ferme l'onglet, la mise à jour peut manquer. Pas de gestion de fin d'abonnement.", correction: "Écouter les webhooks Stripe (checkout.session.completed, invoice.paid, customer.subscription.deleted) pour synchroniser le plan de façon fiable." }
  ]
},

/* =====================================================================
   F8 — PARTAGE DE COMPTES (invitation email, lecture seule)
   ===================================================================== */
{
  id: "partage",
  icone: "🤝",
  titre: "Partage",
  sousTitre: "Inviter par email à consulter un compte en lecture seule",
  resume: "Un propriétaire invite une adresse email à voir un compte (et ses revenus/dépenses/prévisions) en LECTURE SEULE. L'invité reçoit un lien, l'accepte en étant connecté avec cette adresse, puis apparaît dans « comptes partagés avec moi ». Le propriétaire peut révoquer l'accès à tout moment.",
  mantra: "Propriétaire invite (email + jeton) → Mail → l'invité clique et accepte (on vérifie son identité) → relation N-N acceptée → CRUD en lecture seule via isAccessibleBy → révocation = statut revoked (accès coupé).",
  etapes: [
    {
      couche: "Route", dossier: "src/routes", fichier: "web.php", startLine: 37,
      lang: "php", difficulte: "facile",
      role: "Routes du partage : liste reçue, acceptation par lien, envoi et révocation d'invitation.",
      oral: "Deux routes générales (la liste des comptes qu'on m'a partagés et l'acceptation via le lien email) et deux routes imbriquées sous un compte (inviter, révoquer).",
      lignes: [
        { code: "Route::get('/comptes/partages', [AccountShareController::class, 'shared'])->name('accounts.shared');", exp: "⭐ Liste des comptes qu'on m'a partagés (lecture seule)." },
        { code: "Route::get('/partages/accepter', [AccountShareController::class, 'accept'])->name('shares.accept');", exp: "⭐ Cible du lien reçu par email (?email=&token=) pour accepter l'invitation." },
        { code: "Route::post('/comptes/{account}/partages', [AccountShareController::class, 'store'])->name('accounts.shares.store');", exp: "Le propriétaire envoie une invitation (POST)." },
        { code: "Route::delete('/comptes/{account}/partages/{share}', [AccountShareController::class, 'destroy'])->name('accounts.shares.destroy');", exp: "⭐ Révoque un partage précis : deux paramètres, {account} et {share}." }
      ]
    },
    {
      couche: "Migration / BDD", dossier: "src/database/migrations", fichier: "2026_07_14_000000_create_account_shares_table.php", startLine: 14,
      lang: "php", difficulte: "cle",
      role: "Table pivot qui relie un compte à un invité (email), avec un statut et un jeton.",
      oral: "account_shares est la table du partage. Elle relie un compte (account_id) et l'utilisateur invité (user_id, rempli seulement à l'acceptation). L'email permet d'inviter quelqu'un même s'il n'a pas encore de compte Budgie.",
      lignes: [
        { code: "$table->unsignedBigInteger('account_id');", exp: "Compte partagé." },
        { code: "$table->string('email');", exp: "⭐ Email de l'invité : on peut inviter avant même qu'il ait un compte." },
        { code: "$table->unsignedBigInteger('user_id')->nullable();", exp: "⭐ Rempli uniquement à l'acceptation (nullable au départ)." },
        { code: "$table->string('token', 64)->nullable();", exp: "Jeton d'invitation (effacé après acceptation ou révocation)." },
        { code: "$table->string('status', 20)->default('pending');", exp: "⭐ Statut : pending (en attente), accepted (accepté), revoked (révoqué)." },
        { code: "$table->timestamp('accepted_at')->nullable();", exp: "Date/heure d'acceptation." },
        { code: "$table->foreign('account_id')->references('id')->on('accounts')->onDelete('cascade');", exp: "Supprimer le compte supprime ses partages." },
        { code: "$table->foreign('user_id')->references('id')->on('users')->onDelete('set null');", exp: "⭐ onDelete('set null') : si l'invité supprime son compte, la ligne reste mais user_id repasse à null (pas de cascade)." }
      ]
    },
    {
      couche: "Modèle", dossier: "src/app/Models", fichier: "AccountShare.php", startLine: 12,
      lang: "php", difficulte: "cle",
      role: "Modèle du partage : constantes de statut, champs remplissables, cast de date, relations.",
      oral: "Les statuts sont des constantes de classe (const) : plus sûr que des chaînes écrites en dur, car réutilisées partout et vérifiées par l'éditeur.",
      lignes: [
        { code: "public const STATUS_PENDING = 'pending';", exp: "⭐ const = constante de classe. On écrit AccountShare::STATUS_PENDING au lieu de 'pending' partout (moins d'erreurs de frappe)." },
        { code: "public const STATUS_ACCEPTED = 'accepted';", exp: "Statut « accepté »." },
        { code: "public const STATUS_REVOKED = 'revoked';", exp: "Statut « révoqué »." },
        { code: "protected $fillable = ['account_id','email','user_id','token','status','accepted_at'];", exp: "Colonnes remplissables en masse (liste blanche)." },
        { code: "protected $casts = ['accepted_at' => 'datetime'];", exp: "accepted_at convertie en objet date/heure (Carbon)." },
        { code: "public function account() { return $this->belongsTo(Account::class); }", exp: "Un partage appartient à un compte." },
        { code: "public function user() { return $this->belongsTo(User::class); }", exp: "…et (une fois accepté) à l'utilisateur invité." }
      ]
    },
    {
      couche: "Modèle", dossier: "src/app/Models", fichier: "Account.php", startLine: 47,
      lang: "php", difficulte: "piege",
      role: "Règles d'accès du compte : propriétaire vs invité (lecture seule).",
      oral: "isOwnedBy dit si je suis le propriétaire ; isAccessibleBy dit si je peux VOIR le compte (propriétaire OU partage accepté). Ces méthodes remplacent l'ancien test user_id !== id dans show(), l'index des dépenses et les prévisions.",
      lignes: [
        { code: "public function shares() { return $this->hasMany(AccountShare::class); }", exp: "Un compte a plusieurs partages." },
        { code: "public function isOwnedBy(?User $user): bool", exp: "⭐ ?User = paramètre pouvant valoir null (nullable). : bool = retourne vrai/faux." },
        { code: "    return $user !== null && $this->user_id === $user->id;", exp: "Vrai seulement si je suis le propriétaire du compte." },
        { code: "public function isAccessibleBy(?User $user): bool", exp: "⭐ Droit de LECTURE : propriétaire OU invité accepté." },
        { code: "    if ($this->isOwnedBy($user)) { return true; }", exp: "Le propriétaire a toujours accès." },
        { code: "    return $this->shares()->where('user_id', $user->id)->where('status', AccountShare::STATUS_ACCEPTED)->exists();", exp: "⭐⭐ exists() = requête booléenne : existe-t-il un partage ACCEPTÉ pour cet utilisateur ? Si oui → accès lecture seule." }
      ]
    },
    {
      couche: "Modèle", dossier: "src/app/Models", fichier: "User.php", startLine: 48,
      lang: "php", difficulte: "piege",
      role: "Relation many-to-many : les comptes partagés avec l'utilisateur.",
      oral: "Côté utilisateur, sharedAccounts est une relation plusieurs-à-plusieurs (belongsToMany) qui passe par la table pivot account_shares et ne garde que les partages acceptés.",
      lignes: [
        { code: "public function sharedAccounts()", exp: "Les comptes partagés avec moi (lecture seule)." },
        { code: "    return $this->belongsToMany(Account::class, 'account_shares')", exp: "⭐⭐ belongsToMany = relation N-N (plusieurs-à-plusieurs) via la table pivot account_shares : un compte peut être partagé à plusieurs personnes, une personne peut recevoir plusieurs comptes." },
        { code: "        ->wherePivot('status', AccountShare::STATUS_ACCEPTED);", exp: "⭐ wherePivot filtre sur une colonne de la table pivot : on ne garde que le statut « accepté »." }
      ]
    },
    {
      couche: "Contrôleur", dossier: "src/app/Http/Controllers", fichier: "AccountShareController.php", startLine: 30,
      lang: "php", difficulte: "cle",
      role: "store() : envoie une invitation (email + jeton) avec garde-fous anti-auto-partage et anti-doublon.",
      oral: "Le propriétaire saisit un email. On refuse de se partager le compte à soi-même, on refuse un doublon (invitation en attente ou déjà acceptée), on génère un jeton, on crée/actualise l'invitation et on envoie l'email.",
      lignes: [
        { code: "public function store(Request $request, Account $account)", exp: "Reçoit le compte (Route Model Binding) et la requête." },
        { code: "if (!$account->isOwnedBy($user)) {", exp: "⭐ Seul le propriétaire peut inviter (403 sinon)." },
        { code: "$data = $request->validate(['email' => ['required', 'email']]);", exp: "Valide l'adresse email invitée." },
        { code: "$email = strtolower($data['email']);", exp: "⭐ strtolower : on normalise en minuscules (les emails sont insensibles à la casse)." },
        { code: "if ($email === strtolower($user->email)) {", exp: "⭐ On refuse de se partager le compte à soi-même → 422 (donnée non traitable)." },
        { code: "$existing = AccountShare::where('account_id', $account->id)->where('email', $email)->whereIn('status', [AccountShare::STATUS_PENDING, AccountShare::STATUS_ACCEPTED])->first();", exp: "⭐ Cherche une invitation déjà en attente OU déjà acceptée pour cet email (anti-doublon). whereIn = statut dans la liste." },
        { code: "if ($existing) {", exp: "Si elle existe déjà → 422 (déjà partagé / invitation en attente)." },
        { code: "$token = bin2hex(random_bytes(32));", exp: "⭐ Jeton d'invitation cryptographique (64 caractères hexadécimaux, imprévisible)." },
        { code: "$share = AccountShare::updateOrCreate(", exp: "⭐ updateOrCreate : met à jour la ligne si (account_id + email) existe, sinon la crée. Permet de relancer une invitation révoquée." },
        { code: "    ['account_id' => $account->id, 'email' => $email],", exp: "Critères de recherche de la ligne." },
        { code: "    ['user_id' => null, 'token' => $token, 'status' => AccountShare::STATUS_PENDING, 'accepted_at' => null]", exp: "Valeurs écrites : on (re)met le statut « en attente » avec un nouveau jeton." },
        { code: "shareAccountMail($email, $account->name, trim($user->firstname . ' ' . $user->lastname), $token);", exp: "⭐ Envoie l'email d'invitation (email + nom du compte + nom du propriétaire + jeton). trim() enlève les espaces superflus, . concatène." },
        { code: "return response()->json($share, 201);", exp: "201 = créé." }
      ]
    },
    {
      couche: "Contrôleur", dossier: "src/app/Http/Controllers", fichier: "AccountShareController.php", startLine: 94,
      lang: "php", difficulte: "piege",
      role: "accept() : valide le lien reçu par email et lie l'invité au compte.",
      oral: "On lit email + token depuis le lien, on cherche une invitation en attente correspondante. Point clé de sécurité : il faut être connecté AVEC l'adresse invitée pour accepter, sinon on refuse.",
      lignes: [
        { code: "public function accept(Request $request)", exp: "Page atteinte via le lien de l'email." },
        { code: "$email = $request->query('email');", exp: "Email depuis l'URL (?email=)." },
        { code: "$token = $request->query('token');", exp: "Jeton depuis l'URL (&token=)." },
        { code: "$share = AccountShare::where('email', strtolower($email))->where('token', $token)->where('status', AccountShare::STATUS_PENDING)->first();", exp: "⭐ Cherche une invitation EN ATTENTE qui correspond exactement à l'email ET au jeton." },
        { code: "if (!$share) { return view('accounts.share-failed'); }", exp: "Lien invalide / expiré / déjà utilisé → page d'échec." },
        { code: "if (strtolower($user->email) !== strtolower($email)) {", exp: "⭐⭐ Sécurité : on doit être connecté avec l'email invité. Impossible d'accepter un partage à la place de quelqu'un d'autre." },
        { code: "$share->update(['user_id' => $user->id, 'status' => AccountShare::STATUS_ACCEPTED, 'accepted_at' => now(), 'token' => null]);", exp: "⭐ On lie l'invité (user_id), passe à « accepté », horodate, et efface le jeton (usage unique)." },
        { code: "return view('accounts.share-accepted', ['account' => $share->account]);", exp: "Page de confirmation avec le nom du compte." }
      ]
    },
    {
      couche: "Contrôleur", dossier: "src/app/Http/Controllers", fichier: "AccountShareController.php", startLine: 15,
      lang: "php", difficulte: "facile",
      role: "shared() liste mes comptes partagés ; destroy() révoque un partage (accès coupé immédiatement).",
      oral: "shared() utilise la relation N-N sharedAccounts. destroy() passe le statut à revoked et efface le jeton : grâce à isAccessibleBy, l'invité perd l'accès instantanément.",
      lignes: [
        { code: "$accounts = $user->sharedAccounts()->orderBy('name')->get();", exp: "⭐ Relation many-to-many : uniquement les partages acceptés (wherePivot)." },
        { code: "return view('accounts.shared', ['accounts' => $accounts]);", exp: "Vue « comptes partagés avec moi » (lecture seule)." },
        { code: "public function destroy(Account $account, AccountShare $share)", exp: "Révocation d'un partage précis." },
        { code: "if (!$account->isOwnedBy($user) || $share->account_id !== $account->id) {", exp: "⭐ Seul le propriétaire ; et le partage doit bien appartenir à ce compte (évite les incohérences d'URL)." },
        { code: "$share->update(['status' => AccountShare::STATUS_REVOKED, 'token' => null]);", exp: "⭐ Statut « révoqué » → isAccessibleBy renverra faux → accès coupé immédiatement." },
        { code: "return response()->json(null, 204);", exp: "204 = succès sans contenu." }
      ]
    },
    {
      couche: "Mail", dossier: "src/app/Mail", fichier: "WelcomeMail.php", startLine: 42,
      lang: "php", difficulte: "facile",
      role: "shareAccountMail() : email d'invitation contenant le lien d'acceptation, en SMTP authentifié.",
      oral: "Même mécanique que l'email d'inscription : PHPMailer en SMTP authentifié et chiffré (STARTTLS), toute la config venant du .env. Le lien pointe vers /partages/accepter avec l'email et le jeton.",
      lignes: [
        { code: "function shareAccountMail($sendTo, $accountName, $ownerName, $token)", exp: "4 paramètres : destinataire, nom du compte, nom du propriétaire, jeton." },
        { code: "$mail->Host = env('MAIL_HOST', 'smtp.resend.com');", exp: "Serveur SMTP lu dans le .env (comme l'email d'inscription)." },
        { code: "$mail->SMTPAuth = true;", exp: "⭐ Authentification SMTP activée (Username/Password depuis le .env)." },
        { code: "$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;", exp: "⭐ Connexion chiffrée en STARTTLS." },
        { code: "$appUrl = env('APP_URL', 'https://my-budgie.fr');", exp: "URL publique (HTTPS) lue dans le .env." },
        { code: "$link = $appUrl . \"/partages/accepter?email=\" . urlencode($sendTo) . \"&token=\" . urlencode($token);", exp: "⭐ Construit le lien d'acceptation. . = concaténation. urlencode protège les caractères spéciaux dans l'URL." },
        { code: "$body = \"Bonjour,<br>$ownerName souhaite partager avec vous la visibilité (lecture seule) de son compte <strong>$accountName</strong> sur Budgie.<br>...<a href='$link'>Accepter le partage</a>...\";", exp: "⭐ Corps HTML : les variables PHP ($ownerName, $accountName, $link) sont interpolées car la chaîne est en guillemets doubles." },
        { code: "$mail->Subject = 'Invitation à partager un compte Budgie';", exp: "Sujet de l'email." },
        { code: "$mail->addAddress($sendTo);", exp: "Destinataire = l'invité." },
        { code: "$mail->send();", exp: "Envoi via SMTP authentifié." }
      ]
    },
    {
      couche: "Vue (Blade)", dossier: "src/resources/views/accounts", fichier: "show.blade.php", startLine: 141,
      lang: "blade", difficulte: "cle",
      role: "Bloc de partage réservé au propriétaire (inviter/révoquer en fetch) ; badge « lecture seule » pour l'invité.",
      oral: "Le bloc de partage n'apparaît que pour le propriétaire (@if($is_owner)). L'invité, lui, voit un badge « lecture seule » et n'a pas les boutons Modifier/Supprimer. L'invitation et la révocation se font en fetch avec le jeton CSRF.",
      lignes: [
        { code: "@if($is_owner)", exp: "⭐ Le bloc « Partage » et les boutons d'écriture ne sont rendus que pour le propriétaire." },
        { code: "<form id=\"form-share-account\" class=\"flex items-end gap-3 mb-6\">", exp: "Formulaire d'invitation." },
        { code: "    <x-input label=\"Adresse email à inviter\" name=\"email\" type=\"email\" required ... />", exp: "Champ email de la personne à inviter." },
        { code: "@forelse($shares as $share)", exp: "Liste des partages existants (visible du propriétaire uniquement)." },
        { code: "    @if($share->status === 'accepted') <span class=\"text-budgie-success\">Accès actif</span>", exp: "⭐ Affiche « Accès actif » si accepté, sinon « Invitation en attente »." },
        { code: "<button onclick=\"revokeShare({{ $share->id }})\" ...>Révoquer</button>", exp: "Bouton de révocation, appelle la fonction JS avec l'id du partage." },
        { code: "@else <span class=\"... bg-budgie-accent/20 ...\">Partagé avec vous · lecture seule</span>", exp: "⭐ Côté invité : simple badge « lecture seule » (aucun bouton d'écriture)." },
        { code: "const response = await fetch('{{ route(\"accounts.shares.store\", $account->id) }}', { method: 'POST', ... });", exp: "⭐ Envoie l'invitation en JSON (en-tête X-CSRF-TOKEN inclus)." },
        { code: "const response = await fetch(`/comptes/{{ $account->id }}/partages/${shareId}`, { method: 'DELETE', ... });", exp: "⭐ Révoque via DELETE ; gabarit de chaîne (backticks) pour insérer l'id du partage." }
      ]
    }
  ],
  quiz: [
    { q: "Comment invite-t-on quelqu'un à un compte ?", r: "store() : par email, avec un jeton, un mail d'invitation, statut pending (updateOrCreate)." },
    { q: "Comment garantit-on que seul l'invité accepte ?", r: "accept() vérifie qu'on est connecté avec l'email invité (strtolower comparés) et que le jeton correspond à une invitation pending." },
    { q: "Comment l'accès en lecture seule est-il imposé ?", r: "isAccessibleBy() (propriétaire OU partage accepté) est vérifié dans show/index/prévisions ; aucune route d'écriture n'est ouverte à l'invité." },
    { q: "Quelle relation Eloquent modélise « comptes partagés avec moi » ?", r: "belongsToMany(Account, 'account_shares')->wherePivot('status','accepted') : une relation N-N via table pivot." },
    { q: "Que se passe-t-il à la révocation ?", r: "destroy() met status=revoked et token=null ; isAccessibleBy renvoie alors faux → accès coupé immédiatement." }
  ],
  examen: [
    { q: "Pourquoi une table pivot account_shares plutôt qu'une colonne sur accounts ?", court: "Un compte peut être partagé à plusieurs personnes (N-N).", exp: "Une relation plusieurs-à-plusieurs (un compte ↔ plusieurs invités, un invité ↔ plusieurs comptes) exige une table de liaison. Elle porte aussi l'email, le jeton et le statut de chaque invitation.", ref: "database/migrations/..._create_account_shares_table.php, User::sharedAccounts()" },
    { q: "Comment empêchez-vous d'accepter un partage à la place d'autrui ?", court: "On compare l'email connecté à l'email invité.", exp: "accept() refuse (share-failed) si strtolower(user->email) !== strtolower(email) : il faut être authentifié avec l'adresse exacte qui a été invitée.", ref: "app/Http/Controllers/AccountShareController.php (113-117)" },
    { q: "Pourquoi le jeton est-il effacé après acceptation ?", court: "Usage unique.", exp: "token=null après acceptation (et après révocation) : le lien ne peut pas être rejoué. Le jeton est un aléa cryptographique (bin2hex(random_bytes(32))).", ref: "app/Http/Controllers/AccountShareController.php (56, 123)" },
    { q: "L'invité peut-il modifier des données ?", court: "Non, lecture seule.", exp: "store/update/destroy des comptes/dépenses/revenus vérifient user_id (propriétaire). Seules les méthodes de lecture utilisent isAccessibleBy. L'invité n'a donc aucun droit d'écriture.", ref: "app/Models/Account.php (isAccessibleBy vs user_id checks)" },
    { q: "Que signifie onDelete('set null') sur user_id ?", court: "Le partage survit à la suppression de l'invité.", exp: "Si l'utilisateur invité supprime son compte, la ligne de partage reste mais user_id repasse à null (au lieu d'être supprimée en cascade).", ref: "migration account_shares (foreign user_id)" }
  ],
  limites: [
    { titre: "Jeton d'invitation sans expiration", souci: "Le jeton pending reste valide tant que l'invitation n'est ni acceptée ni révoquée (pas de date limite).", correction: "Ajouter une expiration (ex : expires_at) et refuser l'acceptation au-delà." },
    { titre: "Pas de notification à la révocation", souci: "L'invité n'est pas prévenu quand son accès est coupé.", correction: "Envoyer un email d'information lors de la révocation, ou afficher un message." }
  ]
},

/* =====================================================================
   F9 — ACCUEIL / TABLEAU DE BORD
   ===================================================================== */
{
  id: "accueil",
  icone: "🏠",
  titre: "Accueil",
  sousTitre: "Tableau de bord : solde total, cash vs investi, prévision 2035",
  resume: "La page d'accueil (protégée par auth) synthétise les comptes : solde total, répartition cash (non rémunéré) / investi (rémunéré), derniers mouvements et une projection du patrimoine au 31/12/2035.",
  mantra: "Route (/ auth) → HomeController (agrège comptes + mouvements + projette 2035) → Vue home (dans le layout commun).",
  etapes: [
    {
      couche: "Contrôleur", dossier: "src/app/Http/Controllers", fichier: "HomeController.php", startLine: 13,
      lang: "php", difficulte: "cle",
      role: "index() : agrège tous les comptes, sépare cash/investi, liste les 4 derniers mouvements et projette 2035.",
      oral: "index() parcourt les comptes pour calculer le solde total et le répartir en cash (taux 0) ou investi (taux > 0). Il fusionne revenus et dépenses pour les 4 derniers mouvements, puis projette chaque compte au 31/12/2035 via le service.",
      lignes: [
        { code: "public function index(PrevisionService $service)", exp: "⭐ Le service de prévision est injecté automatiquement (injection de dépendance)." },
        { code: "$balance = (float) Income::where('account_id', $account->id)->sum('amount')", exp: "Somme des revenus du compte..." },
        { code: "         - (float) Expense::where('account_id', $account->id)->sum('amount');", exp: "...moins la somme des dépenses = solde du compte." },
        { code: "if ((float) $account->rate_remuneration > 0) {", exp: "⭐ Taux > 0 → compte rémunéré (investi) ; sinon cash." },
        { code: "    $investi += $balance;", exp: "Cumule la part investie." },
        { code: "$movements = $incomes->concat($expenses)->sortByDesc(fn($m) => $m['date'])->take(4)->values();", exp: "⭐ concat fusionne revenus et dépenses, sortByDesc trie par date, take(4) garde les 4 plus récents. fn() => = fonction fléchée." },
        { code: "$dateCible = Carbon::create(2035, 12, 1);", exp: "Date de projection : décembre 2035." },
        { code: "    $previsionTotal += $service->projectAccount($account, $dateCible)['total_final'];", exp: "⭐ Additionne le solde net projeté de chaque compte (réutilise le PrevisionService)." }
      ]
    },
    {
      couche: "Vue (Layout)", dossier: "src/resources/views/layouts", fichier: "app.blade.php", startLine: 47,
      lang: "blade", difficulte: "facile",
      role: "Gabarit commun : navigation, lien admin conditionnel, bouton déconnexion (CSRF).",
      oral: "Toutes les pages étendent ce layout via @extends. La navigation affiche le lien Admin uniquement pour les admins, et @yield('content') insère le contenu de chaque page.",
      lignes: [
        { code: "@auth", exp: "⭐ Directive Blade : bloc affiché seulement si un utilisateur est connecté." },
        { code: "    @if(auth()->user()->role === 'admin')", exp: "Le lien Admin n'apparaît que pour les administrateurs." },
        { code: "<form method=\"POST\" action=\"{{ route('logout') }}\" class=\"inline\">", exp: "La déconnexion est un POST (action qui change l'état)." },
        { code: "    @csrf", exp: "⭐ Jeton anti-CSRF même pour la déconnexion." },
        { code: "<main class=\"max-w-7xl mx-auto px-6 py-8\">", exp: "Conteneur principal." },
        { code: "    @yield('content')", exp: "⭐ @yield insère ici le contenu défini par @section('content') de chaque page." }
      ]
    }
  ],
  quiz: [
    { q: "Comment distingue-t-on cash et investi ?", r: "rate_remuneration > 0 → investi (rémunéré) ; sinon cash." },
    { q: "Quelle date de projection utilise l'accueil ?", r: "31/12/2035 (Carbon::create(2035, 12, 1)), via le PrevisionService." },
    { q: "À quoi sert @yield('content') ?", r: "À insérer le contenu spécifique de chaque page dans le layout commun." }
  ],
  examen: [
    { q: "Comment le tableau de bord réutilise-t-il la logique de prévision ?", court: "Il injecte et appelle PrevisionService.", exp: "index() reçoit PrevisionService par injection et appelle projectAccount pour 2035 : la même logique sert l'accueil et la page Prévisions (pas de duplication).", ref: "app/Http/Controllers/HomeController.php (48)" },
    { q: "Comment fonctionne l'héritage de gabarit Blade ?", court: "@extends + @section / @yield.", exp: "Une page fait @extends('layouts.app') et remplit @section('content') ; le layout place ce contenu via @yield('content').", ref: "resources/views/layouts/app.blade.php (78)" }
  ],
  limites: [
    { titre: "Requêtes multiples par compte", souci: "index() fait plusieurs sum() dans une boucle sur les comptes.", correction: "Regrouper via des agrégats groupés (groupBy account_id) pour réduire le nombre de requêtes." }
  ]
}

];

/* =====================================================================
   ARCHITECTURE GLOBALE (diagramme par couches)
   ===================================================================== */
const ARCHI = {
  mantra: "Le navigateur parle à Nginx ; Nginx transmet le PHP à PHP-FPM ; Laravel route la requête (Route → Contrôleur → Service/Modèle) ; Eloquent parle à MySQL ; Blade renvoie le HTML.",
  couches: [
    { nom: "Navigateur (client)", icone: "🌐", desc: "Envoie les requêtes HTTP, affiche le HTML/CSS et exécute le JavaScript (formulaires en fetch).", tech: "HTML, Tailwind CSS, JS vanilla" },
    { nom: "Serveur web — Nginx", icone: "🧭", desc: "Reçoit la requête sur le port 80. Sert les fichiers statiques, ou transmet le PHP à PHP-FPM (fastcgi_pass app:9000).", tech: "nginx:alpine, web_server/nginx.conf" },
    { nom: "PHP-FPM (application)", icone: "⚙️", desc: "Interprète le PHP dans un conteneur dédié. Point d'entrée public/index.php.", tech: "php:8.3-fpm, web_server/Dockerfile" },
    { nom: "Route", icone: "🚦", desc: "routes/web.php associe chaque URL (+ verbe HTTP) à une méthode de contrôleur, après passage des middlewares (auth, admin).", tech: "Illuminate Routing" },
    { nom: "Contrôleur", icone: "🎛️", desc: "Reçoit la requête (souvent déjà validée), applique les règles métier/autorisations, renvoie une vue ou du JSON.", tech: "app/Http/Controllers" },
    { nom: "Service", icone: "🧮", desc: "Logique métier isolée et réutilisable. Ici PrevisionService fait toute la simulation financière.", tech: "app/Services/PrevisionService.php" },
    { nom: "Modèle (Eloquent)", icone: "🧩", desc: "Représente une table et ses relations. Traduit les objets PHP en requêtes SQL paramétrées (anti-injection).", tech: "app/Models (User, Account, Income, Expense, Prevision)" },
    { nom: "Base de données", icone: "🗄️", desc: "MySQL 8 en production (SQLite en dev). Schéma défini par les migrations.", tech: "mysql:8.0, database/migrations" },
    { nom: "Vue (Blade)", icone: "🖼️", desc: "Gabarits HTML côté serveur. Échappement automatique (anti-XSS), composants réutilisables, layout commun.", tech: "resources/views" }
  ]
};

/* =====================================================================
   TECHNOLOGIES & MÉTHODES
   ===================================================================== */
const TECHNOS = [
  { nom: "Laravel 11", cat: "Framework", def: "Framework PHP MVC complet (routing, ORM, validation, sessions, sécurité).", pourquoi: "Productivité et sécurité par défaut (CSRF, hachage, requêtes paramétrées).", ou: "Tout le backend (src/)." },
  { nom: "PHP 8.2/8.3", cat: "Langage", def: "Langage serveur exécuté par PHP-FPM.", pourquoi: "Imposé par Laravel ; features modernes (match, types de retour).", ou: "composer.json (php ^8.2), Dockerfile (php:8.3-fpm)." },
  { nom: "Eloquent ORM", cat: "Persistance", def: "Mapping objet-relationnel : une classe = une table, des méthodes = des relations.", pourquoi: "Requêtes lisibles et paramétrées (protège des injections SQL).", ou: "app/Models/*." },
  { nom: "Blade", cat: "Vues", def: "Moteur de templates de Laravel avec directives (@if, @foreach, @csrf) et composants.", pourquoi: "Échappement XSS automatique, composants réutilisables, héritage de layout.", ou: "resources/views/*." },
  { nom: "Tailwind CSS", cat: "Front", def: "Framework CSS utilitaire (classes comme px-4, flex).", pourquoi: "Style rapide et cohérent, thème personnalisé budgie.", ou: "resources/css, tailwind.config.js." },
  { nom: "Vite", cat: "Build front", def: "Outil de bundling/hot-reload des assets CSS/JS.", pourquoi: "Compilation rapide, intégration @vite dans Blade.", ou: "vite.config.js, layout @vite([...])." },
  { nom: "Docker Compose", cat: "Infra", def: "Orchestrateur multi-conteneurs (app, web, mysql, phpmyadmin, mailhog).", pourquoi: "Environnement reproductible, séparation serveur web / serveur PHP (exigence énoncé).", ou: "docker-compose.yml." },
  { nom: "Nginx", cat: "Serveur web", def: "Serveur HTTP qui sert le statique et passe le PHP à PHP-FPM.", pourquoi: "Performant, standard en production ; dialogue FastCGI avec PHP.", ou: "web_server/nginx.conf." },
  { nom: "MySQL / SQLite", cat: "Base de données", def: "SGBD relationnel (MySQL en prod, SQLite en dev).", pourquoi: "MySQL robuste et conteneurisé ; SQLite pratique en local.", ou: "docker-compose.yml (mysql), .env (DB_CONNECTION)." },
  { nom: "Stripe", cat: "Paiement", def: "Fournisseur de paiement ; Checkout hébergé en mode abonnement.", pourquoi: "Monétisation sécurisée sans manipuler les cartes.", ou: "app/Http/Controllers/SubscriptionController.php, config/services.php." },
  { nom: "PHPMailer", cat: "Email", def: "Librairie d'envoi d'emails en SMTP.", pourquoi: "Contrôle fin du SMTP vers Mailhog (dev).", ou: "app/Mail/WelcomeMail.php." },
  { nom: "Middleware", cat: "Concept", def: "Filtre exécuté avant le contrôleur (auth, admin).", pourquoi: "Centralise les contrôles d'accès.", ou: "app/Http/Middleware/AdminMiddleware.php." },
  { nom: "Form Request", cat: "Concept", def: "Classe de validation + autorisation dédiée à une requête.", pourquoi: "Sépare la validation du contrôleur.", ou: "app/Http/Requests/Auth/*." },
  { nom: "Injection de dépendances", cat: "Concept", def: "Laravel fabrique et fournit les objets attendus en paramètre (Request, Service).", pourquoi: "Code découplé et testable.", ou: "HomeController(PrevisionService $service)." },
  { nom: "Route Model Binding", cat: "Concept", def: "Conversion automatique d'un {id} d'URL en objet modèle.", pourquoi: "Moins de code, moins d'erreurs.", ou: "show(Account $account)." },
  { nom: "CSRF / Sessions", cat: "Sécurité", def: "Jeton anti-falsification + authentification par session serveur.", pourquoi: "Protège les formulaires ; auth sans dépendance externe.", ou: "@csrf, session()->regenerate()." },
  { nom: "Relation N-N (belongsToMany + pivot)", cat: "Concept", def: "Relation plusieurs-à-plusieurs via une table de liaison (pivot) ; wherePivot filtre sur une colonne du pivot.", pourquoi: "Modéliser le partage : un compte ↔ plusieurs invités, un invité ↔ plusieurs comptes.", ou: "User::sharedAccounts(), table account_shares." },
  { nom: "Let's Encrypt / Certbot", cat: "Sécurité / Infra", def: "Autorité de certification gratuite + outil qui délivre et renouvelle automatiquement les certificats SSL (validation par challenge ACME).", pourquoi: "Fournir le HTTPS exigé, sans coût ni renouvellement manuel.", ou: "docker-compose.yml (certbot), nginx.conf (443, /.well-known/acme-challenge)." },
  { nom: "SMTP (Resend) + STARTTLS", cat: "Email", def: "Envoi d'emails via un vrai serveur SMTP authentifié et chiffré (STARTTLS = passage en TLS après connexion).", pourquoi: "Délivrer réellement les emails en production ; Mailhog ne sert qu'en local.", ou: "app/Mail/WelcomeMail.php (env MAIL_HOST/USERNAME/PASSWORD)." },
  { nom: "Build Docker multi-étapes", cat: "Infra", def: "Un Dockerfile avec plusieurs FROM : une étape construit (Node/Vite), une autre exécute (PHP-FPM) ; on ne copie que le résultat.", pourquoi: "Image finale plus légère, sans les outils de build.", ou: "web_server/Dockerfile (node:20-alpine → php:8.3-fpm)." },
  { nom: "Middleware global (CheckUserActive)", cat: "Concept", def: "Middleware ajouté au groupe web, exécuté à chaque requête (pas seulement sur certaines routes).", pourquoi: "Couper l'accès en temps réel à un compte désactivé.", ou: "bootstrap/app.php (web append), CheckUserActive.php." }
];

/* =====================================================================
   MODÈLE DE DONNÉES (reconstruit depuis les migrations)
   ===================================================================== */
const DONNEES = {
  intro: "Relations : un User possède plusieurs Accounts ; un Account possède plusieurs Incomes, Expenses et Previsions. Le partage ajoute une relation N-N entre users et accounts via la table pivot account_shares. Clés étrangères en cascade (sauf user_id du partage : set null).",
  relations: "users 1─N accounts 1─N { incomes, expenses, previsions }   +   users N─N accounts (via account_shares)",
  tables: [
    { nom: "users", colonnes: [
      "id — PK auto-incrément",
      "firstname / lastname — string nullable",
      "date_of_birth — date nullable",
      "numero_phone — string(20) nullable",
      "email — string(60) UNIQUE",
      "password — string(255) (haché bcrypt)",
      "role — enum(admin,user) défaut user",
      "plan — enum(free,premium) défaut free (migration séparée)",
      "token / verification_token — string(64) nullable",
      "is_active — boolean défaut false",
      "created_at / updated_at"
    ]},
    { nom: "accounts", colonnes: [
      "id — PK",
      "name — string(100)",
      "description — text nullable",
      "balance — decimal(14,2) défaut 0 (non utilisée pour le calcul)",
      "rate_remuneration — decimal(5,2) défaut 0 (taux annuel)",
      "rate_imposition — decimal(5,2) défaut 0",
      "user_id — FK → users(id) ON DELETE CASCADE"
    ]},
    { nom: "incomes / expenses (structure identique)", colonnes: [
      "id — PK",
      "name — string(100)",
      "description — text nullable",
      "recurring — boolean défaut false",
      "value_recurring — enum(MONTHLY,WEEKLY,YEARLY) nullable",
      "amount — decimal(14,2)",
      "date_start — date",
      "date_end — date nullable",
      "account_id — FK → accounts(id) ON DELETE CASCADE"
    ]},
    { nom: "previsions", colonnes: [
      "id — PK",
      "date_prevision — date",
      "total_income / total_expense / total_interest / total_final — decimal(14,2)",
      "account_id — FK → accounts(id)"
    ]},
    { nom: "account_shares (partage — table pivot)", colonnes: [
      "id — PK",
      "account_id — FK → accounts(id) ON DELETE CASCADE",
      "email — string (adresse invitée)",
      "user_id — FK → users(id) ON DELETE SET NULL, nullable (rempli à l'acceptation)",
      "token — string(64) nullable (jeton d'invitation, usage unique)",
      "status — string(20) défaut 'pending' (pending / accepted / revoked)",
      "accepted_at — timestamp nullable",
      "timestamps"
    ]}
  ]
};

/* =====================================================================
   SÉCURITÉ (exigence de l'énoncé)
   ===================================================================== */
const SECURITE = [
  { titre: "Protection CSRF", desc: "Chaque formulaire POST/PUT/DELETE inclut @csrf (jeton). Les fetch envoient X-CSRF-TOKEN. Sans jeton → erreur 419.", ref: "layouts/app.blade.php (61), accounts/index.blade.php (152)" },
  { titre: "Anti-XSS (échappement Blade)", desc: "{{ $var }} échappe le HTML automatiquement ; json_encode sécurise les valeurs injectées en JS.", ref: "register.blade.php, admin/dashbordadmin.blade.php (60)" },
  { titre: "Anti-injection SQL", desc: "Eloquent génère des requêtes paramétrées ; aucune requête SQL brute concaténée.", ref: "app/Models/*, where()/sum() partout" },
  { titre: "Hachage des mots de passe", desc: "Hash::make (bcrypt) + cast 'hashed' ; mot de passe jamais en clair, masqué par $hidden.", ref: "AuthController.php (28), User.php (27, 36)" },
  { titre: "Validation systématique", desc: "Form Requests et $request->validate() sur toutes les entrées (types, tailles, enums, unicité).", ref: "RegisterRequest.php, *Controller.php" },
  { titre: "Contrôle d'accès", desc: "Middlewares auth + admin, et vérification du propriétaire ($account->user_id === $user->id) dans chaque action.", ref: "AdminMiddleware.php, AccountController.php" },
  { titre: "Secrets hors code", desc: "Clés Stripe et config sensibles dans le .env (non versionné), lues via env()/config(). Seul .env.example (vide) est versionné.", ref: "config/services.php (26-30), .env.example (68-71)" },
  { titre: "Sessions durcies", desc: "session()->regenerate() à la connexion, invalidate() + regenerateToken() à la déconnexion.", ref: "AuthController.php (51, 58-59)" },
  { titre: "Jeton d'activation sûr", desc: "bin2hex(random_bytes(32)) = 64 hex cryptographiques, effacé après usage.", ref: "AuthController.php (22, 81)" },
  { titre: "Certificat SSL / HTTPS", desc: "EN PLACE : Nginx écoute en 443 (ssl) derrière le domaine my-budgie.fr, avec un certificat Let's Encrypt renouvelé par certbot (challenge ACME).", ref: "web_server/nginx.conf (3-8, 13-15), docker-compose.yml (certbot)" },
  { titre: "Désactivation immédiate d'un compte", desc: "Le middleware global CheckUserActive déconnecte à chaque requête tout utilisateur dont is_active est passé à false (ex : désactivé par un admin).", ref: "app/Http/Middleware/CheckUserActive.php, bootstrap/app.php (17)" },
  { titre: "Secrets par variables d'environnement", desc: "Identifiants SMTP (Resend), clés Stripe et accès base de données sont lus via env()/config() depuis le .env non versionné — jamais écrits en dur dans le code.", ref: "WelcomeMail.php (env MAIL_*), config/services.php, .env" },
  { titre: "Partage sécurisé (jeton + lecture seule)", desc: "Invitation par jeton cryptographique à usage unique, acceptation liée à l'email invité, accès borné en lecture (isAccessibleBy) et révocable à tout moment.", ref: "AccountShareController.php (56, 113-117, 123), Account::isAccessibleBy" }
];

/* =====================================================================
   DÉPLOIEMENT (Docker / Nginx / PHP-FPM)
   ===================================================================== */
const DEPLOIEMENT = {
  intro: "L'application est déployée sur un VPS derrière le nom de domaine my-budgie.fr, en HTTPS (certificat Let's Encrypt géré par certbot). Docker Compose sépare le serveur web (Nginx, ports 80 + 443) et le serveur PHP (PHP-FPM), qui dialoguent en FastCGI. Les assets front (Vite) sont compilés au moment de la construction de l'image (Dockerfile multi-étapes).",
  services: [
    { nom: "app (PHP-FPM)", desc: "Image zenomz/budgie-app construite via un Dockerfile MULTI-ÉTAPES : d'abord node:20-alpine compile les assets Vite (npm run build), puis php:8.3-fpm exécute Laravel. Écoute le port 9000.", ref: "web_server/Dockerfile" },
    { nom: "web (Nginx)", desc: "nginx:alpine, expose les ports 80 ET 443 (HTTPS). Sert public/ (partagé via le volume assets_data) et transmet le PHP à app:9000. Monte les certificats Let's Encrypt.", ref: "web_server/nginx.conf, docker-compose.yml" },
    { nom: "certbot", desc: "⭐ Génère et renouvelle le certificat SSL Let's Encrypt (validation via le challenge ACME dans /.well-known/acme-challenge/). C'est ce qui fournit le HTTPS exigé par l'énoncé.", ref: "docker-compose.yml (certbot), nginx.conf (13-15)" },
    { nom: "mysql", desc: "mysql:8.0, base budgie_db, volume persistant mysql_data. Identifiants passés par variables d'environnement.", ref: "docker-compose.yml (mysql)" },
    { nom: "phpmyadmin", desc: "Interface web d'administration MySQL (port 8085).", ref: "docker-compose.yml (phpmyadmin)" },
    { nom: "mailhog", desc: "Conservé pour le développement (UI 8025). En production, l'envoi passe par un vrai SMTP (Resend) configuré dans le .env.", ref: "docker-compose.yml (mailhog)" }
  ],
  cle: [
    { code: "listen 443 ssl;", exp: "⭐ Nginx écoute en HTTPS sur le port 443 (ssl active le chiffrement TLS)." },
    { code: "ssl_certificate /etc/letsencrypt/live/my-budgie.fr/fullchain.pem;", exp: "⭐ Certificat SSL Let's Encrypt (chaîne complète). ssl_certificate_key pointe la clé privée." },
    { code: "location /.well-known/acme-challenge/ { root /var/www/certbot; }", exp: "⭐ Route réservée à certbot pour prouver la propriété du domaine et (re)délivrer le certificat." },
    { code: "location ~ \\.php$ { fastcgi_pass app:9000; }", exp: "⭐ Nginx envoie tout fichier .php au conteneur PHP-FPM nommé app, port 9000 (protocole FastCGI)." },
    { code: "location / { try_files $uri $uri/ /index.php?$query_string; }", exp: "⭐ Sinon on tente le fichier ; à défaut tout est routé vers public/index.php (front controller Laravel). C'est ce qui permet aussi de servir /cours/ en statique." },
    { code: "FROM node:20-alpine AS frontend-builder ... RUN npm run build", exp: "⭐ Étape 1 du Dockerfile : un conteneur Node compile les assets CSS/JS (Vite)." },
    { code: "COPY --from=frontend-builder /build/public/build ./public/build", exp: "⭐ Étape 2 : on copie UNIQUEMENT les assets compilés dans l'image PHP finale (image légère, sans Node)." }
  ]
};

/* =====================================================================
   VÉRIFICATION DE L'ÉNONCÉ (périmètre implémenté)
   ===================================================================== */
const ENONCE = [
  { exigence: "Identification (espace personnel)", points: "1", statut: "ok", fichiers: "AuthController, RegisterRequest, User, WelcomeMail, auth/*.blade.php", note: "Inscription + email de confirmation + connexion/déconnexion (session)." },
  { exigence: "Comptes — CRUD + solde + filtre", points: "3", statut: "ok", fichiers: "AccountController, Account, accounts/index+show.blade.php", note: "Solde affiché dans la liste et le détail ; filtre par nom/description (client)." },
  { exigence: "Dépenses — CRUD (ponctuel / tous les N mois)", points: "3", statut: "ok", fichiers: "ExpenseController, Expense, expenses/*.blade.php", note: "Récurrence MONTHLY/YEARLY, dates début/fin." },
  { exigence: "Revenus — CRUD", points: "3", statut: "ok", fichiers: "IncomeController, Income, incomes/*.blade.php", note: "Structure jumelle des dépenses." },
  { exigence: "Prévisions (état à un mois, intérêts nets)", points: "3", statut: "ok", fichiers: "PrevisionController, PrevisionService, previsions/*.blade.php", note: "Taux annuel→mensuel, imposition, récurrence, projection à une date." },
  { exigence: "Conception & intégration (maquette → UI)", points: "1", statut: "ok", fichiers: "resources/views, tailwind.config.js", note: "Thème budgie cohérent, composants réutilisables (à relier à la maquette Figma)." },
  { exigence: "Déploiement (Docker + Nginx/PHP-FPM)", points: "1", statut: "ok", fichiers: "docker-compose.yml, web_server/Dockerfile, nginx.conf, certbot", note: "Déployé sur VPS derrière my-budgie.fr, HTTPS (Let's Encrypt), build multi-étapes. Séparation serveur web / serveur PHP." },
  { exigence: "Gestion de projet (GitHub/Trello/Jira)", points: "1", statut: "partiel", fichiers: ".git (historique des commits)", note: "Historique Git présent ; présenter l'outil de suivi (board) le jour J." },
  { exigence: "Sécurité (CSRF, XSS, SQLi, .env, SSL)", points: "1", statut: "ok", fichiers: "@csrf, Blade {{}}, Eloquent, .env, nginx SSL, CheckUserActive", note: "SSL en place (Let's Encrypt/HTTPS), secrets par variables d'environnement, désactivation immédiate des comptes." },
  { exigence: "Abonnements (Stripe, quotas gratuit)", points: "1 (bonus)", statut: "ok", fichiers: "SubscriptionController, services.php, migration plan", note: "Checkout abonnement + quotas 2/7/2 ; webhooks à ajouter pour la robustesse." },
  { exigence: "Partage de compte (invitation email, lecture seule)", points: "1 (bonus)", statut: "ok", fichiers: "AccountShareController, AccountShare, migration account_shares, shareAccountMail, accounts/shared+share-*.blade.php", note: "Invitation par email + jeton, acceptation vérifiée, accès lecture seule via isAccessibleBy, révocation immédiate." }
];

/* -------- GLOSSAIRE -------- */
const GLOSSAIRE = [
  { term: "MVC", def: "Modèle-Vue-Contrôleur : séparation des données, de l'affichage et de la logique de traitement." },
  { term: "Route", def: "Association entre une URL (+ verbe HTTP) et le code à exécuter (une méthode de contrôleur)." },
  { term: "Contrôleur", def: "Classe qui reçoit une requête, coordonne la logique et renvoie une réponse (vue ou JSON)." },
  { term: "Modèle (Eloquent)", def: "Classe représentant une table ; ses méthodes décrivent les relations et lisent/écrivent en base." },
  { term: "ORM", def: "Object-Relational Mapping : traduit objets PHP ↔ lignes SQL automatiquement." },
  { term: "Migration", def: "Fichier versionné décrivant la création/modification d'une table, rejouable via artisan migrate." },
  { term: "Middleware", def: "Filtre exécuté avant le contrôleur (ex : vérifier l'authentification ou le rôle)." },
  { term: "Form Request", def: "Classe dédiée à la validation et à l'autorisation d'une requête HTTP." },
  { term: "Blade", def: "Moteur de templates de Laravel (directives @if/@foreach, composants, échappement auto)." },
  { term: "CSRF", def: "Cross-Site Request Forgery : attaque de requête forgée ; contrée par un jeton @csrf." },
  { term: "XSS", def: "Cross-Site Scripting : injection de code dans une page ; contrée par l'échappement {{ }}." },
  { term: "Injection SQL", def: "Injection de SQL malveillant ; évitée par les requêtes paramétrées d'Eloquent." },
  { term: "Route Model Binding", def: "Conversion automatique d'un {id} d'URL en objet modèle correspondant." },
  { term: "Injection de dépendances", def: "Laravel fournit automatiquement les objets attendus en paramètre d'une méthode." },
  { term: "Eager loading", def: "Précharger une relation (with) pour éviter le problème N+1 (une requête par élément)." },
  { term: "Assignation de masse", def: "Remplir plusieurs colonnes d'un coup ; sécurisée par la liste blanche $fillable." },
  { term: "Cast", def: "Conversion automatique du type d'une colonne (ex : 'hashed', 'boolean', 'decimal:2', 'date')." },
  { term: "Migration de plan", def: "Passage free ↔ premium qui active/désactive les quotas." },
  { term: "FastCGI", def: "Protocole par lequel Nginx transmet les requêtes PHP à PHP-FPM." },
  { term: "PHP-FPM", def: "FastCGI Process Manager : gestionnaire de processus qui exécute le PHP." },
  { term: "Carbon", def: "Librairie de manipulation de dates utilisée par Laravel." },
  { term: "Flash message", def: "Message stocké pour une seule requête suivante (with('status', ...))." },
  { term: "Intérêts composés", def: "Intérêts ajoutés au solde, qui produisent eux-mêmes des intérêts le mois suivant." },
  { term: "Modulo (%)", def: "Reste d'une division entière ; sert ici à tester la récurrence (tous les N mois)." },
  { term: "Method spoofing", def: "Simuler PUT/DELETE depuis un <form> HTML via un champ caché _method (@method)." },
  { term: "Relation N-N (belongsToMany)", def: "Relation plusieurs-à-plusieurs entre deux tables, matérialisée par une table de liaison (pivot)." },
  { term: "Table pivot", def: "Table intermédiaire reliant deux entités d'une relation N-N (ici account_shares entre users et accounts)." },
  { term: "wherePivot", def: "Filtre une relation belongsToMany sur une colonne de la table pivot (ex : status = accepted)." },
  { term: "updateOrCreate", def: "Met à jour une ligne existante selon des critères, ou la crée si elle n'existe pas (opération idempotente)." },
  { term: "Lecture seule (read-only)", def: "Accès permettant de consulter des données sans pouvoir les modifier ; ici imposé via isAccessibleBy et l'absence de routes d'écriture pour l'invité." },
  { term: "Statut d'invitation", def: "État d'un partage : pending (en attente), accepted (accepté), revoked (révoqué)." },
  { term: "Jeton à usage unique", def: "Valeur aléatoire effacée après utilisation pour empêcher le rejeu d'un lien (token=null après acceptation)." },
  { term: "onDelete set null", def: "Contrainte de clé étrangère qui met la colonne à null (au lieu de supprimer la ligne) quand l'enregistrement lié est supprimé." }
];

/* =====================================================================
   SYMBOLES — dictionnaire caractère par caractère
   (sert à l'onglet « Symboles » ET au décodeur : clic sur un symbole du code)
   ===================================================================== */
const SYMBOLES = [
  /* ---- Symboles PHP ---- */
  { sym: "$", cat: "Symboles PHP", def: "Sigil de variable : en PHP, tout nom de variable commence par $ (ex : $user, $data)." },
  { sym: "->", cat: "Symboles PHP", def: "Flèche objet : accède à une propriété ou appelle une méthode d'un OBJET (ex : $user->email, $account->save())." },
  { sym: "::", cat: "Symboles PHP", def: "Opérateur de résolution de portée : accès STATIQUE à une constante/méthode de classe, ou ::class pour le nom complet (ex : User::create, AccountShare::STATUS_PENDING)." },
  { sym: "=>", cat: "Symboles PHP", def: "Double flèche : associe une CLÉ à une VALEUR dans un tableau ['a' => 1], ou lie le paramètre au corps d'une fonction fléchée (fn($x) => $x*2)." },
  { sym: ".", cat: "Symboles PHP", def: "Point : concaténation de chaînes en PHP (colle deux textes : 'a' . 'b' donne 'ab'). En JS, c'est l'accès à une propriété." },
  { sym: ";", cat: "Symboles PHP", def: "Point-virgule : termine une instruction." },
  { sym: ",", cat: "Symboles PHP", def: "Virgule : sépare des arguments d'une fonction ou des éléments d'un tableau." },
  { sym: "[ ]", cat: "Symboles PHP", def: "Crochets : créent un tableau [1, 2, 3] ou accèdent à un élément par clé ($data['email'])." },
  { sym: "( )", cat: "Symboles PHP", def: "Parenthèses : liste des arguments d'une fonction, ou regroupement d'une expression pour la priorité." },
  { sym: "{ }", cat: "Symboles PHP", def: "Accolades : délimitent un bloc de code (corps d'une fonction, d'un if, d'une classe)." },
  { sym: "?Type", cat: "Symboles PHP", def: "Type nullable : ?User signifie « un objet User OU null » (le paramètre peut être vide)." },
  { sym: "//", cat: "Symboles PHP", def: "Commentaire sur une ligne : le texte qui suit est ignoré à l'exécution." },

  /* ---- Opérateurs ---- */
  { sym: "=", cat: "Opérateurs", def: "Affectation : range la valeur de droite dans la variable de gauche ($x = 5)." },
  { sym: "==", cat: "Opérateurs", def: "Égalité lâche : compare les valeurs après conversion de type (à éviter en général)." },
  { sym: "===", cat: "Opérateurs", def: "Égalité stricte : vrai seulement si même valeur ET même type." },
  { sym: "!==", cat: "Opérateurs", def: "Différence stricte : vrai si la valeur OU le type diffèrent." },
  { sym: "!=", cat: "Opérateurs", def: "Différence lâche." },
  { sym: "!", cat: "Opérateurs", def: "NON logique : inverse un booléen (!true = false ; !$user = « pas d'utilisateur »)." },
  { sym: "&&", cat: "Opérateurs", def: "ET logique : vrai seulement si les DEUX conditions sont vraies." },
  { sym: "||", cat: "Opérateurs", def: "OU logique : vrai si AU MOINS UNE condition est vraie." },
  { sym: "%", cat: "Opérateurs", def: "Modulo : reste de la division entière (7 % 3 = 1). Sert à tester « tous les N mois » dans les prévisions." },
  { sym: "+", cat: "Opérateurs", def: "Addition (ou, entre deux tableaux PHP, fusion en gardant les clés existantes)." },
  { sym: "-", cat: "Opérateurs", def: "Soustraction." },
  { sym: "*", cat: "Opérateurs", def: "Multiplication." },
  { sym: "/", cat: "Opérateurs", def: "Division." },
  { sym: "+=", cat: "Opérateurs", def: "Ajoute puis affecte : $a += $b équivaut à $a = $a + $b." },
  { sym: "-=", cat: "Opérateurs", def: "Soustrait puis affecte : $a -= $b équivaut à $a = $a - $b." },
  { sym: ">=", cat: "Opérateurs", def: "Supérieur ou égal." },
  { sym: "<=", cat: "Opérateurs", def: "Inférieur ou égal." },
  { sym: "??", cat: "Opérateurs", def: "Coalescence null : renvoie la première valeur qui n'est pas null ($a ?? 'défaut')." },

  /* ---- Mots-clés PHP ---- */
  { sym: "function", cat: "Mots-clés", def: "Déclare une fonction ou une méthode." },
  { sym: "public", cat: "Mots-clés", def: "Visibilité : membre accessible partout (depuis l'extérieur de la classe)." },
  { sym: "private", cat: "Mots-clés", def: "Visibilité : membre accessible uniquement à l'intérieur de la classe." },
  { sym: "protected", cat: "Mots-clés", def: "Visibilité : accessible dans la classe et ses classes filles." },
  { sym: "static", cat: "Mots-clés", def: "Membre appartenant à la CLASSE elle-même (appelé avec ::), pas à un objet." },
  { sym: "const", cat: "Mots-clés", def: "Déclare une constante (valeur fixe). En JS, variable qui ne change pas de référence." },
  { sym: "class", cat: "Mots-clés", def: "Déclare une classe (un modèle d'objet)." },
  { sym: "extends", cat: "Mots-clés", def: "Héritage : la classe reprend tout le comportement d'une classe parente." },
  { sym: "use", cat: "Mots-clés", def: "Importe une classe/namespace en haut du fichier, ou insère un trait dans une classe." },
  { sym: "namespace", cat: "Mots-clés", def: "Espace de noms : classe le fichier dans une arborescence logique (App\\Models...)." },
  { sym: "return", cat: "Mots-clés", def: "Renvoie une valeur et sort de la fonction." },
  { sym: "new", cat: "Mots-clés", def: "Instancie (crée) un nouvel objet à partir d'une classe." },
  { sym: "if", cat: "Mots-clés", def: "Exécute un bloc seulement si la condition est vraie." },
  { sym: "else", cat: "Mots-clés", def: "Bloc exécuté quand le if est faux." },
  { sym: "foreach", cat: "Mots-clés", def: "Boucle sur chaque élément d'un tableau/collection." },
  { sym: "for", cat: "Mots-clés", def: "Boucle avec compteur (départ ; condition ; incrément)." },
  { sym: "match", cat: "Mots-clés", def: "Aiguillage (PHP 8) qui RENVOIE une valeur selon les cas (comme switch mais en expression)." },
  { sym: "fn", cat: "Mots-clés", def: "Fonction fléchée courte (arrow function) : fn($x) => $x + 1." },
  { sym: "true / false", cat: "Mots-clés", def: "Valeurs booléennes : vrai / faux." },
  { sym: "null", cat: "Mots-clés", def: "Absence de valeur (vide)." },
  { sym: "as", cat: "Mots-clés", def: "Renomme : dans foreach ($items as $item), ou alias d'import (use X as Y)." },

  /* ---- Fonctions & méthodes courantes ---- */
  { sym: "validate()", cat: "Fonctions & méthodes", def: "Valide les données de la requête selon des règles ; échoue avec des erreurs si invalide." },
  { sym: "where()", cat: "Fonctions & méthodes", def: "Clause SQL WHERE : filtre les lignes (requête paramétrée, anti-injection)." },
  { sym: "whereIn()", cat: "Fonctions & méthodes", def: "WHERE colonne IN (liste) : garde les lignes dont la valeur est dans la liste." },
  { sym: "first()", cat: "Fonctions & méthodes", def: "Renvoie le premier résultat de la requête, ou null." },
  { sym: "get()", cat: "Fonctions & méthodes", def: "Exécute la requête et renvoie une collection de résultats." },
  { sym: "sum()", cat: "Fonctions & méthodes", def: "Somme SQL d'une colonne (ex : total des montants)." },
  { sym: "map()", cat: "Fonctions & méthodes", def: "Transforme chaque élément d'une collection et renvoie une nouvelle collection." },
  { sym: "create()", cat: "Fonctions & méthodes", def: "Eloquent : crée ET enregistre un nouvel enregistrement en base." },
  { sym: "updateOrCreate()", cat: "Fonctions & méthodes", def: "Met à jour la ligne correspondant aux critères, ou la crée si elle n'existe pas." },
  { sym: "exists()", cat: "Fonctions & méthodes", def: "Renvoie vrai/faux selon qu'au moins une ligne correspond (requête booléenne)." },
  { sym: "belongsTo()", cat: "Fonctions & méthodes", def: "Relation Eloquent « appartient à » (côté clé étrangère)." },
  { sym: "hasMany()", cat: "Fonctions & méthodes", def: "Relation Eloquent « possède plusieurs »." },
  { sym: "belongsToMany()", cat: "Fonctions & méthodes", def: "Relation plusieurs-à-plusieurs via une table pivot." },
  { sym: "wherePivot()", cat: "Fonctions & méthodes", def: "Filtre une relation N-N sur une colonne de la table pivot (ex : status = accepted)." },
  { sym: "view()", cat: "Fonctions & méthodes", def: "Renvoie une vue Blade (page HTML) avec des données." },
  { sym: "response()", cat: "Fonctions & méthodes", def: "Fabrique une réponse HTTP (souvent ->json(...) avec un code)." },
  { sym: "redirect()", cat: "Fonctions & méthodes", def: "Redirige le navigateur vers une autre URL/route." },
  { sym: "route()", cat: "Fonctions & méthodes", def: "Génère l'URL d'une route à partir de son nom." },
  { sym: "auth()", cat: "Fonctions & méthodes", def: "Accès à l'authentification ; auth()->user() = l'utilisateur connecté." },
  { sym: "config()", cat: "Fonctions & méthodes", def: "Lit une valeur de configuration (qui vient souvent du .env)." },
  { sym: "env()", cat: "Fonctions & méthodes", def: "Lit une variable d'environnement du .env ; 2e argument = valeur par défaut." },
  { sym: "with()", cat: "Fonctions & méthodes", def: "Attache un message flash à une redirection, ou précharge une relation (eager loading)." },
  { sym: "bin2hex()", cat: "Fonctions & méthodes", def: "Convertit des octets bruts en chaîne hexadécimale (utilisé pour les jetons)." },
  { sym: "random_bytes()", cat: "Fonctions & méthodes", def: "Génère des octets aléatoires cryptographiques (imprévisibles)." },
  { sym: "strtolower()", cat: "Fonctions & méthodes", def: "Met une chaîne en minuscules (normalise les emails)." },
  { sym: "urlencode()", cat: "Fonctions & méthodes", def: "Encode une valeur pour l'insérer sans risque dans une URL." },
  { sym: "number_format()", cat: "Fonctions & méthodes", def: "Formate un nombre (décimales, séparateurs) ; ici au format français." },
  { sym: "now()", cat: "Fonctions & méthodes", def: "Date/heure actuelle (objet Carbon)." },
  { sym: "abort()", cat: "Fonctions & méthodes", def: "Interrompt la requête avec un code HTTP (ex : abort(403))." },
  { sym: "Hash::make()", cat: "Fonctions & méthodes", def: "Hache un mot de passe (bcrypt) ; irréversible." },
  { sym: "Auth::attempt()", cat: "Fonctions & méthodes", def: "Tente la connexion en comparant email + mot de passe haché." },

  /* ---- Directives Blade ---- */
  { sym: "@csrf", cat: "Directives Blade", def: "Insère un champ caché avec le jeton anti-CSRF (obligatoire pour POST/PUT/DELETE)." },
  { sym: "@if / @else", cat: "Directives Blade", def: "Condition dans un template Blade." },
  { sym: "@foreach", cat: "Directives Blade", def: "Boucle sur une collection dans un template." },
  { sym: "@forelse / @empty", cat: "Directives Blade", def: "Boucle avec un cas @empty si la collection est vide." },
  { sym: "@extends", cat: "Directives Blade", def: "Indique le gabarit parent dont la page hérite." },
  { sym: "@section / @yield", cat: "Directives Blade", def: "@section définit un contenu ; @yield l'insère dans le layout." },
  { sym: "@method('PUT')", cat: "Directives Blade", def: "Ajoute un champ _method pour simuler PUT/DELETE depuis un formulaire HTML." },
  { sym: "@auth", cat: "Directives Blade", def: "Bloc affiché uniquement si un utilisateur est connecté." },
  { sym: "{{ }}", cat: "Directives Blade", def: "Affiche une valeur en l'ÉCHAPPANT automatiquement (protection XSS)." },
  { sym: "{{-- --}}", cat: "Directives Blade", def: "Commentaire Blade (n'apparaît pas dans le HTML final)." },

  /* ---- JavaScript ---- */
  { sym: "const / let", cat: "JavaScript", def: "Déclarent une variable (const = non réassignable, let = réassignable)." },
  { sym: "async / await", cat: "JavaScript", def: "async marque une fonction asynchrone ; await attend le résultat d'une promesse (ex : une requête)." },
  { sym: "fetch()", cat: "JavaScript", def: "Envoie une requête HTTP depuis le navigateur (utilisé pour créer/modifier sans recharger)." },
  { sym: "addEventListener()", cat: "JavaScript", def: "Attache une fonction à un événement (submit, click, input...)." },
  { sym: "preventDefault()", cat: "JavaScript", def: "Empêche le comportement par défaut (ex : le rechargement de page à l'envoi d'un formulaire)." },
  { sym: "JSON.stringify()", cat: "JavaScript", def: "Transforme un objet JS en texte JSON (pour le corps d'une requête)." },
  { sym: "`...${x}...`", cat: "JavaScript", def: "Gabarit de chaîne (backticks) : insère une variable avec ${...} dans un texte." }
];
