FROM node:carbon

EXPOSE 8080

# Server to start on port 8080
ENV PORT 8080

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install --only=production

# Bundle app source
COPY . .


CMD [ "npm", "start" ]