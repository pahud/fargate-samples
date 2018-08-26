FROM hitalos/laravel

RUN cd /var/www; composer create-project --prefer-dist laravel/laravel laravelDemo

WORKDIR /var/www/laravelDemo

ADD ./phpinfo.php /var/www/laravelDemo/public
