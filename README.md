# Проектная работа "Веб-ларек"

Интернет-магазин с товарами для веб-разработчиков, реализованный с использованием MVP-архитектуры.

## Используемый стек

- **HTML** — разметка страниц
- **SCSS** — стилизация и верстка
- **TypeScript** — логика приложения
- **Webpack** — сборка проекта

## Инструкция по сборке и запуску

Для установки зависимостей:

```bash
npm install
# или
yarn
```

Для запуска в режиме разработки:

```bash
npm run start
# или
yarn start
```

Для сборки продакшн-версии:

```bash
npm run build
# или
yarn build
```

## Архитектура проекта

Проект построен по **MVP (Model-View-Presenter)** паттерну с использованием событийной архитектуры.

### Основные части архитектуры:

1. **Модель (Model)** — отвечает за работу с данными, их обработку и валидацию
2. **Представление (View)** — отвечает за отображение данных и взаимодействие с пользователем
3. **Презентер (Presenter)** — связывает модель и представления через события
4. **Брокер событий (Event Broker)** — обеспечивает слабое связывание компонентов

### Взаимодействие компонентов:

- **View** сообщает о действиях пользователя через события
- **Presenter** обрабатывает события и обновляет Модель
- **Model** сообщает об изменениях через события
- **View** обновляется в ответ на события от Модели

## Описание базовых классов

### EventEmitter
Класс `EventEmitter` обеспечивает работу с событиями. Его функции: возможность установить и снять слушателей событий, вызвать слушателей при возникновении события.

**Конструктор:** `new EventEmitter()`

**Методы:**
- `on<T extends object>(eventName: EventName, callback: (event: T) => void): void` — подписывается на событие
- `emit<T extends object>(eventName: string, data?: T): void` — генерирует событие
- `trigger<T extends object>(eventName: string, context?: Partial<T>): (event: T) => void` — создает триггер события

### Component
Класс `Component` является базовым для всех компонентов слоя представления (View). Он предоставляет общие методы для работы с DOM-элементами и отрисовки.

**Конструктор:** `new Component(container: HTMLElement)`

**Поля:**
- `container: HTMLElement` — корневой DOM-элемент компонента

