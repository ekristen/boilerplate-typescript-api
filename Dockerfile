# Stage 1 - Transpile TypeScript 
FROM node:8 as typescript

WORKDIR /opt

COPY package.json /opt/package.json
COPY package-lock.json /opt/package-lock.json

RUN npm install

COPY . /opt
RUN npm run build

# Stage 2 - Build the Final Image
FROM node:8

WORKDIR /opt
ENTRYPOINT ["/usr/local/bin/dumb-init", "--"]
CMD ["node", "dist/app.js"]

RUN \
  curl -Lo /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.1/dumb-init_1.2.1_amd64 && \ 
  chmod +x /usr/local/bin/dumb-init

COPY package.json /opt/package.json
COPY package-lock.json /opt/package-lock.json
RUN npm install --production

WORKDIR /opt/dist
COPY --from=typescript /opt/dist/ /opt/dist

RUN chown -R node:node /opt/dist
USER node
