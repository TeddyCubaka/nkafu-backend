FROM node:20-alpine

RUN apk add --no-cache openssl libssl3 \
    && apk add --no-cache bash

WORKDIR /usr/src/app

COPY package.json ./

RUN yarn global add @nestjs/cli ts-node

RUN yarn cache clean

RUN yarn

COPY . .

COPY .env ./

RUN yarn prisma generate

RUN yarn build

EXPOSE 4000

CMD yarn prisma migrate deploy &&  yarn ts-node prisma/seeds/menu.seed.ts && yarn ts-node prisma/seeds/action.seed.ts  && yarn start
