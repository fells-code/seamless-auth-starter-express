FROM node:20-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs20
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY scripts ./scripts
RUN chmod +x ./scripts/runMigrations.js

EXPOSE 3000

ENTRYPOINT ["node", "./scripts/runMigrations.js"]
CMD ["node", "dist/src/index.js"]


