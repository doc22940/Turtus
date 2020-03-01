FROM node:12.10-alpine

RUN apk add --no-cache git bash

WORKDIR /usr/app
COPY package.json yarn.lock ./

# Try and link turtus package for simultaneous development
# TODO: limit this to development build mode only
RUN [ -d turtus-lib ] && cd turtus-lib && yarn link && cd .. && yarn link turtus || echo "skipping linking"

RUN yarn
COPY . .
RUN yarn build

EXPOSE 80

CMD [ "yarn", "serve", "--", "-l", "80"]