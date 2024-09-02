FROM node:lts-slim

# ENV NODE_ENV=development

WORKDIR /app

# Build
# FROM base as build

COPY package.json yarn.lock ./
# COPY yarn.lock .

RUN yarn install --ignore-platform
# RUN yarn install

COPY . .

# Run
# FROM build

# COPY --from=build /src/node_modules /src/node_modules

CMD [ "yarn", "dev" ]
