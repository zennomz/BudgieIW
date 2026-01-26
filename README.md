# 🐦 Budgie

Application de gestion budgétaire développée avec Laravel 11 et Docker.

## 📋 Prérequis

- [Docker](https://www.docker.com/get-started) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)
- Git

## 🚀 Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/zennomz/BudgieIW.git
   cd BudgieIW
   ```

2. **Lancer les conteneurs Docker**
   ```bash
   docker compose up -d
   ```

   > ⏳ Au premier lancement, Laravel 11 sera automatiquement installé et configuré.

3. **Configurer la base de données**
   
   Une fois l'installation de Laravel terminée, modifier le fichier `src/.env` :
   
   ```env
   DB_CONNECTION=mysql
   DB_HOST=mysql
   DB_PORT=3306
   DB_DATABASE=budgie_db
   DB_USERNAME=user
   DB_PASSWORD=password
   ```
   
   Puis exécuter :
   ```bash
   docker exec -it app php artisan migrate:fresh
   ```
   apres cela, vous pourrez voir dans phpmyadmin que les tables nécessaires au fonctionnement sont dans notre database !!!

4. **Accéder à l'application**
   - 🌐 Application : [http://localhost:8000](http://localhost:8000)
   - 🗄️ phpMyAdmin : [http://localhost:8080](http://localhost:8080)
   - 📧 MailHog : [http://localhost:8025](http://localhost:8025)

## 🏗️ Architecture

```
├── docker-compose.yml      # Configuration des services Docker
├── src/                    # Code source Laravel (généré automatiquement)
├── web_server/
│   ├── Dockerfile          # Image PHP 8.3-FPM
│   ├── entrypoint.sh       # Script d'initialisation
│   └── nginx.conf          # Configuration Nginx
└── db_script/              # Scripts de base de données
```

## 🐳 Services Docker

| Service     | Port  | Description                    |
|-------------|-------|--------------------------------|
| `app`       | -     | PHP 8.3-FPM + Laravel          |
| `web`       | 8000  | Nginx (serveur web)            |
| `mysql`     | 3306  | MySQL 8.0                      |
| `phpmyadmin`| 8080  | Interface de gestion MySQL     |
| `mailhog`   | 8025  | Serveur mail de test           |

## 🔧 Commandes utiles

```bash
# Démarrer les conteneurs
docker compose up -d

# Arrêter les conteneurs
docker compose down

# Voir les logs
docker compose logs -f app

# Accéder au conteneur PHP
docker exec -it app bash

# Exécuter des commandes Artisan
docker exec -it app php artisan migrate
docker exec -it app php artisan tinker

# Reconstruire les images
docker compose build --no-cache
```

## ⚙️ Configuration

### Variables d'environnement (auto-configurées)

| Variable       | Valeur        |
|----------------|---------------|
| `DB_HOST`      | mysql         |
| `DB_DATABASE`  | budgie_db     |
| `DB_USERNAME`  | user          |
| `DB_PASSWORD`  | password      |
| `MAIL_HOST`    | mailhog       |

### Accès phpMyAdmin

- **Serveur** : mysql
- **Utilisateur** : user
- **Mot de passe** : password

## 👥 Équipe

Projet annuel ESGI IW3

## 📄 Licence

Ce projet est sous licence MIT.
