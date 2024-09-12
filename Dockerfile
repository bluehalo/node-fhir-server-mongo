FROM node:lts-alpine

ENV APP_HOME=/src

WORKDIR ${APP_HOME}

COPY . ./

# If you are experiencing fetch packages issues, try deleting yarn.lock on the parent directory
RUN set -eux; \
    apk update; \
    # For private npm repo:
    # yarn config set registry http://host.docker.internal:4873; \
    # install dependencies
    yarn install;

EXPOSE 3000
CMD ["yarn", "start"]
