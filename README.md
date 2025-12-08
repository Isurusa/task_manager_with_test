# Task Manager - Laravel + React (Dockerized)

A full-stack Todo application with:

- **Backend**: Laravel 12 (API only)
- **Frontend**: React 19 + Vite + TypeScript
- **Database**: MySQL 8
- Everything fully containerized with Docker Compose

## Features

- Create, list, and mark tasks as completed
- Real-time hot-reload for both backend and frontend
- Automatic migrations on first start
- Test suite (PHPUnit + Jest) and test coverage reports

## Requirements
- Docker
- Docker Compose (v2+)

## Start with Docker

```bash
# 1. Clone and enter
git clone https://github.com/Isurusa/task_manager_with_test.git

cd task_manager_with_test

# 2. Start everything
docker-compose up --build

```

That’s it!

This will build three containers:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Coverage Report: http://localhost:8000/coverage-reports/index.html (after running tests)

The backend entrypoint runs migrations automatically.

## Useful Commands
```bash
# Stop everything
docker-compose down

# Fresh start (deletes database – useful after schema changes)
docker-compose down -v && docker-compose up -d --build

# View logs
docker-compose logs -f

```

## Running Tests

1. Backend(Laravel)
```bash
    # Run tests + generate beautiful HTML coverage
    docker-compose exec backend sh -c "XDEBUG_MODE=coverage php artisan test --coverage-html coverage-reports --coverage-clover coverage-reports/coverage.xml --coverage-text"

    # Open coverage report
    http://localhost:8000/coverage-reports/index.html
```
2. Frontend (React)
```bash
    # Run tests with coverage
    docker-compose exec frontend npm run test:coverage
```   

## Project Structure
        Project-Root/
        ├── backend/                    ← Laravel API (PHP 8.3)
        │   └── docker-entrypoint.sh
        │   └── coverage-reports/       ← PHPUnit HTML coverage (gitignored)
        ├── frontend/                   ← React 19 + TypeScript + Vite
        ├── docker-compose.yml
        └── README.md