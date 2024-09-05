FROM node:lts-slim

# install OpenSSL (required by Prisma)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install

RUN yarn add glob # glob has odd dependency requirements

COPY . .

ENTRYPOINT [ "./scripts/entrypoint.sh" ]
