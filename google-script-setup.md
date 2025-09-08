# Настройка Google Apps Script для формы обратной связи

## Шаги настройки:

1. **Создайте Google Таблицу:**
   - Перейдите на https://sheets.google.com
   - Создайте новую таблицу
   - Назовите её "Обратная связь - Тафсири осонбаён"
   - Создайте заголовки в первой строке: Имя, Способ связи, Тип сообщения, Сообщение, Время, URL

2. **Создайте Google Apps Script:**
   - Перейдите на https://script.google.com
   - Создайте новый проект
   - Замените код на следующий:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSheet();
    
    sheet.appendRow([
      data.name || '',
      data.method || '',
      data.type || '',
      data.message || '',
      new Date(data.timestamp || Date.now()),
      data.url || ''
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Настройте права доступа:**
   - Сохраните скрипт (Ctrl+S)
   - Нажмите "Развернуть" → "Новое развертывание"
   - Выберите тип "Веб-приложение"
   - Выполнять как: "Я"
   - Доступ: "Все пользователи"
   - Нажмите "Развернуть"
   - Скопируйте URL веб-приложения

4. **Обновите код:**
   - Замените `YOUR_SCRIPT_ID` в файле `assets/js/app.js` на URL вашего веб-приложения
   - Или используйте альтернативный метод через Telegram Bot API

## Альтернативный метод через Telegram Bot:

Если Google Sheets сложно настроить, можно использовать Telegram Bot:

1. Создайте бота через @BotFather в Telegram
2. Получите токен бота
3. Узнайте свой chat_id (отправьте сообщение боту и перейдите на https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates)
4. Замените код отправки в `submitContactForm` на:

```javascript
const telegramBotToken = 'YOUR_BOT_TOKEN';
const chatId = 'YOUR_CHAT_ID';
const message = `Новое сообщение от ${data.name}:
Способ связи: ${data.method}
Тип: ${data.type}
Сообщение: ${data.message}
Время: ${new Date(data.timestamp).toLocaleString()}
URL: ${data.url}`;

fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ chat_id: chatId, text: message })
})
```
