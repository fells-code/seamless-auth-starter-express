# Dev-focused container for Express API
# NOT a production image
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 4000


ENTRYPOINT ["node", "./scripts/runMigrations.js"]
CMD ["npm", "run", "dev"]


