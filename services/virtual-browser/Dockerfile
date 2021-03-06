FROM node:12.10-slim
USER root

#==============
#   Xvfb and xdotool
#==============
RUN apt-get update && \
  apt-get clean \
  && apt-get -y install \
    xvfb \
    xdotool \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/*

#========================
#   Miscellaneous packages
#   Includes minimal runtime used for executing non GUI programs
#   TODO: Are all of these required?
#========================
RUN apt-get update && \
    apt-get -qqy --no-install-recommends install \
    ca-certificates \
    unzip \
    wget \
    libgconf-2-4 \
    ffmpeg \
    gnupg2 \
    netcat \
    iputils-ping \
    openbox \
    x11-session-utils \
    dbus \
    dbus-x11 \
    sudo

#============================================
#   Firefox and U-block origin
#============================================
RUN apt-get update && apt-get -y install firefox-esr

RUN mkdir -p /var/run/dbus

#=================================
#  Audio
#=================================
RUN apt-get update && apt-get -y install pulseaudio socat alsa-utils consolekit
# Workaround for an X11 problem. See: http://blog.tigerteufel.de/?p=476
RUN mkdir /tmp/.X11-unix && chmod 1777 /tmp/.X11-unix && chown root /tmp/.X11-unix/

# Install ublock origin
# this was originally going to be done through firefox policies
# but that doesn't seem to be working
RUN mkdir -p /usr/lib/firefox-esr/distribution/extensions && \
  cd /usr/lib/firefox-esr/distribution/extensions && \
  wget -O uBlock0@raymondhill.net.xpi https://addons.mozilla.org/firefox/downloads/latest/ublock-origin/addon-607454-latest.xpi 

WORKDIR /usr/app

COPY package.json yarn.lock ./

# Try and link turtus package for simultaneous development
# TODO: limit this to development build mode only
RUN [ -d turtus-lib ] && cd turtus-lib && yarn link && cd .. && yarn link turtus || echo "skipping linking"

RUN yarn

COPY .babelrc ./

# copy pulse-config
COPY pulseaudio/ ./pulseaudio

# copy firefox policies file
COPY firefox/policies.json /usr/lib/firefox-esr/distribution/policies.json

# Copy src folder
COPY src/ ./src

# Add rc.xml to ~/root/.config/openbox
# be aware that tilde expansion doesn't work in Dockerfiles
COPY rc.xml /root/.config/openbox/rc.xml
# COPY uBlock.json /usr/lib/firefox-esr/browser/extensions/uBlock0@raymondhill.net.json

CMD [ "yarn", "start" ]