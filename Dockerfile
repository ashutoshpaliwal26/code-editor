# Step 1: Base image for building
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN apk update && apk add --no-cache libc6-compat
RUN npm install -g pnpm && pnpm install

# Copy all source code
COPY . .

# Build the Next.js app
RUN pnpm build

# Step 2: Minimal runtime image
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Install pnpm (required to start the app)
RUN npm install -g pnpm

# Copy necessary build artifacts and files from builder
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Set environment
ENV NODE_ENV=production

EXPOSE 3000

# Start Next.js app
CMD ["pnpm", "start"]
