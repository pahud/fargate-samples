build:
	#build base image
	docker build -t udn/php ./php7.2-apache
	#build laravel image based on the base image
	docker build -t udn/laravel ./laravel

run:
	#http://localhost:8080/laravel/public/
	docker inspect laravel-php7-apache > /dev/null && docker rm -f laravel-php7-apache
	docker run -d --name laravel-php7-apache -p 8080:80 udn/laravel