**Методы:**
- `toggleClass(element: HTMLElement, className: string, force?: boolean): void` — переключает CSS-класс элемента
- `setText(element: HTMLElement, value: unknown): void` — устанавливает текст элемента
- `setDisabled(element: HTMLElement, state: boolean): void` — устанавливает состояние блокировки элемента
- `setHidden(element: HTMLElement): void` — скрывает элемент
- `setVisible(element: HTMLElement): void` — показывает элемент
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` — устанавливает изображение
- `render(data?: object): HTMLElement` — возвращает подготовленный HTML-элемент-контейнер

### Api
Класс `Api` обеспечивает работу с внешним API. Его функции: выполнение HTTP-запросов, обработка ошибок, преобразование данных.

**Конструктор:** `new Api(baseUrl: string, options?: RequestInit)`

**Поля:**
- `baseUrl: string` — базовый URL API

**Методы:**
- `get(uri: string): Promise<object>` — выполняет GET-запрос
- `post(uri: string, data: object, method?: ApiPostMethods): Promise<object>` — выполняет POST/PUT/DELETE-запрос
- `handleResponse(response: Response): Promise<object>` — обрабатывает ответ сервера

### Model
Класс `Model` является базовым для моделей данных. Он обеспечивает взаимодействие с событиями и управление состоянием.

**Конструктор:** `new Model(data: Partial<T>, events: IEvents)`

**Поля:**
- `events: IEvents` — экземпляр EventEmitter для работы с событиями

**Методы:**
- `emitChanges(event: string, payload?: object): void` — генерирует событие об изменении данных

### ProductModel
Класс `ProductModel` управляет данными приложения: каталогом товаров, корзиной, заказом.

**Конструктор:** `new ProductModel(data: Partial<IProductModel>, events: IEvents)`

**Поля:**
- `products: Product[]` — массив товаров каталога
- `preview: string | null` — ID товара для предпросмотра
- `basket: IBasket` — состояние корзины
- `order: Partial<OrderData>` — данные заказа
- `loading: boolean` — индикатор загрузки
- `selected: string[]` — массив ID выбранных товаров

**Методы:**
- `setCatalog(items: Product[]): void` — устанавливает каталог товаров
- `setPreview(item: Product): void` — устанавливает товар для предпросмотра
- `addToBasket(item: Product): void` — добавляет товар в корзину
- `removeFromBasket(itemId: string): void` — удаляет товар из корзины
- `clearBasket(): void` — очищает корзину
- `setOrderField(field: keyof OrderData, value: string): void` — устанавливает поле заказа
- `validateOrder(): IFormErrors` — валидирует данные заказа
- `validateContacts(): IFormErrors` — валидирует контактные данные
- `isInBasket(itemId: string): boolean` — проверяет, есть ли товар в корзине
- `getTotalPrice(): number` — рассчитывает и возвращает общую стоимость корзины
- `setPaymentMethod(method: PaymentMethod): void` — устанавливает способ оплаты
- `getPaymentMethod(): PaymentMethod | null` — возвращает выбранный способ оплаты

## Описание компонентов

### Page
Компонент `Page` отвечает за отображение главной страницы. Он управляет отображением каталога товаров, счетчиком корзины и блокировкой страницы при открытии модальных окон.

**Конструктор:** `new Page(container: HTMLElement, events: IEvents)`

**Поля:**
- `counter: HTMLElement` — элемент счетчика товаров в корзине
- `catalog: HTMLElement` — контейнер каталога товаров
- `wrapper: HTMLElement` — обертка страницы
- `basket: HTMLButtonElement` — кнопка корзины
- `locked: boolean` — состояние блокировки страницы

**Методы:**
- `setCounter(value: number): void` — устанавливает значение счетчика
- `setCatalog(items: HTMLElement[]): void` — отображает каталог товаров
- `setLocked(value: boolean): void` — блокирует/разблокирует страницу
- `handleBasketClick(): void` — обработчик клика по кнопке корзины

### Card
Компонент `Card` отображает карточку товара. Он может использоваться как в каталоге, так и в превью товара, а также в корзине. Создаётся экземпляр карточки и возвращается как HTML-элемент для вставки в разметку. Обрабатывает клики по карточке и кнопкам.

**Конструктор:** `new Card(template: HTMLTemplateElement, events: IEvents, actions?: ICardActions)`

**Поля:**
- `id: string` — идентификатор товара
- `title: HTMLElement` — элемент названия товара
- `category?: HTMLElement` — элемент категории товара
- `image?: HTMLImageElement` — элемент изображения товара
- `price: HTMLElement` — элемент цены товара
- `description?: HTMLElement` — элемент описания (для превью)
- `button?: HTMLButtonElement` — кнопка действия
- `index?: HTMLElement` — индекс товара (для корзины)

**Методы:**
- `setText(element: HTMLElement, value: string): void` — устанавливает текст элемента
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` — устанавливает изображение
- `setDisabled(element: HTMLElement, state: boolean): void` — блокирует/разблокирует элемент
- `setButtonText(text: string): void` — устанавливает текст кнопки

### Basket
Компонент `Basket` отображает содержимое корзины покупок. Он показывает список товаров, общую стоимость и кнопку "Оформить" для перехода к оформлению заказа.

**Конструктор:** `new Basket(template: HTMLTemplateElement, events: IEvents)`

**Поля:**
- `items: HTMLElement[]` — массив элементов товаров
- `list: HTMLElement` — контейнер списка товаров
- `button: HTMLButtonElement` — кнопка "Оформить"
- `totalPrice: HTMLElement` — элемент отображения общей стоимости

**Методы:**
- `setItems(items: HTMLElement[]): void` — устанавливает список товаров
- `setTotal(total: number): void` — устанавливает общую стоимость
- `setDisabled(state: boolean): void` — блокирует/разблокирует кнопку оформления
- `handleOrderClick(): void` — обработчик клика по кнопке "Оформить"

### Modal
Компонент `Modal` обеспечивает отображение модальных окон. Он может отображать любой контент и обрабатывает закрытие окна.

**Конструктор:** `new Modal(container: HTMLElement, events: IEvents)`

**Поля:**
- `modal: HTMLElement` — корневой элемент модального окна
- `closeButton: HTMLButtonElement` — кнопка закрытия модального окна
- `content: HTMLElement` — контейнер содержимого модального окна

**Методы:**
- `open(): void` — открывает модальное окно
- `close(): void` — закрывает модальное окно
- `render(data: IModalData): HTMLElement` — отрисовывает модальное окно с контентом
- `handleClose(): void` — обработчик закрытия модального окна
- `handleOverlayClick(event: MouseEvent): void` — обработчик клика по фону модального окна

### Form
Компонент `Form` является базовым для всех форм приложения. Он отображает данные формы, сообщения об ошибках и состояние кнопки отправки. Валидация полей происходит в модели данных через презентер.

**Конструктор:** `new Form(container: HTMLFormElement, events: IEvents)`

