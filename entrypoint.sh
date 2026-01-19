#!/bin/bash

cd /var/www/backend

# Créer Laravel si composer.json n'existe pas
if [ ! -f "composer.json" ]; then
    rm -rf /tmp/laravel
    composer create-project laravel/laravel /tmp/laravel --no-interaction
    cp -rT /tmp/laravel /var/www/backend
    rm -rf /tmp/laravel
fi

# Créer .env s'il n'existe pas
if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
fi

# Configurer MySQL dans .env
if [ -f ".env" ]; then
    sed -i 's/DB_CONNECTION=sqlite/DB_CONNECTION=mysql/' .env
    sed -i 's/# DB_HOST=127.0.0.1/DB_HOST=mysql/' .env
    sed -i 's/# DB_PORT=3306/DB_PORT=3306/' .env
    sed -i 's/# DB_DATABASE=laravel/DB_DATABASE=budgie_db/' .env
    sed -i 's/# DB_USERNAME=root/DB_USERNAME=budgie_user/' .env
    sed -i 's/# DB_PASSWORD=/DB_PASSWORD=budgie_password/' .env
    sed -i 's/SESSION_DRIVER=database/SESSION_DRIVER=file/' .env
fi

# Installer les dépendances
if [ ! -d "vendor" ]; then
    composer install --no-dev --no-interaction
fi

# Générer la clé d'application si absent
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null; then
    php artisan key:generate
fi

# Attendre MySQL et migrer
for i in {1..30}; do
    if php artisan tinker --execute="DB::connection()->getDatabaseName();" 2>/dev/null; then
        php artisan migrate --force
        echo "Migration en cours."
        break
    fi
    echo "Attente de MySQL..."
    sleep 1
done

chown -R www-data:www-data /var/www/backend
chmod -R 755 /var/www/backend/storage /var/www/backend/bootstrap/cache

chown -R www-data:www-data /var/www/backend/storage
chmod -R 775 /var/www/backend/storage

# Lancer PHP-FPM
php-fpm
