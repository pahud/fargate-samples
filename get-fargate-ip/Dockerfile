FROM node:alpine

RUN apk add --no-cache curl jq groff less python py-pip && \
pip install awscli && \
apk --purge -v del py-pip && \
rm /var/cache/apk/*

RUN mkdir /app
ADD index.js /app
ADD run.sh /root
RUN chmod a+x /root/run.sh

CMD /root/run.sh
