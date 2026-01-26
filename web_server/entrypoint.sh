#!/bin/bash
set -e

cd /var/www

if [ ! -f "composer.json" ]; then
    echo "Dossier vide dÃ©tecte. Installation de Laravel 11..."
    composer create-project laravel/laravel:^11.0 .
fi

if [ ! -d "vendor" ]; then
    echo "Installation des dÃ©pendances..."
    composer install --no-interaction --optimize-autoloader
fi

if [ ! -f ".env" ]; then
    echo "Configuration du fichier .env..."
    cp .env.example .env
    sed -i 's/DB_HOST=127.0.0.1/DB_HOST=mysql/g' .env
    sed -i 's/DB_DATABASE=laravel/DB_DATABASE=laravel_db/g' .env
    sed -i 's/DB_USERNAME=root/DB_USERNAME=sail/g' .env
    sed -i 's/DB_PASSWORD=/DB_PASSWORD=password/g' .env
    sed -i 's/MAIL_HOST=127.0.0.1/MAIL_HOST=mailhog/g' .env
    sed -i 's/MAIL_MAILER=log/MAIL_MAILER=smtp/g' .env
    php artisan key:generate
fi

# 4. Attente de la base de donnÃ©es (pour Ã©viter l'erreur de connexion)
echo "Attente de MySQL..."
until ./artisan db:monitor > /dev/null 2>&1; do
  sleep 1
done

# 5. Migrations
echo "Lancement des migrations..."
php artisan migrate --force

# 6. Lancement de PHP
echo "Environnement pret sur http://localhost:8000"
exec php-fpm