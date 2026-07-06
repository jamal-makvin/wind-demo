# Техническое задание: Wind-Demo

## 1. Краткое описание

Wind-Demo — демо-казино/слот-хаб для запуска demo mode слотов и crash-игр поверх сайта через iframe. Проект не содержит реальных депозитов, выводов, real-money ставок и платёжной логики. Сайт одновременно служит рекламной витриной WIND Partners для трафферов и арбитражников, которым нужно тестировать игры, записывать креативы и переходить в CPA-партнёрку.

Основные CTA:

- Player CTA: `Play Demo`
- Affiliate CTA: `Join WIND Partners`

Обязательный дисклеймер:

```text
18+. Wind-Demo provides demo games only. No real-money gambling, deposits or withdrawals are available.
```

## 2. Цели продукта

- Дать пользователю быстрый поиск и запуск demo-игры без регистрации и без real-money механик.
- Сохранить рабочий вид настоящего слот-хаба: плотная сетка, минимум лишнего текста, быстрые фильтры.
- Показать WIND Partners как основной рекламный оффер без помех для запуска игр.
- Подготовить безопасную архитектуру для подключения игрового агрегатора вроде Zeus250 или аналогичного.
- Обеспечить mock-режим, в котором frontend и backend работают до подключения реального агрегатора.
- Дать администратору управление баннерами, CTA, провайдерами, популярными играми и базовой статистикой.

## 3. Аудитории

### 3.1 Игроки

Хотят бесплатно проверить слот или crash-игру, посмотреть механику, волатильность, бонусные раунды и визуальный стиль.

### 3.2 Трафферы

Используют сайт как удобную площадку для записи креативов и быстрой демонстрации demo gameplay.

### 3.3 Арбитражники

Переходят в WIND Partners, чтобы заливать iGaming CPA-офферы и работать с партнёрской программой.

## 4. Ограничения и compliance

- На сайте нет депозитов.
- На сайте нет вывода денег.
- На сайте нет ставок на реальные деньги.
- Все игры запускаются только в `demo mode`.
- API-ключи игровых агрегаторов запрещено хранить на frontend.
- Все секреты хранятся только на backend в env-переменных.
- Frontend получает только безопасные данные: публичные названия, изображения, provider slug, demo launch URL или одноразовый proxy launch token.
- На всех основных экранах должен быть доступен 18+ дисклеймер.
- Если агрегатор не поддерживает передачу demo balance/currency, сайт показывает выбранный баланс только в интерфейсе и запускает игру с дефолтными параметрами агрегатора.

## 5. Языки

Поддерживаемые языки интерфейса:

- RU
- EN

Язык выбирается в header и сохраняется в профиле/local storage. Для авторизованного пользователя язык сохраняется в базе.

## 6. UX/UI концепт

### 6.1 Общий стиль

Интерфейс должен выглядеть как рабочий продукт слот-хаба, а не лендинг. Главный экран открывается сразу на сетке игр. Текстовые блоки сведены к минимуму.

Визуальные принципы:

- тёмная тема;
- плотная сетка игровых карточек;
- верхняя панель с утилитарными контролами;
- яркие обложки игр;
- аккуратные рекламные блоки WIND Partners;
- короткие подписи и компактные элементы управления;
- без больших hero-секций;
- без длинных объясняющих текстов на главном экране.

### 6.2 Цветовая система

Базовые цвета:

- Background primary: `#070A13`
- Background secondary: `#0E1424`
- Surface: `#121A2D`
- Surface raised: `#18223A`
- Border: `#263552`
- Text primary: `#F5F8FF`
- Text secondary: `#94A3B8`
- Accent purple: `#7C3AED`
- Accent blue: `#2563EB`
- Accent cyan: `#22D3EE`
- Success: `#22C55E`
- Warning: `#F59E0B`
- Danger: `#EF4444`

Градиенты допустимы только в CTA и баннерах, но интерфейс не должен становиться однотонно фиолетовым или синим.

### 6.3 Layout

Desktop:

- top welcome banner;
- sticky header;
- left sidebar ad;
- main game area;
- right sidebar ad;
- bottom disclaimer/footer.

Tablet:

