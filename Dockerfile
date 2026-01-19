FROM node:24-alpine AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS builder

COPY --chown=node:node pnpm-lock.yaml .
COPY --chown=node:node package.json .

RUN corepack enable pnpm && pnpm install --frozen-lockfile

COPY . .

# Build-time NEXT_PUBLIC_* envs: passed via --build-arg and exported for Next build
ARG NEXT_PUBLIC_CLIENT_ID
ARG NEXT_PUBLIC_BASE_WEB_URL
ARG NEXT_PUBLIC_BASE_API_URL
ENV NEXT_PUBLIC_CLIENT_ID=$NEXT_PUBLIC_CLIENT_ID
ENV NEXT_PUBLIC_BASE_WEB_URL=$NEXT_PUBLIC_BASE_WEB_URL
ENV NEXT_PUBLIC_BASE_API_URL=$NEXT_PUBLIC_BASE_API_URL

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
