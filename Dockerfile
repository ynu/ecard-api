# Set the base image to nginx
FROM node:6.8.0

# File Author / Maintainer
MAINTAINER Liudonghua <liudonghua123@gmail.com>

# update the repository sources list
RUN apt-get update

# install vim for quick modify
RUN apt-get install -y vim

# http://www.clock.co.uk/blog/a-guide-on-how-to-cache-npm-install-with-docker
ADD package.json /app/package.json

WORKDIR /app

RUN npm install

# copy static resources to the specified location
COPY . /app

# build and start server in production
RUN npm run build
WORKDIR /app/dist
RUN npm install
CMD node index.js