- top banner;
- header в две строки при нехватке ширины;
- боковые баннеры превращаются в inline/ad rows;
- сетка 4-5 колонок.

Mobile:

- top banner компактный;
- header с логотипом, языком, профилем и кнопкой фильтров;
- поиск отдельной строкой;
- сетка 2 колонки;
- sticky bottom panel с balance/currency и CTA при необходимости;
- overlay игры занимает весь экран.

## 7. Структура страниц

### 7.1 `/`

Главная страница слот-хаба.

Содержит:

- welcome banner WIND Partners;
- header;
- provider filter;
- search;
- demo balance/currency;
- вкладки категорий;
- сетку игр;
- inline banner WIND Partners;
- side banners на desktop;
- 18+ disclaimer.

### 7.2 `/game/:slug`

Опциональная deep-link страница игры. По прямой ссылке открывает главный интерфейс и сразу запускает overlay выбранной demo-игры.

### 7.3 `/profile`

Минимальный личный кабинет.

Содержит:

- auth status;
- выбранный язык;
- выбранную валюту;
- demo balance;
- последние запущенные игры;
- CTA в WIND Partners;
- Telegram subscription status, если пользователь вошёл через Telegram.

### 7.4 `/login`

Экран входа.

Методы:

- Telegram Login Widget или OAuth flow через backend;
- Google OAuth через backend.

При Telegram-регистрации пользователь должен подтвердить подписку на Telegram-канал WIND Partners. Backend проверяет подписку через Telegram Bot API.

### 7.5 `/admin`

Админ-панель. Доступ только для пользователей с ролью `admin`.

Разделы:

- dashboard;
- games;
- providers;
- banners;
- CTA links;
- languages;
- ad placements;
- stats;
- settings.

## 8. Список компонентов frontend

### 8.1 Shell

- `AppShell`
- `TopPartnerBanner`
- `HeaderBar`
- `LanguageSwitcher`
- `ProviderSelect`
- `SearchInput`
- `DemoBalanceControl`
- `CurrencySelect`
- `ProfileButton`
- `AgeDisclaimer`

### 8.2 Game grid

- `GameTabs`
- `GameGrid`
- `GameCard`
- `GameCardSkeleton`
- `ProviderBadge`
- `GameSearchEmptyState`
- `LoadMoreButton` или infinite scroll

### 8.3 Game overlay

- `GameOverlay`
- `GameIframe`
- `GameLoader`
- `OverlayToolbar`
- `FullscreenButton`
- `CloseGameButton`
- `OverlayBalanceSummary`
- `OverlayPartnerBanner`
- `LaunchErrorState`

### 8.4 Ads

- `PartnerBanner`
- `SideAdRail`
- `InlineAdBanner`
- `OverlayAdBanner`
- `PartnerCtaButton`

### 8.5 Auth/account

- `LoginPanel`
- `TelegramLoginButton`
- `GoogleLoginButton`
- `TelegramSubscriptionGate`
- `ProfileSettings`
- `RecentGamesList`

### 8.6 Admin

- `AdminShell`
- `AdminDashboard`
- `BannerEditor`
- `CtaLinkEditor`
- `ProviderTable`
- `GameTable`
- `PopularPinManager`
- `LanguageEditor`
- `StatsCards`
- `StatsChart`

## 9. Пользовательские сценарии

### 9.1 Быстрый запуск demo-игры

1. Пользователь открывает `/`.
2. Видит welcome banner WIND Partners и сетку популярных игр.
3. Выбирает валюту и demo balance или оставляет дефолт.
4. Кликает по карточке игры.
5. Frontend запрашивает launch URL у backend.
6. Открывается overlay с loader.
7. После получения URL iframe загружает demo-игру.
8. Пользователь может закрыть overlay, включить fullscreen или перейти в WIND Partners.

### 9.2 Поиск игры

1. Пользователь вводит часть названия в search.
2. Frontend делает debounce-запрос к `/api/games`.
3. Сетка обновляется без перезагрузки страницы.
4. Если ничего не найдено, показывается короткий empty state.

### 9.3 Фильтр провайдера

