FROM node:22-slim AS base

WORKDIR /app

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
ENV NODE_ENV=production
RUN yarn build
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
