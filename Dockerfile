FROM node:lts-alpine

ENV APP_HOME=/srv

WORKDIR ${APP_HOME}

COPY . ./

RUN set -eux; \
    apk update; \
    # install dependencies
    yarn install;

EXPOSE 3000
CMD ["yarn", "start"]