1. Пользователь выбирает провайдера в header.
2. Сетка показывает только активные и видимые игры выбранного провайдера.
3. Отключённые администратором провайдеры не отображаются.

### 9.4 Вход через Telegram

1. Пользователь нажимает `Login`.
2. Выбирает Telegram.
3. Backend получает Telegram auth payload и валидирует подпись.
4. Backend проверяет подписку на Telegram-канал WIND Partners.
5. Если подписки нет, frontend показывает gate с кнопкой подписки.
6. После подтверждения создаётся кабинет.

### 9.5 Вход через Google

1. Пользователь выбирает Google.
2. Backend завершает OAuth flow.
3. Кабинет создаётся без обязательной Telegram-подписки.
4. Баннеры WIND Partners продолжают отображаться.

### 9.6 Работа администратора

1. Администратор входит в `/admin`.
2. Меняет CTA link для WIND Partners.
3. Загружает или редактирует баннер.
4. Закрепляет игры в Popular.
5. Отключает провайдера или скрывает отдельную игру.
6. Проверяет статистику запусков игр и CTA-кликов.

## 10. Backend API

Все endpoints начинаются с `/api`.

### 10.1 Public

#### `GET /api/config`

Возвращает публичные настройки интерфейса.

Response:

```json
{
  "defaultLanguage": "ru",
  "supportedLanguages": ["ru", "en"],
  "defaultCurrency": "RUB",
  "supportedCurrencies": ["RUB", "USD", "EUR"],
  "defaultDemoBalance": 100000,
  "partnerCtaUrl": "https://partners.example.com/register",
  "disclaimer": "Wind-Demo provides demo games only. No real-money gambling, deposits or withdrawals are available."
}
```

#### `GET /api/providers`

Query:

- `activeOnly=true`

Response:

```json
{
  "items": [
    {
      "id": "prov_pragmatic",
      "name": "Pragmatic Play",
      "slug": "pragmatic-play",
      "active": true,
      "gameCount": 128
    }
  ]
}
```

#### `GET /api/games`

Query:

- `q`
- `provider`
- `category`
- `popular`
- `limit`
- `cursor`
- `language`

Response:

```json
{
  "items": [
    {
      "id": "game_gates_demo",
      "slug": "gates-demo",
      "title": "Gates of Demo",
      "providerId": "prov_pragmatic",
      "providerName": "Pragmatic Play",
      "category": "slots",
      "imageUrl": "/mock/games/gates-demo.webp",
      "demoAvailable": true,
      "popular": true
    }
  ],
  "nextCursor": "eyJvZmZzZXQiOjI0fQ=="
}
```

#### `GET /api/banners`

Query:

- `placement=top|left|right|inline|overlay`
- `language=ru|en`

#### `POST /api/games/:id/launch`

Body:

```json
{
  "currency": "RUB",
  "demoBalance": 100000,
  "language": "ru",
  "device": "desktop"
}
```

Response:

```json
{
  "launchId": "launch_01J0000000000000000000000",
  "mode": "demo",
  "iframeUrl": "https://aggregator.example.com/demo/session/abc",
  "balanceInjected": true,
  "currencyInjected": true,
  "expiresAt": "2026-06-29T12:30:00Z"
}
```

Если агрегатор не поддерживает balance/currency:

```json
{
  "launchId": "launch_01J0000000000000000000001",
  "mode": "demo",
  "iframeUrl": "https://aggregator.example.com/demo/session/def",
  "balanceInjected": false,
  "currencyInjected": false,
  "fallbackMessage": "Selected demo balance is shown in Wind-Demo UI only. The provider uses its default demo balance."
}
```

#### `POST /api/events`

Для аналитики.

Body:

```json
{
  "type": "game_card_click",
  "gameId": "game_gates_demo",
  "placement": "grid",
  "metadata": {
    "providerId": "prov_pragmatic"
  }
}
```

### 10.2 Auth

#### `POST /api/auth/telegram`

Валидирует Telegram Login payload, проверяет подписку при регистрации и создаёт session.

#### `GET /api/auth/google/start`

Начинает Google OAuth flow.

#### `GET /api/auth/google/callback`

Завершает Google OAuth flow.

#### `POST /api/auth/logout`

