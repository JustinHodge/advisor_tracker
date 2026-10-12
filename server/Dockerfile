FROM node:22-alpine

WORKDIR /app

# Install build dependencies required for compiling better-sqlite3 native bindings
RUN apk add --no-cache python3 make g++ gcc

# Copy package manifests first to leverage Docker layer caching
COPY package*.json ./

# Install all dependencies (including tsx and better-sqlite3)
RUN npm install

# Copy all source files, schemas, and CSV data directly into the container
COPY . .

# Ensure persistent data directory exists
RUN mkdir -p /app/data

EXPOSE 4000

# Run TypeScript directly on the fly
CMD ["npx", "tsx", "src/index.ts"]
