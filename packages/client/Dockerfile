### STAGE 1: Build ###
FROM node:12.13.0 AS build
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
RUN npm link @angular/cli
COPY . .
RUN npm run build:prod

### STAGE 2: Run ###
FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/client /usr/share/nginx/html
