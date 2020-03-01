FROM node:12.10-slim
USER root

# Install Build Tools and Docker Engine
RUN apt-get update && \
    apt-get install -y \
      build-essential \
      python \
      git \
      apt-transport-https \
      ca-certificates \
      curl \
      gnupg-agent \
      software-properties-common
RUN curl -fsSL https://get.docker.com -o get-docker.sh && \
    chmod +x ./get-docker.sh && \
    ./get-docker.sh

WORKDIR /usr/app

COPY package.json yarn.lock ./
# Try and link turtus package for simultaneous development
# TODO: limit this to development build mode only
RUN [ -d turtus-lib ] && cd turtus-lib && yarn link && cd .. && yarn link turtus || echo "skipping linking"
RUN yarn
COPY . .

EXPOSE 80

CMD [ "yarn", "start"]