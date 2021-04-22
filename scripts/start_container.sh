#!/bin/sh

## move and rename default environment nginx config
## ANGULAR_ENVIRONMENT is passed in from TravisCI
ANGULAR_ENVIRONMENT="${ANGULAR_ENVIRONMENT,,}" # to lowercase as Production is different to production
cp ./etc/nginx/conf.d/nginx/default.${ANGULAR_ENVIRONMENT}.conf ./etc/nginx/conf.d/default.conf
## remove environment nginx file
rm -rf ./etc/nginx/conf.d/nginx


echo "starting nginx"
exec nginx -g 'daemon off;' "$@"
