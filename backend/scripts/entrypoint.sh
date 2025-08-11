#!/bin/bash

# TODO this might be deleted later

# Generate Prisma Client
npx prisma generate

# db password from docker secrets
db_password=dummy

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
  # Process environment variables
  env | sort | while IFS= read -r line; do
      if [[ $line == RIS_FA_API_KEY=* ]]; then
          echo "RIS_FA_API_KEY=*****"
      elif [[ $line == RIS_RI_API_KEY=* ]]; then
          echo "RIS_RI_API_KEY=*****"
      elif [[ $line == JWT_SECRET=* ]]; then
          echo "JWT_SECRET=*****"
      elif [[ $line == DATABASE_PASSWORD=* ]]; then
          echo "DATABASE_PASSWORD=*****"
          # DATABASE_URL
      elif [[ $line == DATABASE_URL=* ]]; then
          echo "DATABASE_URL=*****"
      else
          echo "$line"
      fi
  done
  echo '====================='
fi
