# Robaya Site - Система локализации

Этот проект использует современную систему локализации для легкого управления многоязычным контентом. **Теперь у вас только один набор HTML файлов, который автоматически работает с разными языками!**

## 🚀 Запуск локального сервера

### Python 3 (рекомендуется)

```bash
# Запуск сервера
python3 -m http.server 8000

# Или просто
python -m http.server 8000
```

### Python 2 (если доступен)

```bash
# Запуск сервера
python -m SimpleHTTPServer 8000
```

### Node.js (если установлен)

```bash
# Установка http-server глобально (один раз)
npm install -g http-server

# Запуск сервера
http-server -p 8000
```

### PHP (если доступен)

```bash
# Запуск сервера
php -S localhost:8000
```

## 🛑 Остановка сервера

### В терминале
Нажмите `Ctrl + C` в терминале, где запущен сервер.

### Альтернативные способы
- `Cmd + C` (macOS)
- `Ctrl + Break` (Windows)

## 🌐 Доступ к сайту

После запуска сервера откройте в браузере:
```
http://localhost:8000
```

## 🎯 Новая структура проекта

```
robaya-site/
├── css/
│   └── style.css
├── js/
│   ├── translations.js      # Файл с переводами
│   └── lang.js             # Система управления языками
├── games/                   # Папка с играми
│   ├── sudoku/             # Игра Судоку
│   │   ├── index.html      # Страница игры
│   │   ├── privacy.html    # Privacy для Судоку
│   │   └── terms.html      # Terms для Судоку
│   ├── hwatu/              # Игра Хато
│   │   ├── index.html      # Страница игры
│   │   ├── privacy.html    # Privacy для Хато
│   │   ├── terms.html      # Terms для Хато
│   │   └── locales/
│   │       └── translations.js # Переводы для Хато
│   └── board-game-assistant/   # Ассистент настольных игр
│       ├── index.html      # Страница игры (Coming Soon)
│       └── locales/
│           └── translations.js # Переводы для Ассистента
├── index.html              # Главная страница (список игр)
├── privacy.html            # Общая Privacy Policy
├── terms.html              # Общие Terms of Use
└── README.md               # Подробная документация
```

## ✨ Как работает новая система

### 1. **Главная страница - список игр**
- Отображает все доступные игры в виде карточек
- Каждая карточка ведет на страницу конкретной игры
- Судоку и Хато доступны для скачивания, Ассистент - "Coming Soon"

### 2. **Отдельные страницы для каждой игры**
- **Судоку** - полноценная страница с описанием, скриншотами, скачиванием
- **Хато** - полноценная страница с описанием, скриншотами, скачиванием
- **Ассистент настольных игр** - страница с описанием планируемых функций (Coming Soon)
- Каждая игра имеет свои юридические документы (если нужно)

### 3. **Автоматическое определение языка**
- Система сама определяет предпочтительный язык пользователя
- Сохраняет выбор в localStorage
- Поддерживает определение языка браузера

### 4. **Мгновенное переключение**
- Переключение языков происходит без перезагрузки страницы
- Весь контент обновляется мгновенно
- Текущий язык выделяется в переключателе

## 🔧 Как это работает

### HTML разметка с data-атрибутами

```html
<h1 data-i18n="mainTitle">Welcome</h1>
<p data-i18n="mainSubtitle">Discover amazing mobile games and applications</p>
```

### Автоматическое обновление

1. **При загрузке страницы** - система определяет язык и загружает переводы
2. **При переключении языка** - весь контент обновляется мгновенно
3. **При навигации** - язык сохраняется между страницами

### Переключатели языка

```html
<div class="lang-switch">
    <a href="#" data-lang="en">🇺🇸 EN</a>
    <a href="#" data-lang="ru">🇷🇺 RU</a>
</div>
```

## 🆕 Добавление нового языка

### Шаг 1: Добавить переводы

В файл `js/translations.js` добавьте новый язык:

```javascript
const translations = {
  en: { /* английские переводы */ },
  ru: { /* русские переводы */ },
  de: { /* немецкие переводы */ }  // Новый язык
};
```

### Шаг 2: Обновить переключатели

В HTML файлах добавьте новый переключатель:

```html
<div class="lang-switch">
    <a href="#" data-lang="en">🇺🇸 EN</a>
    <a href="#" data-lang="ru">🇷🇺 RU</a>
    <a href="#" data-lang="de">🇩🇪 DE</a>  <!-- Новый язык -->
</div>
```

**Готово!** Теперь весь сайт автоматически поддерживает новый язык.

## 🆕 Добавление нового контента

