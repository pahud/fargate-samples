FROM php:7.2-apache

WORKDIR /var/www/html

RUN apt-get update && \
    apt-get dist-upgrade -y && \
    apt-get install -y \
	    curl \
	    git \
	    zip \
	    joe \
        libxml2-dev \
	    zlib1g-dev \
	    libpng-dev \
	    libjpeg-dev \
	    libfreetype6-dev \
	    libxslt1.1 \
	    libxslt1-dev \
        libcurl3-dev


RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/bin --filename=composer

RUN a2enmod rewrite
RUN docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/
RUN docker-php-ext-install \
        pdo \
        pdo_mysql \
        curl \
        mbstring \
        zip \
        json \
        xml \
        xsl \
        soap \
        opcache \
        gd \
        gettext

RUN pecl install \
        xdebug \
        apcu_bc

RUN docker-php-ext-enable \
        xdebug \
        apcu


COPY 'config/.htaccess' '/var/www/html/.htaccess'
COPY 'config/php.ini' '/usr/local/etc/php/php.ini'
COPY 'config/setting.sh' '/temp/setting.sh'
RUN chmod +x '/temp/setting.sh'
RUN '/temp/setting.sh'
