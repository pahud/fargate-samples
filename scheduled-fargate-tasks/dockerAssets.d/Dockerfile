FROM alpine:latest

RUN \
	mkdir -p /aws && \
	apk -Uuv add groff less python3 && \
	pip3 install awscli && \
	rm /var/cache/apk/*

WORKDIR /aws
ENTRYPOINT ["aws"]
