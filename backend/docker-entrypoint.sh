#!/usr/bin/env bash
set -e

echo "=== Starting Laravel Backend ==="

# Wait for MySQL
echo "Waiting for MySQL at ${DB_HOST}:${DB_PORT}..."
MAX_RETRIES=30
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if nc -z ${DB_HOST} ${DB_PORT} 2>/dev/null; then
    echo -e "\nMySQL is ready!"
    break
  fi
  echo -n "."
  sleep 2
  RETRY_COUNT=$((RETRY_COUNT + 1))
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
  echo -e "\nERROR: Failed to connect to MySQL after $MAX_RETRIES attempts"
  echo "Continuing anyway, but database operations may fail..."
fi


if [ -f ".env" ]; then
    echo "Removing old .env to prevent duplicate APP_KEY..."
    rm -f .env
fi

if [ ! -f ".env" ]; then
  echo "Creating .env from .env.example..."
  cp .env.example .env
fi

#Update DB settings
[ -n "$DB_HOST" ]      && sed -i "s|^DB_HOST=.*|DB_HOST=$DB_HOST|" .env
[ -n "$DB_PORT" ]      && sed -i "s|^DB_PORT=.*|DB_PORT=$DB_PORT|" .env
[ -n "$DB_DATABASE" ]  && sed -i "s|^DB_DATABASE=.*|DB_DATABASE=$DB_DATABASE|" .env
[ -n "$DB_USERNAME" ]  && sed -i "s|^DB_USERNAME=.*|DB_USERNAME=$DB_USERNAME|" .env
[ -n "$DB_PASSWORD" ]  && sed -i "s|^DB_PASSWORD=.*|DB_PASSWORD=$DB_PASSWORD|" .env


# Generate application key
echo "Checking APP_KEY..."
if grep -q "APP_KEY=$" .env || ! grep -q "APP_KEY=base64:" .env; then
    echo "Generating fresh APP_KEY..."
    php artisan key:generate --force --no-interaction
else
    echo "APP_KEY already exists, keeping it"
fi

# Verify one APP_KEY
KEY_COUNT=$(grep -o "base64:" .env | wc -l)
if [ "$KEY_COUNT" -gt 1 ]; then
    echo "WARNING: Found $KEY_COUNT APP_KEYs! Fixing..."
    # Keep only the first one
    sed -i 's|APP_KEY=.*|APP_KEY=|' .env  # Clear it
    php artisan key:generate --force --no-interaction  # Generate fresh single key
fi

echo "APP_KEY configured: $(grep '^APP_KEY=' .env | head -1 | cut -c1-50)..."


# Install dependencies if vendor doesn't exist
if [ ! -d "vendor" ]; then
  echo "Installing Composer dependencies..."
  composer install --no-interaction --optimize-autoloader --no-dev
fi

# Run migrations
echo "Running database migrations..."
php artisan migrate --force

# Clear cache
php artisan config:clear
php artisan cache:clear

# Start server
echo "Starting Laravel development server on 0.0.0.0:8000..."
exec php artisan serve --host=0.0.0.0 --port=8000