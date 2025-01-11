FROM node:20-alpine

RUN apk add --no-cache openssl libssl3 \
    && apk add --no-cache bash

WORKDIR /app

COPY package.json ./

RUN yarn global add @nestjs/cli ts-node

RUN yarn cache clean

RUN yarn install

COPY . .

COPY .env ./

RUN yarn prisma generate

RUN yarn prisma migrate deploy

RUN yarn build

EXPOSE 4000

CMD [ "yarn", "start" ]
