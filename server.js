const prerender = require('prerender');
const redisCache = require('prerender-redis-cache');   // ← это ключевой плагин

const server = prerender({
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
server.use(redisCache({
  // url можно не указывать, если уже указал выше или в REDIS_URL
  // url: 'redis://127.0.0.1:6379',

  // Время жизни кэша в секундах (по умолчанию 2 недели)
  ttl: 60 * 60 * 24 * 14,        // 14 дней
  // ttl: 60 * 60 * 24 * 30,     // можно и месяц

  // Префикс ключей (чтобы не пересекаться с другими проектами)
  prefix: 'prerender:your-site-ru:',

  // Если хочешь кэшировать только 200-е ответы (рекомендую)
  onlyCache200: true,
}));

server.start();
console.log('Prerender server started on port 3000 with Redis cache');
