FROM node:22-slim AS base

# Installer ffmpeg, python3 et le dernier binaire officiel yt-dlp depuis GitHub
RUN apt-get update && apt-get install -y ffmpeg python3 curl && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp && \
    rm -rf /var/lib/apt/lists/*

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@8.15.6

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/worker/package.json ./apps/worker/
COPY packages/database/package.json ./packages/database/
RUN pnpm install

COPY . .
WORKDIR /app/packages/database
RUN pnpm build

WORKDIR /app/apps/worker
RUN pnpm build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder /app/apps/worker/package.json ./apps/worker/
COPY --from=builder /app/packages/database/package.json ./packages/database/
RUN pnpm install --prod

COPY --from=builder /app/apps/worker/dist ./apps/worker/dist
COPY --from=builder /app/packages/database ./packages/database

WORKDIR /app/apps/worker
CMD ["pnpm", "start"]