**Поля:**
- `form: HTMLFormElement` — элемент формы
- `inputs: HTMLInputElement[]` — массив полей ввода
- `submit: HTMLButtonElement` — кнопка отправки формы
- `errors: HTMLElement` — элемент для отображения ошибок

**Методы:**
- `setValid(isValid: boolean): void` — устанавливает состояние валидности
- `setErrors(errors: string[]): void` — отображает ошибки валидации
- `onInputChange(field: string, value: string): void` — обрабатывает изменение полей ввода
- `clear(): void` — очищает форму
- `render(state: Partial<IFormErrors> & { valid: boolean; errors: string[] }): HTMLElement` — отрисовывает форму
- `handleSubmit(event: Event): void` — обработчик отправки формы
- `handleInput(event: Event): void` — обработчик ввода в поля формы

### Order
Компонент `Order` отображает форму оформления заказа. Он наследуется от `Form` и добавляет специфическую логику для выбора способа оплаты и ввода адреса.

**Конструктор:** `new Order(template: HTMLTemplateElement, events: IEvents)`

**Поля (наследует от Form + дополнительные):**
- `paymentButtons: HTMLButtonElement[]` — кнопки выбора способа оплаты
- `address: HTMLInputElement` — поле ввода адреса доставки

**Методы (наследует от Form + дополнительные):**
- `setPaymentMethod(method: PaymentMethod): void` — устанавливает способ оплаты
- `handlePaymentClick(event: Event): void` — обработчик клика по кнопкам способа оплаты

### Contacts
Компонент `Contacts` отображает форму ввода контактных данных. Он наследуется от `Form` и предоставляет поля для ввода email и телефона.

**Конструктор:** `new Contacts(template: HTMLTemplateElement, events: IEvents)`

**Поля (наследует от Form + дополнительные):**
- `email: HTMLInputElement` — поле ввода email
- `phone: HTMLInputElement` — поле ввода телефона

### Success
Компонент `Success` отображает сообщение об успешном оформлении заказа. Он показывает итоговую стоимость заказа и обрабатывает закрытие окна.

**Конструктор:** `new Success(template: HTMLTemplateElement, events: IEvents)`

**Поля:**
- `title: HTMLElement` — заголовок сообщения
- `description: HTMLElement` — описание с суммой заказа
- `close: HTMLButtonElement` — кнопка закрытия

**Методы:**
- `handleClose(): void` — обработчик закрытия окна успеха

## Данные приложения

### Product
Тип данных интерфейс `Product` описывает структуру товара:
- `id` — уникальный идентификатор
- `title` — название товара
- `category` — категория товара
- `image` — URL изображения товара
- `price` — цена товара (может быть null для бесценных товаров)
- `description` — описание товара

### OrderData
Интерфейс `OrderData` описывает данные заказа:
- `payment` — способ оплаты
- `address` — адрес доставки
- `email` — электронная почта
- `phone` — телефон
- `total` — общая стоимость
- `items` — массив ID товаров

### IBasket
Интерфейс `IBasket` описывает состояние корзины:
- `items` — массив товаров в корзине
- `count` — количество товаров

_Примечание: Общая стоимость рассчитывается динамически методом `getTotalPrice()` модели данных._

## Процессы приложения

Все процессы в приложении реализованы через события. Основные события:

- `ITEMS_CHANGED` — изменение каталога товаров
- `CARD_SELECT` — выбор товара для просмотра
- `BASKET_CHANGED` — изменение содержимого корзины
- `ORDER_SUBMIT` — оформление заказа
- `MODAL_OPEN`/`MODAL_CLOSE` — открытие/закрытие модальных окон

### Поток оформления заказа:

1. Пользователь добавляет товары в корзину
2. Открывает корзину и нажимает "Оформить"
3. Заполняет форму доставки (способ оплаты, адрес)
4. Заполняет контактные данные (email, телефон)
5. Нажимает "Оплатить"
6. Получает подтверждение заказа

## Структура проекта

- `src/` — исходные файлы проекта
- `src/components/` — компоненты приложения
- `src/components/base/` — базовые классы
- `src/types/` — типы данных TypeScript
- `src/utils/` — вспомогательные функции и константы
- `src/scss/` — стили приложения
- `src/pages/index.html` — HTML-шаблон страницы
- `src/index.ts` — точка входа приложения

### Важные файлы:

- `src/types/index.ts` — определения всех типов данных
- `src/components/base/events.ts` — базовый класс для работы с событиями
- `src/components/base/api.ts` — базовый класс для работы с API
- `src/utils/constants.ts` — константы приложения
- `src/utils/utils.ts` — вспомогательные функции
- `src/scss/styles.scss` — корневой файл стилей