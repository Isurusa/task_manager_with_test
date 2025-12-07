FROM node:22.12-alpine

# Or use latest Node 22
# FROM node:22-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json* ./

# Clean install
RUN npm ci --no-fund --no-audit --legacy-peer-deps

# Copy app
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]