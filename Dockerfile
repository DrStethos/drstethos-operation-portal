FROM node:20-bookworm-slim AS build

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
RUN npm ci

ARG VITE_API_URL=https://drstethos-operation-portal-backend.llp.trizenventures.com/api
ENV VITE_API_URL=${VITE_API_URL}

COPY . .
RUN npm run build
RUN find backend/src -type f \( -name '*.ts' -o -name '*.map' \) -delete

FROM node:20-bookworm-slim AS production

ENV NODE_ENV=production
ENV PORT=5000
WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json ./frontend/package.json
COPY backend/package.json ./backend/package.json
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ libstdc++6 \
    && npm ci --omit=dev --workspace=backend --include-workspace-root=false \
    && apt-get purge -y python3 make g++ \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/* \
    && npm cache clean --force

COPY --from=build /app/backend/src ./backend/src
COPY --from=build /app/frontend/dist ./frontend/dist

RUN mkdir -p /app/uploads \
    && chown -R node:node /app/uploads

USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + process.env.PORT + '/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["npm", "start", "--workspace=backend"]