### Шаг 1: Добавить переводы

В `js/translations.js` добавьте новые ключи:

```javascript
const translations = {
  en: {
    // ... существующие переводы
    newSection: "New Section",
    newContent: "This is new content"
  },
  ru: {
    // ... существующие переводы
    newSection: "Новый раздел",
    newContent: "Это новый контент"
  }
};
```

### Шаг 2: Добавить HTML разметку

В HTML файлах добавьте элементы с `data-i18n`:

```html
<div class="new-section">
    <h2 data-i18n="newSection">New Section</h2>
    <p data-i18n="newContent">This is new content</p>
</div>
```

**Готово!** Новый контент автоматически поддерживает все языки.

## 🆕 Добавление новой игры

### Шаг 1: Создать папку для игры

```bash
mkdir games/new-game
mkdir games/new-game/locales
```

### Шаг 2: Создать страницу игры

Создайте `games/new-game/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="../../css/style.css">
    <script src="locales/translations.js"></script>
    <script src="../../js/lang.js"></script>
    <title data-i18n="newGameTitle">New Game | Robaya</title>
</head>
<body>
    <div class="lang-switch">
        <a href="#" data-lang="en">🇺🇸 EN</a>
        <a href="#" data-lang="ru">🇷🇺 RU</a>
    </div>
    
    <a href="../../index.html" class="home-button">
        <span class="home-icon">🏠</span>
        <span data-i18n="home">Home</span>
    </a>
    
    <div class="container">
        <h1 data-i18n="newGameTitle">New Game</h1>
        <p data-i18n="newGameDescription">Description of the new game</p>
        
        <footer>
          <a href="mailto:rtat.store@gmail.com" data-i18n="email">rtat.store@gmail.com</a>
        </footer>
    </div>
</body>
</html>
```

### Шаг 3: Создать файл переводов

Создайте `games/new-game/locales/translations.js`:

```javascript
window.newGameTranslations = {
  en: {
    newGameTitle: "New Game",
    newGameDescription: "Description of the new game",
    home: "Home",
  },
  ru: {
    newGameTitle: "Новая игра",
    newGameDescription: "Описание новой игры",
    home: "Главная",
  }
};
```

### Шаг 4: Добавить на главную страницу

В `index.html` добавьте карточку:

```html
<div class="game-card">
  <a href="games/new-game/" class="game-card-link">
    <div class="game-icon">🎮</div>
    <h3 data-i18n="newGameTitle">New Game</h3>
    <p data-i18n="newGameDescription">Description of the new game</p>
  </a>
  <div class="game-actions">
    <a href="https://apps.apple.com/app/idXXXXXXXXXX" class="download-btn" target="_blank" rel="noopener">
      <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on App Store" height="40">
    </a>
  </div>
</div>
```

**Готово!** Новая игра автоматически поддерживает все языки.

## 🆕 Добавление новой страницы

### Шаг 1: Создать HTML файл

Создайте `newpage.html` с разметкой:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="css/style.css">
    <script src="js/translations.js"></script>
    <script src="js/lang.js"></script>
    <title data-i18n="newPageTitle">New Page</title>
</head>
<body>
    <div class="lang-switch">
        <a href="#" data-lang="en">🇺🇸 EN</a>
        <a href="#" data-lang="ru">🇷🇺 RU</a>
    </div>
    
    <a href="index.html" class="home-button">
        <span class="home-icon">🏠</span>
        <span data-i18n="home">Home</span>
    </a>
    
    <div class="container">
        <h1 data-i18n="newPageTitle">New Page</h1>
        <p data-i18n="newPageContent">This is a new page</p>
        
        <footer>
          <a href="mailto:rtat.store@gmail.com" data-i18n="email">rtat.store@gmail.com</a>
        </footer>
    </div>
</body>
</html>
```

### Шаг 2: Добавить переводы

В `js/translations.js` добавьте:

```javascript
const translations = {
  en: {
    // ... существующие переводы
    newPageTitle: "New Page",
    newPageContent: "This is a new page"
  },
  ru: {
    // ... существующие переводы
    newPageTitle: "Новая страница",
    newPageContent: "Это новая страница"
  }
};
```

**Готово!** Новая страница автоматически поддерживает все языки.

## 🚀 API системы локализации

### Основные методы

```javascript
// Получить экземпляр менеджера языков
const langManager = window.langManager;

// Установить язык
langManager.setLanguage('ru');

// Получить текущий язык
const currentLang = langManager.getCurrentLanguage();

// Проверить поддержку языка
const isSupported = langManager.isLanguageSupported('de');

