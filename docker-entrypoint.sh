#!/bin/sh
set -e

echo "🚀 Starting application setup..."

# Generate Prisma Client (idempotent - skips if already up to date)
echo "📦 Generating Prisma Client..."
npx prisma generate

# Run migrations (Prisma will handle connection retries)
echo "🔄 Running database migrations..."
if [ "$NODE_ENV" = "production" ]; then
  npx prisma migrate deploy
else
  # In development, try to deploy migrations first
  # If no migrations exist, push the schema (errors from migrate deploy are visible)
  npx prisma migrate deploy || {
    echo "⚠️  No migrations found, pushing schema directly..."
    npx prisma db push --skip-generate
  }
fi

echo "✅ Setup complete! Starting application..."

# Execute the main command
exec "$@"
