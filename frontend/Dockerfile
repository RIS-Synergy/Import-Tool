FROM node:lts-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the application code
COPY . .

# Expose the development server port
EXPOSE 3000

# Run the development server
CMD ["yarn", "dev"]
