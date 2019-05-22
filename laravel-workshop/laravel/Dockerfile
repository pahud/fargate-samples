FROM udn/php
# umcomment to build with caddy-php
#FROM caddy-php


ADD laravel /var/www/html/laravel
WORKDIR /var/www/html/laravel

RUN mkdir -p /var/www/html/laravel/storage
RUN mkdir -p /var/www/html/laravel/bootstrap/cache
RUN mkdir -p /var/www/html/laravel/public/temp

RUN chmod 777 -R /var/www/html/laravel/storage
RUN chmod 777 -R /var/www/html/laravel/bootstrap/cache
RUN chmod 777 -R /var/www/html/laravel/public/temp

RUN composer update

EXPOSE 80

