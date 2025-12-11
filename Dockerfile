#Базовый образ: Node 20 на Alpine (минимальный размер, ~150 МБ)
FROM node:20-alpine AS base

# Устанавливаем Chromium и шрифты/библиотеки для рендеринга (без GUI)
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && rm -rf /var/cache/apk/*

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (для кеширования зависимостей)
COPY package*.json ./

# Устанавливаем зависимости (production only, без devDependencies)
RUN npm ci --only=production \
    && npm cache clean --force

# Копируем весь исходный код (твой server.js и остальное)
COPY . .

# Устанавливаем переменные окружения для Chromium (Puppeteer/Prerender их подхватит)
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    CHROME_BIN=/usr/bin/chromium-browser \
    NODE_ENV=production \
    PORT=3000

# Экспонируем порт
EXPOSE 3000

# Запуск: node server.js (замени на твой entrypoint, если не server.js)
CMD ["node", "server.js"]