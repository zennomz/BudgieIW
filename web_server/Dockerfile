FROM node:20-alpine AS frontend-builder

WORKDIR /build

COPY src/package*.json ./

RUN npm ci

COPY src/ .

RUN rm -rf node_modules/.bin/vite

RUN npm rebuild vite

RUN npm run build

FROM php:8.3-fpm

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip \
    libjpeg-dev libfreetype6-dev libzip-dev

RUN apt-get clean && rm -rf /var/lib/apt/lists/*

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

RUN useradd -G www-data,root -u 1000 -d /home/dev dev
RUN mkdir -p /home/dev/.composer && chown -R dev:dev /home/dev

COPY src/composer.json src/composer.lock ./

RUN composer install --no-scripts --no-autoloader --prefer-dist

COPY src/ .
COPY src/.env /var/www/.env

RUN composer dump-autoload --optimize

COPY --from=frontend-builder /build/public/build ./public/build

RUN chown -R dev:www-data /var/www \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

USER dev