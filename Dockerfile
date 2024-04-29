FROM node:20 AS builder

WORKDIR /falcon

COPY package.json .
RUN npm install

COPY . .