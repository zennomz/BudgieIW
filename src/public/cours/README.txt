====================================================================
 Budgie — Cours interactif de révision (préparation soutenance)
====================================================================

À QUOI ÇA SERT
--------------
Un mini-site qui décortique le VRAI code du projet Budgie (Laravel 11),
fichier par fichier et ligne par ligne, pour t'entraîner à tout
expliquer/réciter le jour de la soutenance. Il ne modifie AUCUN
fichier du projet : tout est isolé dans ce dossier (src/public/cours/).

COMMENT L'OUVRIR
----------------
1) Double-clic (le plus simple)
   Ouvre le fichier :  index.html
   dans ton navigateur (Chrome, Firefox, Edge, Safari).
   Aucune connexion, aucun serveur, aucune installation requis.

2) Via l'application déployée (optionnel)
   Comme le dossier est dans src/public/, Nginx le sert directement :
   http://localhost:8000/cours/     (ou le port configuré)
   Cette page statique n'est PAS protégée par l'authentification.

CE QU'IL Y A DEDANS
-------------------
- Pastilles en haut : une par fonctionnalité (Identification, Comptes,
  Dépenses, Revenus, Prévisions, Administration, Abonnements, Accueil)
  + des sections transverses (Architecture, Technologies, Modèle de
  données, Sécurité, Déploiement, Vérification de l'énoncé, Glossaire).
- Colonne gauche : l'arborescence réelle du projet (clique un fichier).
- Zone centrale : le CODE coloré à gauche, l'EXPLICATION à droite,
  avec surlignage synchronisé au survol.
- Onglets par fonctionnalité : 📄 Code (pas à pas), 🗺️ Schéma,
  ❓ Quiz, 🎤 Questions du prof, ⚠️ Limites.
- Encadré « 💬 À dire à l'oral » sous chaque étape.

RACCOURCIS & FONCTIONS
----------------------
- Flèches ← → du clavier : étape précédente / suivante (onglet Code).
- Bouton « ☐ Marquer compris » : coche une étape ; la barre de
  progression en haut est mémorisée (localStorage de ton navigateur).
- Bouton « 📋 Copier » : copie le code de l'étape.
- Mode « 🎴 Flashcards » dans l'onglet Quiz : masque les réponses et
  permet l'auto-évaluation (Su / À revoir).
- Bouton « ☀️ Clair / 🌙 Sombre » : change de thème.
- Bouton « 🖨️ Imprimer » : génère une version papier/PDF pour réviser.
- Barre de recherche : surligne les correspondances dans le contenu.

FICHIERS DU COURS
-----------------
  index.html          → structure de la page
  css/style.css       → thème, mise en page, mode impression
  js/content.js       → TOUT le contenu (code réel + explications)
  js/app.js           → le moteur (navigation, coloration, quiz…)
  README.txt          → ce fichier

REMARQUE
--------
Tous les extraits de code sont copiés à l'identique des fichiers
sources (chemins cités dans chaque étape). 100 % HTML/CSS/JS, sans
aucune dépendance externe ni CDN.
