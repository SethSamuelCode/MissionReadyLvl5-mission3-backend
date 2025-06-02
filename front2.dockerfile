FROM node:lts-alpine 

COPY ./frontEnd2/mock-interview /app

WORKDIR /app

RUN npm ci 

ENTRYPOINT [ "npm","run", "start" ]