FROM node:12.10-slim
USER root

# Install Build Tools and Docker Engine (Currently Broken...)
RUN apt-get update && \
    apt-get install -y \
      build-essential \
      python \
      apt-transport-https \
      ca-certificates \
      curl \
      gnupg-agent \
      software-properties-common
RUN curl -fsSL https://get.docker.com -o get-docker.sh
RUN chmod +X ./get-docker.sh && ./get-docker.sh

WORKDIR /usr/app

COPY package.json yarn.lock ./
RUN yarn 
COPY . .

# TODO certificate shit

EXPOSE 80 443

CMD [ "yarn", "start"]