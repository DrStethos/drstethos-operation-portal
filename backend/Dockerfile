FROM node:24-bookworm-slim AS build

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build \
    && find src -type f \( -name '*.ts' -o -name '*.d.ts' -o -name '*.map' \) -delete

FROM node:24-bookworm-slim AS production

ENV NODE_ENV=production
ENV PORT=5000
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ libstdc++6 \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --omit=dev \
    && apt-get purge -y python3 make g++ \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/* \
    && npm cache clean --force

COPY --from=build /app/src ./src

RUN mkdir -p /app/uploads \
    && chown -R node:node /app/uploads

USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + process.env.PORT + '/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["npm", "start"]