Завершает session.

#### `GET /api/me`

Возвращает профиль текущего пользователя.

#### `PATCH /api/me/settings`

Сохраняет язык, валюту и demo balance.

### 10.3 Admin

Все admin endpoints требуют `role=admin`.

- `GET /api/admin/stats`
- `GET /api/admin/games`
- `PATCH /api/admin/games/:id`
- `POST /api/admin/games/:id/pin`
- `DELETE /api/admin/games/:id/pin`
- `GET /api/admin/providers`
- `PATCH /api/admin/providers/:id`
- `GET /api/admin/banners`
- `POST /api/admin/banners`
- `PATCH /api/admin/banners/:id`
- `DELETE /api/admin/banners/:id`
- `GET /api/admin/cta-links`
- `PATCH /api/admin/cta-links/:id`
- `GET /api/admin/translations`
- `PATCH /api/admin/translations/:locale`

## 11. Структура базы данных

Рекомендуемая СУБД: PostgreSQL.

### 11.1 `users`

| Поле | Тип | Описание |
| --- | --- | --- |
| id | uuid | Primary key |
| email | varchar nullable | Email для Google auth |
| telegram_id | varchar nullable | Telegram user id |
| display_name | varchar | Имя пользователя |
| avatar_url | text nullable | Аватар |
| auth_provider | enum | `telegram`, `google` |
| telegram_subscribed | boolean | Подписка на WIND channel |
| role | enum | `user`, `admin` |
| created_at | timestamptz | Дата создания |
| updated_at | timestamptz | Дата обновления |

### 11.2 `user_settings`

| Поле | Тип | Описание |
| --- | --- | --- |
| user_id | uuid | FK users |
| language | varchar | `ru` или `en` |
| currency | varchar | `RUB`, `USD`, `EUR` |
| demo_balance | numeric | Выбранный demo balance |
| updated_at | timestamptz | Дата обновления |

### 11.3 `providers`

| Поле | Тип | Описание |
| --- | --- | --- |
| id | uuid | Primary key |
| external_id | varchar | ID в агрегаторе |
| name | varchar | Название |
| slug | varchar | URL slug |
| logo_url | text nullable | Логотип |
| active | boolean | Показывать провайдера |
| supports_demo_balance | boolean | Поддержка передачи balance |
| supports_currency | boolean | Поддержка передачи currency |
| sort_order | int | Сортировка |
| created_at | timestamptz | Дата создания |
| updated_at | timestamptz | Дата обновления |

### 11.4 `games`

| Поле | Тип | Описание |
| --- | --- | --- |
| id | uuid | Primary key |
| provider_id | uuid | FK providers |
| external_id | varchar | ID в агрегаторе |
| slug | varchar | URL slug |
| title | varchar | Название |
| category | enum | `slots`, `crash`, `table`, `live`, `other` |
| image_url | text | Обложка |
| demo_available | boolean | Доступен demo mode |
| visible | boolean | Показывать в сетке |
| popular | boolean | Закрепить в Popular |
| volatility | varchar nullable | Низкая/средняя/высокая, если есть |
| rtp | numeric nullable | RTP, если есть |
| created_at | timestamptz | Дата создания |
| updated_at | timestamptz | Дата обновления |

### 11.5 `banners`

| Поле | Тип | Описание |
| --- | --- | --- |
| id | uuid | Primary key |
| placement | enum | `top`, `left`, `right`, `inline`, `overlay` |
| locale | varchar | `ru`, `en`, `all` |
| title | varchar | Заголовок |
| body | text nullable | Текст |
| image_url | text nullable | Изображение |
| cta_label | varchar | Текст кнопки |
| cta_url | text | URL |
| active | boolean | Включён |
| starts_at | timestamptz nullable | Начало показа |
| ends_at | timestamptz nullable | Конец показа |
| sort_order | int | Сортировка |

### 11.6 `game_launches`

