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
echo "Ensuring valid APP_KEY..."
php artisan key:generate --force --no-interaction

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