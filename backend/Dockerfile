FROM node:lts-slim

# install OpenSSL (required by Prisma)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm install

# glob has odd dependency requirements
RUN yarn add glob

COPY . .

ENTRYPOINT [ "./scripts/entrypoint.sh" ]
