build:
	#build base image(php7.2-apache)
	docker build -t udn/php ./php7.2-apache
	#build base image(caddy-php)
	docker build -t caddy-php ./caddy-php
	#build laravel image based on the base image
	docker build -t udn/laravel ./laravel

run:
	#http://localhost:8080/laravel/public/
	docker inspect laravel-php7 > /dev/null && docker rm -f laravel-php7 || exit 0
	docker run -d --ulimit nofile=20480:20480 --name laravel-php7 -p 8080:80 udn/laravel
