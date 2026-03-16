FROM node:24-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN chown node:node /app

USER node

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 3333

CMD [ "sh", "-c", "npx wait-on tcp:mysql:3306 && node ace migration:run --force && node ace db:seed && npm run dev"]