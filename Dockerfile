FROM node:6.2.2

COPY . /node
RUN cd /node && npm install -g astrum

RUN mkdir /app
WORKDIR /app

ENTRYPOINT ["/usr/local/lib/node_modules/astrum/manager/astrum.js"]
