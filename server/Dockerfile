# Stage 1: Build & Compile C++ Native Modules (better-sqlite3)
FROM node:22-alpine AS build

WORKDIR /app

# Install build dependencies for native C++ compilation
RUN apk add --no-cache python3 make g++ gcc

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Production runtime environment
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# Copy compiled node_modules directly from build stage (avoids re-compiling in Stage 2)
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Create directory for persistent SQLite storage
RUN mkdir -p /app/data

EXPOSE 4000

CMD ["node", "dist/index.js"]
