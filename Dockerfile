# Etapa 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
# seguridad: crear usuario no-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
# no copies .env al contenedor de prod
EXPOSE 3000
USER appuser
CMD ["node", "dist/server.js"]

# Etapa 3: Desarrollo
FROM node:18-alpine AS development
ENV NODE_ENV=development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./
COPY src ./src
CMD ["npm", "run", "dev"]

