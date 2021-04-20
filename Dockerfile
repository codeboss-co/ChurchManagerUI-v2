### STAGE 1: Build ###

# We label our stage as ‘builder’
FROM node:15-alpine as builder

## Install node dependencies - done in a separate step so Docker can cache it.
COPY ./package.json ./package-lock.json ./

## --no-cache: download package index on-the-fly, no need to cleanup afterwards
## --virtual: bundle packages, remove whole bundle at once, when done
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm ci --quiet && mkdir /ng-app && mv ./node_modules ./ng-app \
    && apk del build-dependencies

WORKDIR /ng-app

COPY . .

### Build the angular app in production mode and store the artifacts in dist folder

RUN npm run ng build -- --prod --output-path=dist


### STAGE 2: Setup ###

FROM nginx:1.19-alpine

## Add bash (alpine comes with ash)
RUN apk add --no-cache --upgrade bash

## Copy our default nginx configs
COPY ./nginx/* /etc/nginx/conf.d/nginx/

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ng-app/dist /usr/share/nginx/html

## Shell script for entry point
COPY ./scripts/start_container.sh ./

## Default environment variables - this will be set when we run the container again
ENV ANGULAR_ENVIRONMENT Production

#CMD ["nginx", "-g", "daemon off;"]
ENTRYPOINT ["sh", "-c", "bash ./start_container.sh; tail -f /dev/null"]