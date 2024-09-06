#!/bin/bash

# Generate Prisma Client
npx prisma generate

# db password from docker secrets
db_password=$(cat /run/secrets/db_password)

# Set the DATABASE_URL
export DATABASE_URL=postgresql://ris-user:${db_password}@db:5432/ris_db?schema=public

# write password to .env
echo "DATABASE_URL=$DATABASE_URL" > .env

# Migration
yarn prisma migrate dev

if [ "$NODE_ENV" = "production" ]; then
  echo '====================='
  echo '+++  PRODUCTION  +++'
  echo '====================='
else
  echo '====================='
  echo Env: $NODE_ENV
  echo '====================='
  env | sort
  echo '====================='
fi

# if [ "$NODE_ENV" = "development" ]; then
# else
# fi

# run the main process
yarn dev
