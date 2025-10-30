# Use a lightweight Node.js base image
FROM node:22-slim AS base

# Install required system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  openssl \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

# install python for gyp
# RUN apt-get install -y python3 make g++ && \
#   npm config set python /usr/bin/python3

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

EXPOSE 3000

# Generate Prisma client
RUN npx prisma generate

# Development stage
FROM base AS development
ENV NODE_ENV=development
CMD ["yarn", "dev"]

# Production stage
FROM base AS production
ENV NODE_ENV=production
RUN yarn build

# Ensure the build output exists
# RUN ls -la dist/

# Use a non-root user for security
USER node

CMD ["node", "dist/server.js"]
