server {
    listen 80;
    server_name ujinslav.fun www.ujinslav.fun;
    
    # Редирект HTTP -> HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ujinslav.fun www.ujinslav.fun;
    
    # Пути к SSL-сертификатам
    ssl_certificate /etc/ssl/certs/ujinslav.fun.crt;
    ssl_certificate_key /etc/ssl/private/ujinslav.fun.key;
    
    # Опционально: цепочка доверия (если есть)
    # ssl_trusted_certificate /etc/ssl/certs/example.com.chain.crt;
    
    # Настройки SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # DH параметры (опционально, для DHE-шифров)
    ssl_dhparam /etc/ssl/certs/dhparam.pem;
    
    # Кэширование SSL-сессий
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS (строгая транспортная безопасность)
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    
    # Корневая директория сайта
    root /var/www/example.com/html;
    index index.html index.htm index.php;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
}