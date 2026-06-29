FROM php:8.2-fpm-alpine

# Install system dependencies yang dibutuhkan PHP dan Nginx
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    oniguruma-dev \
    libzip-dev

# Install PHP extensions untuk MySQL
RUN docker-php-ext-install pdo pdo_mysql bcmath mbstring zip pcntl

# Install Composer versi terbaru
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Tentukan folder kerja di dalam server
WORKDIR /var/www

# Copy seluruh isi folder backend ke dalam server
COPY . /var/www

# Install library PHP/Laravel
RUN composer install --no-dev --optimize-autoloader

# Atur hak akses folder storage agar server bisa menulis data (session, cache, log)
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Copy konfigurasi web server Nginx
COPY nginx.conf /etc/nginx/http.d/default.conf

# Buka port 80 untuk akses web
EXPOSE 80

# Jalankan optimasi Laravel dan hidupkan server PHP serta Nginx secara bersamaan
CMD php artisan config:cache && php artisan route:cache && php artisan view:cache && php-fpm -D && nginx -g "daemon off;"