| Поле | Тип | Описание |
| --- | --- | --- |
| id | uuid | Primary key |
| user_id | uuid nullable | FK users |
| anonymous_id | varchar nullable | ID гостя |
| game_id | uuid | FK games |
| provider_id | uuid | FK providers |
| currency | varchar | Валюта |
| demo_balance | numeric | Баланс |
| balance_injected | boolean | Передан ли balance агрегатору |
| currency_injected | boolean | Передана ли currency агрегатору |
| launch_url_hash | varchar | Хэш launch URL, не сам URL |
| created_at | timestamptz | Дата запуска |

### 11.7 `events`

| Поле | Тип | Описание |
| --- | --- | --- |
| id | uuid | Primary key |
| user_id | uuid nullable | FK users |
| anonymous_id | varchar nullable | ID гостя |
| type | varchar | Тип события |
| game_id | uuid nullable | FK games |
| banner_id | uuid nullable | FK banners |
| metadata | jsonb | Доп. данные |
| created_at | timestamptz | Дата события |

### 11.8 `translations`

| Поле | Тип | Описание |
| --- | --- | --- |
| locale | varchar | `ru`, `en` |
| namespace | varchar | `common`, `header`, `game`, `admin` |
| key | varchar | Ключ |
| value | text | Текст |
| updated_at | timestamptz | Дата обновления |

## 12. Схема работы с игровым агрегатором

### 12.1 Синхронизация каталога

1. Backend cron/job вызывает aggregator API.
2. Получает список провайдеров.
3. Получает список игр по каждому провайдеру.
4. Нормализует данные в локальную структуру.
5. Сохраняет или обновляет `providers` и `games`.
6. Скрытые вручную игры остаются скрытыми после синхронизации.
7. Отключённые вручную провайдеры остаются отключёнными.

### 12.2 Launch flow

1. Frontend отправляет `POST /api/games/:id/launch`.
2. Backend проверяет, что игра видима, провайдер активен, demo mode доступен.
3. Backend формирует request к агрегатору:
   - game external id;
   - provider external id;
   - mode `demo`;
   - currency, если поддерживается;
   - demo balance, если поддерживается;
   - language;
   - return URL;
   - user/session identifier без персональных секретов.
4. Агрегатор возвращает demo launch URL.
5. Backend сохраняет запись в `game_launches`.
6. Backend отдаёт frontend iframe URL или одноразовый proxy URL.
7. Frontend открывает overlay и загружает iframe.

### 12.3 Env-переменные

```env
APP_URL=https://wind-demo.example.com
DATABASE_URL=postgres://...
SESSION_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHANNEL_ID=@windpartners
PARTNER_CTA_URL=https://partners.example.com/register
AGGREGATOR_MODE=mock
AGGREGATOR_BASE_URL=https://api.aggregator.example.com
AGGREGATOR_CLIENT_ID=...
AGGREGATOR_CLIENT_SECRET=...
AGGREGATOR_API_KEY=...
```

## 13. Логика iframe overlay

### 13.1 Поведение

- Overlay открывается поверх сайта.
- Background затемняется, но структура сайта остаётся визуально узнаваемой.
- На desktop overlay может быть 90-96% viewport с toolbar сверху.
- На mobile overlay занимает 100% viewport.
- До загрузки iframe показывается skeleton/loader.
- При ошибке launch API показывается error state с кнопками `Try again` и `Close`.

### 13.2 Toolbar

Кнопки:

- close;
- fullscreen;
- balance/currency summary;
- `Join WIND Partners`;
- optional reload.

### 13.3 Безопасность iframe

Рекомендуемые атрибуты:

```html
<iframe
  src="..."
  title="Demo game"
  allow="fullscreen; autoplay; clipboard-read; clipboard-write"
  referrerpolicy="no-referrer-when-downgrade"
  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
></iframe>
```

Если конкретный агрегатор требует дополнительные permissions, список уточняется в интеграционной документации агрегатора.

## 14. Demo balance и currency

### 14.1 Дефолты

- Default currency RU: `RUB`
- Default currency EN: `USD`
- Default demo balance RUB: `100000`
- Default demo balance USD: `5000`
- Default demo balance EUR: `5000`

### 14.2 Правила ввода

- Minimum: `100`
- Maximum: `10000000`
- Только положительные числа.
- Форматирование с разделителями тысяч.
- Последнее значение сохраняется в local storage для гостя и в `user_settings` для авторизованного пользователя.

