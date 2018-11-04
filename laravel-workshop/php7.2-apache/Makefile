build:
	docker build -t laravel-php7.2-apache .
run:
	docker rm -f laravel-php7.2-apache
	docker run -ti -p 8080:80 --name laravel-php7.2-apache laravel-php7.2-apache:latest
