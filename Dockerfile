FROM node:15.14-slim

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Enable apt-get to run from the new sources.
RUN printf "deb http://archive.debian.org/debian/ \
    jessie main\ndeb-src http://archive.debian.org/debian/ \
    jessie main\ndeb http://security.debian.org \
    jessie/updates main\ndeb-src http://security.debian.org \
    jessie/updates main" > /etc/apt/sources.list

# Update everything on the box
RUN apt-get -y update && apt-get -y install curl && apt-get clean

#RUN wget https://github.com/Yelp/dumb-init/releases/download/v1.2.4/dumb-init_1.2.4_amd64.deb
#RUN dpkg -i dumb-init_*.deb

# Set the working directory
RUN mkdir /srv/src && chown node:node /srv/src
WORKDIR /srv/src

# Copy our package.json & install our dependencies
USER node
COPY --chown=node:node package.json /srv/src/package.json
COPY --chown=node:node .snyk /srv/src/.snyk

# RUN cd /srv/src && yarn install --verbose
RUN cd /srv/src && rm --force package-lock.json && yarn install --no-optional --production=true

# This is needed when we use the custom version of node-fhir-server-core
# RUN cd /srv/src/node_modules/@asymmetrik/node-fhir-server-core && yarn install

# Copy the remaining application code.
COPY --chown=node:node . /srv/src

# Download the Amazon DocumentDB Certificate Authority (CA) certificate required to authenticate to your cluster
RUN curl https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem --output /srv/src/rds-combined-ca-bundle.pem

# this gets replaced by the command in docker-compose
CMD ["tail", "-f", "/dev/null"]