### 14.3 Передача в игру

Backend должен знать capabilities провайдера:

- `supports_demo_balance`
- `supports_currency`

Если оба значения поддерживаются, backend передаёт их в aggregator launch request.

Если currency не поддерживается:

- frontend показывает выбранную currency в интерфейсе;
- backend запускает игру с дефолтной currency агрегатора;
- response содержит `currencyInjected=false`.

Если balance не поддерживается:

- frontend показывает выбранный demo balance в toolbar/профиле;
- игра открывается с балансом провайдера;
- response содержит `balanceInjected=false`.

## 15. Админ-панель

### 15.1 Dashboard

Метрики:

- game card clicks;
- game launches;
- WIND Partners CTA clicks;
- registrations;
- Telegram signups;
- top games;
- top providers.

### 15.2 Games

Функции:

- поиск игры;
- фильтр по провайдеру;
- скрыть/показать игру;
- закрепить/открепить Popular;
- редактировать title/image/category;
- посмотреть launch count.

### 15.3 Providers

Функции:

- включить/отключить провайдера;
- настроить sort order;
- увидеть количество игр;
- увидеть capabilities balance/currency;
- ручная синхронизация.

### 15.4 Banners

Функции:

- создать баннер;
- выбрать placement;
- выбрать язык;
- загрузить image URL;
- задать title/body/CTA;
- включить/отключить;
- настроить schedule.

### 15.5 CTA Links

Функции:

- менять основной `PARTNER_CTA_URL`;
- задавать UTM по placement;
- включать разные URL для RU/EN.

### 15.6 Languages

Функции:

- редактировать RU/EN тексты;
- экспортировать JSON;
- импортировать JSON;
- включать/отключать язык.

## 16. Тексты интерфейса RU/EN

### 16.1 RU

```json
{
  "common": {
    "playDemo": "Играть демо",
    "joinPartners": "Стать партнером WIND Partners",
    "close": "Закрыть",
    "fullscreen": "На весь экран",
    "search": "Поиск игры",
    "provider": "Провайдер",
    "allProviders": "Все провайдеры",
    "balance": "Демо-баланс",
    "currency": "Валюта",
    "login": "Войти",
    "profile": "Профиль",
    "popular": "Popular",
    "loading": "Загрузка",
    "tryAgain": "Повторить",
    "noGames": "Игры не найдены",
    "ageDisclaimer": "18+. Wind-Demo предоставляет только демо-игры. Реальные депозиты, выводы и ставки на деньги недоступны."
  },
  "banner": {
    "topTitle": "Заливаешь iGaming?",
    "topBody": "Подключайся к WIND Partners и получай CPA до $80+",
    "cta": "Стать партнером"
  },
  "auth": {
    "title": "Вход в Wind-Demo",
    "telegram": "Войти через Telegram",
    "google": "Войти через Google",
    "telegramGate": "Подпишитесь на Telegram-канал WIND Partners, чтобы создать кабинет.",
    "checkSubscription": "Проверить подписку"
  },
  "game": {
    "launching": "Запускаем демо-игру",
    "fallbackBalance": "Выбранный баланс отображается в Wind-Demo. Провайдер использует свой demo balance.",
    "launchError": "Не удалось запустить игру"
  }
}
```

### 16.2 EN

```json
{
  "common": {
    "playDemo": "Play Demo",
    "joinPartners": "Join WIND Partners",
    "close": "Close",
    "fullscreen": "Fullscreen",
    "search": "Search game",
    "provider": "Provider",
    "allProviders": "All providers",
    "balance": "Demo balance",
    "currency": "Currency",
    "login": "Login",
    "profile": "Profile",
    "popular": "Popular",
    "loading": "Loading",
    "tryAgain": "Try again",
    "noGames": "No games found",
    "ageDisclaimer": "18+. Wind-Demo provides demo games only. No real-money gambling, deposits or withdrawals are available."
  },
  "banner": {
    "topTitle": "Running iGaming traffic?",
    "topBody": "Join WIND Partners and get CPA up to $80+",
    "cta": "Become a partner"
  },
  "auth": {
    "title": "Login to Wind-Demo",
    "telegram": "Continue with Telegram",
    "google": "Continue with Google",
    "telegramGate": "Subscribe to the WIND Partners Telegram channel to create your account.",
    "checkSubscription": "Check subscription"
  },
  "game": {
    "launching": "Launching demo game",
    "fallbackBalance": "Selected balance is shown in Wind-Demo. The provider uses its own demo balance.",
    "launchError": "Could not launch the game"
  }
}
```

