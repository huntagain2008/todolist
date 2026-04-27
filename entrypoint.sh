#!/bin/sh

echo "Initializing database..."
npx prisma db push

echo "Starting server..."
exec node server.js