// Получить список поддерживаемых языков
const languages = langManager.getSupportedLanguages();
```

### Получение переводов

```javascript
// Получить перевод по ключу
const translation = langManager.getTranslation('title');

// Получить вложенный перевод
const translation = langManager.getTranslation('features.feature1');
```

## 🎨 Визуальные особенности

### Переключатель языка
- **Текущий язык** выделяется светло-серым фоном
- **Другие языки** отображаются белыми с серой рамкой
- Переключение происходит мгновенно без перезагрузки

### Автоматическое обновление
- Заголовок страницы (`<title>`) автоматически переводится
- Атрибут `lang` в HTML обновляется автоматически
- Все элементы с `data-i18n` переводится мгновенно

### Карточки игр
- **Кликабельные карточки** ведут на страницы игр
- **Hover эффекты** с подъемом карточек
- **Coming Soon бейджи** для будущих игр

## 🔍 Поддерживаемые типы элементов

- `h1`, `h2`, `h3`, `p`, `span`, `div` - текстовый контент
- `input`, `textarea` - placeholder текст
- `img` - alt текст
- `title` - заголовок страницы

## 📱 Примеры использования

### Простой текст
```html
<h1 data-i18n="title">Default Text</h1>
```

### Placeholder для input
```html
<input type="text" data-i18n="searchPlaceholder" placeholder="Search...">
```

### Alt для изображения
```html
<img src="logo.png" data-i18n="logoAlt" alt="Logo">
```

### Заголовок страницы
```html
<title data-i18n="pageTitle">Default Page Title</title>
```

## 🛠️ Устранение неполадок

### Переводы не загружаются
1. Проверьте, что `translations.js` подключен перед `lang.js`
2. Убедитесь, что файл `translations.js` содержит корректный JavaScript

### Элементы не переводятся
1. Проверьте правильность атрибута `data-i18n`
2. Убедитесь, что ключ существует в файле переводов
3. Проверьте консоль браузера на наличие ошибок

### Переключение языков не работает
1. Проверьте, что переключатели имеют атрибут `data-lang`
2. Убедитесь, что значение `data-lang` соответствует ключу в переводах
3. Проверьте, что `langManager` инициализирован

## 💡 Советы по разработке

1. **Используйте описательные ключи** - `features.feature1` лучше чем `f1`
2. **Группируйте переводы по разделам** - для лучшей организации
3. **Добавляйте комментарии** - для понимания контекста перевода
4. **Тестируйте на разных языках** - чтобы убедиться в корректности
5. **Используйте fallback значения** - в HTML для случаев, когда переводы не загрузились

## 🎯 Преимущества новой системы

1. **Один набор файлов** - никаких дублированных HTML страниц
2. **Автоматическая локализация** - система сама определяет и применяет язык
3. **Мгновенное переключение** - без перезагрузки страницы
4. **Легкое расширение** - добавление языков и контента за минуты
5. **SEO-friendly** - правильные атрибуты `lang` для поисковиков
6. **Централизованное управление** - все переводы в одном месте
7. **Обратная совместимость** - старые функции продолжают работать
8. **Структурированность** - каждая игра в своей папке
9. **Профессиональный вид** - карточки игр с hover эффектами
10. **Гибкость** - можно легко добавлять новые игры

## 🌍 Локализация

Сайт поддерживает два языка:
- **🇺🇸 English** (по умолчанию)
- **🇷🇺 Русский**

Переключение языков происходит через кнопки в правом верхнем углу.

## 🎮 Игры

### Доступные игры
- **Sudoku** - игра для тренировки мозга
- **Hwatu** - корейская карточная игра

### В разработке
- **Board Games Assistant** - ассистент для настольных игр

## 🛠️ Разработка

### Добавление новой игры
1. Создайте папку в `games/`
2. Добавьте `index.html` с описанием игры
3. Создайте `locales/translations.js` с переводами
4. Обновите главную страницу

### Добавление нового языка
1. Добавьте переводы в файлы локализации
2. Обновите `js/lang.js` (добавьте язык в `supportedLanguages`)

## 📱 Особенности

- **Адаптивный дизайн** для мобильных и десктопных устройств
- **Динамическое переключение языков** без перезагрузки страницы
- **Модульная структура** для легкого расширения
- **SEO-оптимизация** с правильными мета-тегами

## 🔧 Требования

- Веб-браузер с поддержкой JavaScript
- Локальный веб-сервер (для разработки)

## 📞 Контакты

- **Email:** rtat.store@gmail.com
- **Разработчик:** Arkadiy Tsoy

## 📄 Лицензия

Этот проект использует MIT лицензию.
