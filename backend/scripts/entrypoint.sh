#!/bin/bash

echo 'hi0'
env

# Generate Prisma Client
npx prisma generate

# Migration
DATABASE_URL=postgresql://ris-user:dummy@ris-db:5432/ris_db?schema=public yarn prisma migrate dev
echo 'hi'

echo 'hi2'
yarn dev