## 17. Рекомендации по стеку

### 17.1 Frontend

- Next.js или React + Vite.
- TypeScript.
- TanStack Query для server state.
- Zustand или Redux Toolkit для лёгкого UI state.
- Tailwind CSS или CSS Modules.
- i18next или next-intl для RU/EN.

### 17.2 Backend

- Node.js + NestJS/Fastify или Next.js API routes для MVP.
- TypeScript.
- PostgreSQL.
- Prisma или Drizzle ORM.
- Redis для session/cache/rate limit.
- BullMQ или cron jobs для синхронизации агрегатора.

### 17.3 Auth

- Telegram Login Widget + backend validation.
- Google OAuth.
- HttpOnly secure cookies для session.

### 17.4 Admin

- Отдельный `/admin` route в том же frontend.
- Role-based access control.
- Audit log для критичных изменений желательно добавить после MVP.

### 17.5 Deployment

- Docker.
- PostgreSQL managed instance.
- S3-compatible storage для баннеров/обложек, если изображения загружаются вручную.
- CDN для ассетов.
- Backend secrets только через env/secret manager.

## 18. Mock JSON

### 18.1 Providers

```json
{
  "providers": [
    {
      "id": "prov_pragmatic",
      "externalId": "pragmatic",
      "name": "Pragmatic Play",
      "slug": "pragmatic-play",
      "logoUrl": "/mock/providers/pragmatic.svg",
      "active": true,
      "supportsDemoBalance": true,
      "supportsCurrency": true,
      "gameCount": 4,
      "sortOrder": 10
    },
    {
      "id": "prov_pgsoft",
      "externalId": "pgsoft",
      "name": "PG Soft",
      "slug": "pg-soft",
      "logoUrl": "/mock/providers/pgsoft.svg",
      "active": true,
      "supportsDemoBalance": false,
      "supportsCurrency": true,
      "gameCount": 3,
      "sortOrder": 20
    },
    {
      "id": "prov_spribe",
      "externalId": "spribe",
      "name": "Spribe",
      "slug": "spribe",
      "logoUrl": "/mock/providers/spribe.svg",
      "active": true,
      "supportsDemoBalance": false,
      "supportsCurrency": false,
      "gameCount": 2,
      "sortOrder": 30
    }
  ]
}
```

### 18.2 Games

```json
{
  "games": [
    {
      "id": "game_gates_demo",
      "externalId": "gates_demo",
      "slug": "gates-of-demo",
      "title": "Gates of Demo",
      "providerId": "prov_pragmatic",
      "providerName": "Pragmatic Play",
      "category": "slots",
      "imageUrl": "/mock/games/gates-of-demo.webp",
      "demoAvailable": true,
      "visible": true,
      "popular": true,
      "rtp": 96.5,
      "volatility": "high"
    },
    {
      "id": "game_sweet_wind",
      "externalId": "sweet_wind",
      "slug": "sweet-wind",
      "title": "Sweet Wind",
      "providerId": "prov_pragmatic",
      "providerName": "Pragmatic Play",
      "category": "slots",
      "imageUrl": "/mock/games/sweet-wind.webp",
      "demoAvailable": true,
      "visible": true,
      "popular": true,
      "rtp": 96.2,
      "volatility": "medium"
    },
    {
      "id": "game_mahjong_demo",
      "externalId": "mahjong_demo",
      "slug": "mahjong-demo",
      "title": "Mahjong Demo",
      "providerId": "prov_pgsoft",
      "providerName": "PG Soft",
      "category": "slots",
      "imageUrl": "/mock/games/mahjong-demo.webp",
      "demoAvailable": true,
      "visible": true,
      "popular": false,
      "rtp": 96.7,
      "volatility": "medium"
    },
    {
      "id": "game_aviator_demo",
      "externalId": "aviator_demo",
      "slug": "aviator-demo",
      "title": "Aviator Demo",
      "providerId": "prov_spribe",
      "providerName": "Spribe",
      "category": "crash",
      "imageUrl": "/mock/games/aviator-demo.webp",
      "demoAvailable": true,
      "visible": true,
      "popular": true,
      "rtp": 97.0,
      "volatility": "high"
    }
  ]
}
```

