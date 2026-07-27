FROM oven/bun:1.2.22-alpine AS builder

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1.2.22-alpine

WORKDIR /app
COPY --from=builder /app/build ./build
COPY --from=builder /app/package.json ./package.json

ENV HOST=0.0.0.0
ENV PORT=3013
ENV ORIGIN=http://localhost:3013

EXPOSE 3013
CMD ["bun", "./build/index.js"]
