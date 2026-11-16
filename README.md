# robaya.studio

Сайт Robaya Studio: главная со списком приложений, страница каждого приложения и его
соглашения. Чистые HTML/CSS/JS без сборки, хостинг — GitHub Pages (домен в `CNAME`) за
Cloudflare.

## Запуск

```bash
python3 -m http.server 8000
```

и открыть `http://localhost:8000`.

## Структура

```
index.html, privacy.html, terms.html   главная и соглашения самого сайта
css/style.css                          все стили: токены цвета (светлая/тёмная тема), компоненты
js/translations.js                     общие строки: шапка, подвал, значки сторов, главная, соглашения сайта
js/site-chrome.js                      шапка, подвал, SVG-иконки (data-icon="…")
js/lang.js                             перевод data-i18n*, выбор языка (en/ru)
js/theme.js                            светлая/тёмная тема (по системе или переключателем)
js/screenshot-gallery.js               карусель скриншотов + полноэкранный просмотр
js/hls-video.js, js/vendor/            HLS-видео вне Safari (hls.js лежит здесь же, версия в имени файла)
img/badges/                            значки App Store и Google Play (Google — en и ru)
games/<app>/                           index.html, privacy.html, terms.html, AppIcon.png,
                                       screenshots/, locales/translations.js
tools/build-hwatu-legal.js             собирает privacy/terms Хато из переводов
```

## Переводы

В разметке — английский текст и ключ, `lang.js` подставляет язык:

| Атрибут | Что меняет |
|---|---|
| `data-i18n="key"` | текст (у `<img>` — `alt`) |
| `data-i18n-src="key"` | `src` (путь от корня сайта: `img/badges/…`) |
| `data-i18n-content="key"` | `content` у `<meta name="description">` |
| `data-i18n-aria="key"` | `aria-label` |

Ключ ищется сначала в таблице приложения (`window['<папка>Translations']` из
`games/<папка>/locales/translations.js`), потом в общей (`js/translations.js`). Новый ключ
добавляется в оба языка.

## Скриншоты и видео

Галерея: `<div class="screenshots-grid" data-gallery="screenshots/" data-pattern="0x0ss"
data-count="9">` берёт `0x0ss-1.png … 0x0ss-9.png`. Для горизонтальных скриншотов — класс
`screenshots-grid--landscape`. Видео — `<video>` с `<source type="application/x-mpegURL">`
(HLS) или обычный mp4.

## Соглашения Хато

Тексты — в `games/hwatu/locales/translations.js` (блоки Privacy Policy и Terms of Use, en и
ru). После правки: `node tools/build-hwatu-legal.js` пересобирает `privacy.html` и
`terms.html`. Версия документов на сайте должна совпадать с версией в игре
(`AgreementsSettings.asset` и Remote Config `agreements`): по ней игра решает, просить ли
принять соглашения заново.

## Новое приложение

1. Папка `games/<app>/` по образцу существующей: `index.html`, `locales/translations.js`
   (`window['<app>Translations']`, ключ `appName` для шапки), `AppIcon.png`, `screenshots/`,
   соглашения.
2. На странице: `<body data-app-name="…">` (и при желании `data-accent` — цвет задаётся в
   `css/style.css`), скрипты в порядке: `../../js/translations.js`, `locales/translations.js`,
   `theme.js`, `site-chrome.js`, `lang.js`.
3. Карточка на главной (`index.html`) и строки для неё в `js/translations.js`; ссылки на
   соглашения в `privacy.html`/`terms.html` сайта.
