# Laravel with php7-apache 

This is a reference sample for Laravel application running with php7-apache and evencually deploy to AWS Fargate

# Build

build the base image and the laravel image on top of it

```
$ make build
```

this will build `udn/laravel:latest` from local docker environment.

# Run

local run this image 

```
$ make run
#http://localhost:8080/laravel/public/
docker inspect laravel-php7-apache > /dev/null && docker rm -f laravel-php7-apache
laravel-php7-apache
docker run -d --name laravel-php7-apache -p 8080:80 udn/laravel
98e1df69d5b110a9dc8596797080b82c77c283f94ee2ce07430bddb4cde90f9e
```
The application will start and listen on localhost:8080

# Validate

open **http://localhost:8080/laravel/public/** to view the Laravel application

If you run it on AWS Cloud9, you can configure the preview URL as `https://$C9_HOSTNAME/laravel/public/`

![](./images/01.png)

And click `open https://....` to preview the Laravel in the built-in browser in Cloud9

![](./images/02.png)