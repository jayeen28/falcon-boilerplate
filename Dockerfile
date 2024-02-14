FROM node:alpine

WORKDIR /falcon

COPY package.json .
RUN npm install

COPY . .