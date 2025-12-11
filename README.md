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
