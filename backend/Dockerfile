# Use a lightweight Node.js base image
FROM node:lts-slim

# Install required system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Install global dependencies
RUN npm install -g nodemon ts-node

# Copy package manager files first for dependency caching
COPY package.json yarn.lock ./

# Install dependencies (use yarn if yarn.lock exists)
RUN yarn install --frozen-lockfile

# Copy application source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

# Currenttly runs 'ts-node ./src/server.ts', will need to `build` later. TODO
CMD ["yarn", "docker"]
