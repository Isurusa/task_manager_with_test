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

1. Clone and enter
```bash
git clone https://github.com/Isurusa/task_manager_with_test.git
```
2. Go to source
```bash
cd task_manager_with_test
```
3. Start everything
```bash
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

- Backend(Laravel)
1. Run tests + generate test coverage
```bash
    docker-compose exec -e INSTALL_DEV_DEPS=true backend sh -c "XDEBUG_MODE=coverage ./vendor/bin/phpunit --coverage-html coverage-reports --coverage-clover coverage-reports/coverage.xml --coverage-text"
```
2. Open coverage report
```bash
    http://localhost:8000/coverage-reports/index.html
```
- Frontend (React)
    - Run tests with coverage
```bash
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