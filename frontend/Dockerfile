FROM node:16-alpine

WORKDIR /usr/src/frontend

ENV PATH = /usr/src/frontend/node_modules/.bin:$PATH

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .