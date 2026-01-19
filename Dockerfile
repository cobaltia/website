FROM node:24-alpine AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS builder

COPY --chown=node:node pnpm-lock.yaml .
COPY --chown=node:node package.json .

RUN corepack enable pnpm && pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM builder AS runner

COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

ENV PORT=3000
ENV NODE_ENV=production
ENV NODE_OPTIONS=--enable-source-maps
ENV HOSTNAME=0.0.0.0

RUN chown -R node:node /app/

USER node

EXPOSE 3000

CMD ["node", "server.js"]