### 18.3 Banners

```json
{
  "banners": [
    {
      "id": "banner_top_ru",
      "placement": "top",
      "locale": "ru",
      "title": "Заливаешь iGaming?",
      "body": "Подключайся к WIND Partners и получай CPA до $80+",
      "imageUrl": "/mock/banners/wind-top-ru.webp",
      "ctaLabel": "Стать партнером",
      "ctaUrl": "https://partners.example.com/register?utm_source=wind-demo&utm_medium=top_banner&utm_campaign=ru",
      "active": true,
      "sortOrder": 10
    },
    {
      "id": "banner_top_en",
      "placement": "top",
      "locale": "en",
      "title": "Running iGaming traffic?",
      "body": "Join WIND Partners and get CPA up to $80+",
      "imageUrl": "/mock/banners/wind-top-en.webp",
      "ctaLabel": "Become a partner",
      "ctaUrl": "https://partners.example.com/register?utm_source=wind-demo&utm_medium=top_banner&utm_campaign=en",
      "active": true,
      "sortOrder": 10
    },
    {
      "id": "banner_inline_all",
      "placement": "inline",
      "locale": "all",
      "title": "WIND Partners",
      "body": "CPA offers for iGaming traffic teams",
      "imageUrl": "/mock/banners/wind-inline.webp",
      "ctaLabel": "Join WIND Partners",
      "ctaUrl": "https://partners.example.com/register?utm_source=wind-demo&utm_medium=inline_banner",
      "active": true,
      "sortOrder": 20
    },
    {
      "id": "banner_overlay_all",
      "placement": "overlay",
      "locale": "all",
      "title": "Scale your iGaming traffic",
      "body": "Test creatives here, send traffic with WIND Partners.",
      "imageUrl": "/mock/banners/wind-overlay.webp",
      "ctaLabel": "Join WIND Partners",
      "ctaUrl": "https://partners.example.com/register?utm_source=wind-demo&utm_medium=game_overlay",
      "active": true,
      "sortOrder": 30
    }
  ]
}
```

### 18.4 Launch response

```json
{
  "launchId": "launch_mock_001",
  "gameId": "game_gates_demo",
  "mode": "demo",
  "iframeUrl": "/mock/iframe/demo-game.html?game=gates-of-demo&currency=RUB&balance=100000",
  "balanceInjected": true,
  "currencyInjected": true,
  "expiresAt": "2026-06-29T12:30:00Z"
}
```

## 19. MVP scope

В MVP входит:

- главная страница с сеткой игр;
- RU/EN;
- search;
- provider filter;
- demo balance/currency;
- game overlay с iframe;
- mock aggregator;
- WIND Partners banners;
- Telegram/Google auth через backend stubs или реальные провайдеры при наличии ключей;
- профиль с сохранением настроек;
- админка для banners, CTA, providers, games popular/visibility;
- базовая аналитика events.

Не входит в MVP:

- реальные платежи;
- real-money wallet;
- вывод средств;
- бонусная система;
- live dealer real-money режим;
- сложная BI-аналитика.

## 20. Критерии готовности

- Пользователь может открыть сайт и увидеть плотную сетку demo-игр.
- Пользователь может искать игру и фильтровать по провайдеру.
- Пользователь может выбрать currency/demo balance.
- Клик по игре открывает overlay с iframe и loader.
- При mock mode iframe запускается без внешнего агрегатора.
- CTA WIND Partners отображаются в top, inline и overlay placements.
- Дисклеймер 18+ виден на главной и в overlay.
- Backend не отдаёт секреты агрегатора на frontend.
- Admin может менять баннеры, CTA, visibility игр и активность провайдеров.
- RU/EN тексты переключаются без перезагрузки приложения.
