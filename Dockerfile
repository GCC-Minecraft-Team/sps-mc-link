FROM node:12.18-alpine

# install git and other deps
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

# make a folder for the app
WORKDIR /usr/src/app

# copy files to the container
COPY . /usr/src/app

# go into our client dir
WORKDIR /usr/src/app/client

# build the react static content
RUN npm ci --only=production
RUN npm install react-scripts@3.4.1 -g
RUN npm run build

# go into our server dir
WORKDIR /usr/src/app/server

# install deps
RUN npm ci --only=production

# expose and run
EXPOSE 9090

CMD npm start