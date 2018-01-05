FROM node:8.9.4

# Update everything on the box
RUN apt-get -y update
RUN apt-get clean

# Set the working directory
WORKDIR /srv/src

# Copy our package.json & install our dependencies
COPY package.json /srv/src/package.json
RUN yarn install

# Copy the remaining application code
COPY . /srv/src

# Start the app
CMD yarn start
