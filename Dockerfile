FROM node:14.15.0

# Enable apt-get to run from the new sources.
RUN printf "deb http://archive.debian.org/debian/ \
    jessie main\ndeb-src http://archive.debian.org/debian/ \
    jessie main\ndeb http://security.debian.org \
    jessie/updates main\ndeb-src http://security.debian.org \
    jessie/updates main" > /etc/apt/sources.list

# Update everything on the box
RUN apt-get -y update
RUN apt-get clean

# Set the working directory
WORKDIR /srv/src

# Copy our package.json & install our dependencies
COPY package.json /srv/src/package.json
COPY .snyk /srv/src/.snyk

# RUN cd /srv/src && yarn install --verbose
RUN cd /srv/src && rm --force package-lock.json && yarn install --verbose

# Copy the remaining application code.
COPY . /srv/src

# Download the Amazon DocumentDB Certificate Authority (CA) certificate required to authenticate to your cluster
RUN cd /srv/src && wget https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem

# Start the app
CMD npm run start
