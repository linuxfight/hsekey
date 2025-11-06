# Builder stage
FROM oven/bun:latest AS builder
WORKDIR /app

# Copy files
COPY . .
RUN bun install

# Build API
RUN bun build ./src/index.ts --compile --outfile /app/dist/server --bytecode

# Smaller runtime stage
FROM debian:stable-slim AS runtime
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy compiled binary and migrations
WORKDIR /app
COPY --from=builder /app/apps/api/drizzle /app/drizzle
COPY --from=builder /app/dist/server /app/server

# Create non-root user
RUN useradd -m appuser && chown -R appuser /app && chmod +x /app/server
USER appuser

# Run
EXPOSE 3000
CMD ["/app/server"]
