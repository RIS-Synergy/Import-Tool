FROM node:lts-slim

WORKDIR /app

# install pnpm
RUN npm install -g pnpm

COPY package.json ./
# COPY package.json pnpm-lock.yaml ./
# COPY package.json pnpm-lock.yaml ./
# COPY package.json yarn.lock ./

# RUN yarn add @rollup/rollup-linux-x64-gnu@^4.24.0

# RUN yarn install
RUN pnpm install

COPY . .

# ENTRYPOINT [ "npm", "run", "dev" ]
# ENTRYPOINT [ "yarn", "dev" ]
ENTRYPOINT [ "pnpm", "dev" ]

# ENTRYPOINT [ "./scripts/entrypoint.sh" ]
