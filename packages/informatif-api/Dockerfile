FROM node:14-alpine3.12
WORKDIR /usr/src/app
EXPOSE $PORT
RUN npm i -g nodemon
COPY package*.json ./
RUN npm ci
COPY . ./
USER node
CMD ["nodemon", "-L", "-r", "dotenv/config", "src/index.mjs"]
