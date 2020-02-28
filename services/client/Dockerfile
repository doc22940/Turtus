FROM node:12.10-slim
USER root

WORKDIR /usr/app
COPY package.json yarn.lock ./
RUN yarn 
COPY src .
COPY public .

EXPOSE 80

CMD [ "yarn", "start", '-l', '3000']