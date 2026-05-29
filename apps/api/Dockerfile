FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm@8.15.6

FROM base AS builder
WORKDIR /app
# Pour pnpm workspace
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
RUN pnpm install

COPY . .
WORKDIR /app/apps/api
RUN pnpm build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages/database/package.json ./packages/database/
RUN pnpm install --prod

COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/database ./packages/database

WORKDIR /app/apps/api
EXPOSE 3001
CMD ["pnpm", "start"]
