FROM node:lts-alpine as build-stage
WORKDIR /psys-front
COPY package*.json ./
ENV NODE_OPTIONS=--max_old_space_size=4096
RUN npm config set registry http://npm.portzj.com/repository/npm-public/ && npm config set electron_mirror https://npm.taobao.org/mirrors/electron/
RUN rm -rf node_modules && npm cache clear --force && npm  install
COPY . .
RUN npm run build:web

FROM nginx as psys-front
COPY --from=build-stage /psys-front/dist/web /usr/share/nginx/html
