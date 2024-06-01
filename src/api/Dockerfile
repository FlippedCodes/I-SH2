# RUN 1: compile
FROM oven/bun:1.1.2-alpine as base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile
# TODO: try pulling file from project root.

# copy config files and source code
COPY package*.json ./
COPY tsconfig.json ./
COPY . .

# install all dependencies
RUN npm install

# compile code
RUN npm run build

# RUN 2: cleanup
# get node version 18
FROM node:18-buster-slim

WORKDIR /usr/src/app

# copy config files
COPY package*.json ./

# get prod dependencies
RUN npm install --omit=dev

# copy binary files
COPY --from=0 /usr/src/app/dist .

# start up the bot
CMD [ "npm", "start" ]
