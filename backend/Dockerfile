# Use a lightweight Node.js base image
FROM node:lts-slim

# Install required system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
openssl \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package manager files first for dependency caching
COPY package.json yarn.lock ./

# Install dependencies (use yarn if yarn.lock exists)
RUN yarn install --frozen-lockfile

# Copy application source code
COPY . .

# Ensure the entrypoint script is executable
RUN chmod +x ./scripts/entrypoint.sh

# Set the default entrypoint
# ENTRYPOINT ["./scripts/entrypoint.sh"]
RUN ["./scripts/entrypoint.sh"]
