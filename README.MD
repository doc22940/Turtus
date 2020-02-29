# Turt.us

**NOTE this is not a well-maintained or serious project and I am not working on this full time. I give no guarantees that the code in this repository works. For a better looking and more complete project I would recommend checking out [neko](https://github.com/nurdism/neko)**

A (WIP) self-hosted virtual browser inspired by rabb.it

Forked from [bunny by SimplyLin](https://github.com/SimplyLinn/bunny).

Features
- Control a virtual stateless firefox browser served via docker container...✔
- Create user accounts and rooms...IN PROGRESS
- Voice and video chat over p2p, text chat over not p2p...TODO

## Running Locally

To run locally simply run `docker-compose up` in the root of the repository. This will build all of the required images and start the server on port 5000 (by default).

For more information see [the wiki page on running locally](https://github.com/Khauri/Turtus/wiki/Running-Locally)

## Deploying to a Cloud Host

The steps for running on a cloud host such as AWS, Google Cloud, or Azure are more involved. In the future I'm planning on creating some basic terraform modules.

### Environment Variables

Environment variables can be supplied via a .env file.


See `example.env` located at the root of the project for descriptions of the

### Docker Containers

Tags pushed to this repository autobuild three images on DockerHub tagged as such:

- `turtus:server` - The node web server backend
- `turtus:client` - The react based web client
- `turtus:browser` - The virtual browser

Thesee images can be run together for a smooth integration, or you can choose to use some or not the other. eg if you want to supply your own front-end and/or integrate the virtual browser into your existing application, you might only require the `turtus:browser` image. For easily managing interactions I would recommend using the companion [turtus-lib](https://github.com/Khauri/turtus-lib) node package.

## Development / How Does It All Work

First I would recommend following the instructions for getting the project to
run locally.

Once that's done start the development servers for both the server and web client. 
You can do that by opening two separate terminal windows.

First, inside `services/server`:
```bash
yarn dev
```

Then, inside `services/web`:
```bash
yarn dev
```

#### 1. Virtual Browser

The Virtual Browser is a docker container based on a [dockernode image](https://hub.docker.com/_/node/) that manages a bunch of processes with the help of a not too complicated node script (bc js is cool).

Those important processes are as follows:

- dbus
  - Controls inter process communication. 
  - This is a dependancy of some of the following processes.
- Xvfb
  - Virtual Frame Buffer that implements X11 protocol.
  - Basically alows us to run graphical applications without an actual display attached
- xdotool
  - What allows  
- pulseaudio
  - A general purpose sound server.
  - Used to capture sound output from the container.
- ffmpeg
  - Records video and sound from
- firefox-esr
  - The web browser itself. 
  - Launched fullscreen and installed with ublock-origin (as soon as I figure out how)

The VirtualBrowser is intended to be launched dynamically from a script (i.e. the backend).

The container can be launched using a few arguments. 
- `-s, --signal-server <url>`  
  - The url to the signal server. See server sections for more details.
- `-t, --timeout <ms>`
  - Not yet implemented
  - The amount of time in ms the browser will wait after the last peer has disconnected before automatically shutting down. 
  - Defaults to `60000` (1 minute)

After launching the Virtual Browser and establishing the source for the media stream, a wrtc connection is made through the signalling server specifiec using the `-s` option. 

Whenever a peer connects they receive a copy of the stream via p2p and webrtc. 

The Virtual Browser can be shut down either by the client asking it nicely (i.e. sending a shutdown message) or by timing out due to a lack of peers as described above or by the signaling server itself shutting down.

#### 2. Server

The backend performs webrtc handshake negotiation and serves an api that is used to manage users and rooms. Unlike a traditional application the backend does not serve the web client. Why? Because I read an article on microservices once.

The backend is served over https only because Chrome requires a secure connection for webrtc. This means when developing locally you are required to have a certificate. You can use the one provided in the repository and simply accept the SSL error.

For mac/linux there is a script `/gen_cert.sh` that you can run that will generate the cert and key, `localhost.cert` and `localhost.key` respectively. Double click on the `.cert` file to add it to your keychain / trusted ca. 

*Note*: On mac you might have to go a bit futher by right clicking the certificate you just added to the keychain, click "get info", expand the "Trust" dropdown, then set "When using this certificate" to "Always Trust". 

Start server with:

```bash
yarn dev
```

Test the server is online with curl:

```bash
curl -k https://localhost/
# Returns the time the server received the request
```

#### 3. Client App(s)

For now there is only one client application: a responsive web application that connects to the virtual browser over p2p. 

The app is built using React.

## Emojis in Code? Why? 

They can convey meaning quickly without having to read. Here's a quick dictionary:
- 🙂Success
- 🤔Info / Warning 
- 👎Non-Fatal Error
- ☠️Fatal Error

## Connection Algorithm 

p2p connections are negotiated over the signal server and work as follows:

1. A client connects to the signal server via websocket url
2. The signal server sends the client an `identity` packet
  - This packet will be attached to every outgoing message. 
3. One or more clients subsequently connect to the websocket url 
4. The server negotiates the handshake between existing clients and the new client
5. All old clients ask the new client to identify their client type
6. If the client type is `vb` then a client must specifically ask for the stream by providing a `request.stream` packet.
7. Otherwise the client is automatically sent the stream.

## Resources

[Break monolith app into microservices](https://aws.amazon.com/getting-started/projects/break-monolith-app-microservices-ecs-docker-ec2/)

[Deploy Node.js application to AWS](https://www.freecodecamp.org/news/how-to-deploy-a-node-js-application-to-amazon-web-services-using-docker-81c2a2d7225b/)

[Making and trusting your own certificates](https://letsencrypt.org/docs/certificates-for-localhost/)

[Certbot certificate creation docker tutorial](https://techsparx.com/nodejs/docker/express-https.html)

[aws-js-api](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECS.html#constructor-property)