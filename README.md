# Установка Docker, Docker-compose 
sudo apt update
sudo apt install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update

sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Клонируй свой репо (если локально)
git clone https://github.com/ujin-slav/prerender.git
cd prerender

# Собери образ (тег — prerender-custom)
docker build -t prerender-custom .

# Тестовый запуск (без compose, просто Prerender)
docker run -d -p 3000:3000 --name prerender --restart unless-stopped
  -e REDIS_URL=redis://host.docker.internal:6379 \  # Если Redis локально
  prerender-custom


  docker ps | grep prerender
# → должен показать контейнер в статусе Up

docker logs -f prerender
# → должен написать "Prerender server started on port 3000"

# удалить контейнер 
docker stop prerender
docker rm prerender

# удалить образ 
docker rmi prerender-custom

# проверка
curl http://localhost:3000/https://ya.ru 

###### Compose 

# Первый запуск (сборка образа)
docker compose up -d --build

# Выпуск сертфикатов(сначала удаляем заглушки вместе
# вместе с папками, иначе certbot запишет новый серты как 001) 
docker compose exec certbot certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  --email ujin_slav@mail.ru \
  --agree-tos --no-eff-email \
  -d ujinslav.fun \
  -d www.ujinslav.fun

# делаем рестарт nginx 
docker compose exec nginx nginx -s reload

# Последующие запуски
docker compose up -d

# Остановка
docker compose down

# Полная очистка (включая volumes)
docker compose down -v

# Очистка кэша redis 
docker compose exec redis redis-cli FLUSHDB 

# Проверка синтакиса nginx
docker compose exec nginx nginx -t