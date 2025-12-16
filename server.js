const prerender = require('prerender');
const redisCache = require('prerender-redis-cache');   // ← это ключевой плагин

const server = prerender({
  chromeLocation: '/usr/bin/chromium-browser',
  chromeLauncher: {
    executablePath: '/usr/bin/chromium-browser',   // Alpine
    // executablePath: '/usr/bin/chromium',        // Debian/Ubuntu
    // executablePath: '/usr/bin/google-chrome',   // если вдруг стоит настоящий Chrome
  },
  chromeFlags: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--hide-scrollbars',
    '--disable-dev-shm-usage',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding'
  ],

  // ← вот сюда добавляются настройки для всех плагинов
  redisUrl: process.env.REDIS_URL || 'redis://127.0.0.1:6379', // если хочешь явно
  // или можно задать через переменную окружения REDIS_URL и не писать ничего
});

server.use(prerender.sendPrerenderHeader());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

// ← вот сюда подключаем кэш
//server.use(redisCache);

server.start();
console.log('Prerender server started on port 3000 with Redis cache');
