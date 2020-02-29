FROM node:12.10-alpine

RUN apk add --no-cache git

WORKDIR /usr/app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

EXPOSE 80

CMD [ "yarn", "serve", '-l', '80']