FROM abiosoft/caddy:php

ADD Caddyfile /etc/Caddyfile
ADD index.php /var/www/html/

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/bin --filename=composer
