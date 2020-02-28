FROM node:12.10-alpine

RUN apk add git

WORKDIR /usr/app
COPY package.json yarn.lock ./
RUN yarn 
COPY src public ./

EXPOSE 80

CMD [ "yarn", "start", '-l', '80']