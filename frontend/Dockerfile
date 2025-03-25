FROM node:lts-slim AS base

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the application code
COPY . .

# Expose the development server port
EXPOSE 3000

# Development stage
FROM base AS development
CMD ["yarn", "dev"]

# Production stage
FROM base AS production
ARG BACKEND_API_PROXY
ENV BACKEND_API_PROXY=$BACKEND_API_PROXY
RUN BACKEND_API_PROXY=${BACKEND_API_PROXY} yarn build
CMD ["node", ".output/server/index.mjs"]
