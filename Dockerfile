FROM node:16.13-bullseye-slim as build
# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production

# Update everything on the OS
RUN apt-get -y update && apt-get -y install curl autoconf build-essential && apt-get clean

RUN mkdir /srv/src
COPY package.json /srv/src/package.json

RUN echo "$NODE_ENV"
RUN if [ "$NODE_ENV" = "development" ] ; then echo 'building development' && cd /srv/src && rm --force package-lock.json && yarn install --no-optional; else echo 'building production' && cd /srv/src && rm --force package-lock.json && yarn install --no-optional --production=true; fi

#RUN cd /srv/src && rm --force package-lock.json && yarn install --no-optional
# Download the Amazon DocumentDB Certificate Authority (CA) certificate required to authenticate to your cluster
RUN curl https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem --output /srv/src/rds-combined-ca-bundle.pem


FROM node:16.13-bullseye-slim
# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production

# Update everything on the OS
RUN apt-get -y update && apt-get -y install curl && apt-get clean

# Set the working directory
RUN mkdir -p /srv/src && chown node:node /srv/src
WORKDIR /srv/src

#RUN apt-get -y install gcc

# Copy our package.json & install our dependencies
USER node
COPY --chown=node:node package.json /srv/src/package.json
COPY --chown=node:node .snyk /srv/src/.snyk

COPY --from=build /srv/src/node_modules /srv/src/node_modules
COPY --from=build /srv/src/rds-combined-ca-bundle.pem /srv/src/rds-combined-ca-bundle.pem

# This is needed when we use the custom version of node-fhir-server-core
# RUN cd /srv/src/node_modules/@asymmetrik/node-fhir-server-core && yarn install

# Copy the remaining application code.
COPY --chown=node:node . /srv/src

# this gets replaced by the command in docker-compose
CMD ["tail", "-f", "/dev/null"]

