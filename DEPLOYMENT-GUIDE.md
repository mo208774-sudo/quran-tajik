# 🚀 Руководство по развертыванию сайта

## Вариант 1: GitHub Pages (Рекомендуется)

### Шаг 1: Подготовка репозитория
1. Создайте новый репозиторий на GitHub:
   - Название: `tafsiri-osonbayon` или `quran-tajik`
   - Сделайте репозиторий публичным
   - Добавьте README.md

### Шаг 2: Загрузка файлов
```bash
# Клонируйте репозиторий
git clone https://github.com/ваш-username/tafsiri-osonbayon.git
cd tafsiri-osonbayon

# Скопируйте все файлы проекта в папку репозитория
# (копируйте все файлы из /Users/akubiabdukahhor/Desktop/site/)

# Добавьте файлы в git
git add .
git commit -m "Initial commit: Tafsiri Osonbayon website"
git push origin main
```

### Шаг 3: Настройка GitHub Pages
1. Перейдите в Settings → Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: / (root)
5. Сохраните настройки

### Шаг 4: Настройка custom домена (опционально)
1. Купите домен (например, tafsiri-osonbayon.com)
2. В настройках Pages добавьте custom domain
3. Настройте DNS записи:
   ```
   Type: CNAME
   Name: www
   Value: ваш-username.github.io
   
   Type: A
   Name: @
   Value: 185.199.108.153
   Value: 185.199.109.153
   Value: 185.199.110.153
   Value: 185.199.111.153
   ```

## Вариант 2: Netlify

### Шаг 1: Подготовка
1. Зарегистрируйтесь на netlify.com
2. Подключите GitHub аккаунт

### Шаг 2: Деплой
1. New site from Git
2. Выберите ваш репозиторий
3. Build settings:
   - Build command: (оставьте пустым)
   - Publish directory: /
4. Deploy site

### Шаг 3: Настройка домена
1. Site settings → Domain management
2. Add custom domain
3. Настройте DNS записи

## Вариант 3: Vercel

### Шаг 1: Подготовка
1. Зарегистрируйтесь на vercel.com
2. Подключите GitHub

### Шаг 2: Деплой
1. Import project
2. Выберите репозиторий
3. Deploy

## Настройка после деплоя

### 1. Обновите URLs в файлах
Замените все `https://tafsiri-osonbayon.com` на ваш реальный URL:

```bash
# Для GitHub Pages
https://ваш-username.github.io/tafsiri-osonbayon

# Для custom домена
https://tafsiri-osonbayon.com
```

### 2. Проверьте работу
- [ ] Сайт загружается
- [ ] Все страницы работают
- [ ] PDF файлы открываются
- [ ] Аудио плеер работает
- [ ] Мобильная версия корректна

### 3. SEO проверка
- [ ] Google Search Console
- [ ] Yandex Webmaster
- [ ] Проверка sitemap.xml
- [ ] Проверка robots.txt

## Мониторинг производительности

### 1. Google PageSpeed Insights
https://pagespeed.web.dev/

### 2. GTmetrix
https://gtmetrix.com/

### 3. WebPageTest
https://www.webpagetest.org/

## Резервное копирование

### Автоматические бэкапы
```bash
# Создайте скрипт для автоматического бэкапа
#!/bin/bash
cd /path/to/your/project
git add .
git commit -m "Auto backup $(date)"
git push origin main
```

## Масштабирование

### Когда переходить на платный хостинг:
- Трафик > 100GB/месяц
- Нужны серверные функции
- Требуется больше контроля
- Нужна база данных

### Рекомендуемые платные хостинги:
1. **Timeweb** - от 150₽/месяц
2. **DigitalOcean** - от $5/месяц
3. **AWS S3 + CloudFront** - pay-as-you-go
4. **VPS от любого провайдера**

---

## 🎯 Итоговые рекомендации

**Для старта:** GitHub Pages (бесплатно, быстро, надежно)
**Для роста:** Netlify или Vercel (бесплатно, больше функций)
**Для бизнеса:** Timeweb или DigitalOcean (полный контроль)

Ваш проект отлично подходит для GitHub Pages!
