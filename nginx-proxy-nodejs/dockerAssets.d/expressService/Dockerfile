FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production
RUN  apk add --no-cache bash

RUN npm i -g supervisor

# Bundle app source
COPY *.js ./
COPY startup.sh ./

EXPOSE 3001-3010

CMD bash startup.sh
#CMD npm run start-cluster