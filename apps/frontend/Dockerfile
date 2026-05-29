FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@8.15.6

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/frontend/package.json ./apps/frontend/
RUN pnpm install

COPY apps/frontend ./apps/frontend
WORKDIR /app/apps/frontend
RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/apps/frontend/.next/standalone ./
COPY --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static

WORKDIR /app/apps/frontend
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
