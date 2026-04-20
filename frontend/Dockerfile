FROM node:22-slim AS base

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Development stage
FROM base AS development
EXPOSE 3000
CMD ["yarn", "dev:docker"]

# Production stage
FROM base AS production
ARG BACKEND_API_PROXY
ENV BACKEND_API_PROXY=$BACKEND_API_PROXY
ENV NODE_ENV=production
RUN yarn build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
