FROM node:6.2.2

COPY package.json /
RUN npm install -g astrum

RUN mkdir /app
WORKDIR /app

ENTRYPOINT ["/usr/local/lib/node_modules/astrum/manager/astrum.js"]
