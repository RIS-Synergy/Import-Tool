FROM node:lts-slim

# install OpenSSL (required by Prisma)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --ignore-platform

COPY . .

CMD [ "yarn", "dev" ]