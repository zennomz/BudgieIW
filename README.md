# Budgie - Projet Docker

Un projet complet avec Docker contenant :
- **Nginx** - Serveur web (proxy inverse)
- **Laravel** - Backend API
- **MySQL** - Base de données
- **PhpMyAdmin** - Interface d'administration MySQL
- **JavaScript Vanilla** - Frontend

## Prérequis

- Docker Desktop (ou Docker + Docker Compose)
- Git

## Installation

### 1. Clone du projet

```bash
git clone <votre-repo>
cd projet annuel budgie
```

### 2. Configuration

Copier le fichier d'exemple d'environnement :

```bash
cp .env.example .env
```

### 3. Initialisation du backend Laravel

Si vous n'avez pas encore Laravel :

```bash
# Créer un nouveau projet Laravel dans le dossier backend
# Ou copier un projet existant dans le dossier backend/
```

### 4. Démarrage des services

```bash
docker-compose up -d
```

### 5. Configuration initiale de Laravel

```bash
# Accéder au conteneur PHP
docker exec -it budgie_php bash

# Générer la clé d'application
php artisan key:generate

# Migrer la base de données
php artisan migrate

# (Optionnel) Seeder
php artisan db:seed
```

## Accès aux services

- **Frontend** : http://budgie.local (ajouter au hosts)
- **Backend API** : http://api.budgie.local (ajouter au hosts)
- **PhpMyAdmin** : http://localhost:8080
  - Identifiant : budgie_user
  - Mot de passe : budgie_password

## Modification du fichier hosts

### Windows
Éditer `C:\Windows\System32\drivers\etc\hosts` en tant qu'administrateur et ajouter :

```
127.0.0.1 budgie.local
127.0.0.1 www.budgie.local
127.0.0.1 api.budgie.local
```

### Linux/Mac
Éditer `/etc/hosts` et ajouter :

```
127.0.0.1 budgie.local
127.0.0.1 www.budgie.local
127.0.0.1 api.budgie.local
```

## Commandes utiles

```bash
# Voir les logs
docker-compose logs -f [service]

# Arrêter les services
docker-compose down

# Redémarrer un service
docker-compose restart [service]

# Exécuter une commande dans un conteneur
docker exec -it budgie_php [commande]

# Accéder à MySQL
docker exec -it budgie_mysql mysql -u budgie_user -p budgie_db

# Builder les images
docker-compose build
```

## Structure du projet

```
.
├── backend/                 # Code Laravel
│   ├── Dockerfile
│   ├── public/
│   ├── src/
│   ├── tests/
│   └── ...
├── frontend/               # Code JavaScript Vanilla
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── ...
├── nginx/                  # Configuration Nginx
│   └── conf.d/
│       └── default.conf
├── docker-compose.yml      # Configuration Docker
├── .env.example            # Variables d'environnement
└── README.md
```

## Dépannage

### Les services ne démarrent pas

```bash
# Vérifier les logs
docker-compose logs

# Reconstruire les images
docker-compose build --no-cache
docker-compose up -d
```

### Problème de connexion à MySQL

- Vérifier que MySQL est bien running : `docker-compose ps`
- Attendre quelques secondes que MySQL soit prêt (health check)
- Vérifier les identifiants dans `.env`

### Permissions Laravel

```bash
docker exec -it budgie_php bash
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/
```

## Notes

- Les volumes Docker persistent les données entre les redémarrages
- Modifier `docker-compose.yml` pour changer les ports ou les versions
- Voir les fichiers `.env` pour les variables d'environnement

## Support

Pour plus d'aide, consultez :
- [Documentation Laravel](https://laravel.com/docs)
- [Documentation Docker](https://docs.docker.com/)
- [Documentation Nginx](https://nginx.org/en/docs/)
