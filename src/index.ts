import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { ProductAPI } from './components/ProductAPI';
import { ProductModel } from './components/ProductModel';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Card } from './components/Card';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts';
import { IFormState } from './components/Form';
import { Success } from './components/Success';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Product, ICardActions, PaymentMethod } from './types';

const events = new EventEmitter();
const api = new ProductAPI(CDN_URL, API_URL);
const appModel = new ProductModel({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement('#modal-container'), events);

const cardCatalogTemplate = ensureElement('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = ensureElement('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = ensureElement('#card-basket') as HTMLTemplateElement;
const basketTemplate = ensureElement('#basket') as HTMLTemplateElement;
const orderTemplate = ensureElement('#order') as HTMLTemplateElement;
const contactsTemplate = ensureElement('#contacts') as HTMLTemplateElement;
const successTemplate = ensureElement('#success') as HTMLTemplateElement;

const basket = new Basket(basketTemplate, events);
const order = new Order(orderTemplate, events);
const contacts = new Contacts(contactsTemplate, events);
const success = new Success(successTemplate, events);

events.on('contacts:email-change', (data: { email: string }) => {
    appModel.setOrderField('email', data.email);
});
events.on('contacts:phone-change', (data: { phone: string }) => {
    appModel.setOrderField('phone', data.phone);
});

events.on('order:address-change', (data: { address: string }) => {
    appModel.setOrderField('address', data.address);
});

events.on('items:changed', (data: { catalog: Product[] }) => {
    console.log('Каталог товаров обновлен:', data.catalog.length, 'товаров');
    page.setCatalog(data.catalog.map(item => {
        const card = new Card(cardCatalogTemplate, events);
        const cardElement = card.render(item);
        cardElement.addEventListener('click', () => {
            console.log('Клик по карточке из каталога:', item.title);
            events.emit('card:select', { card: item });
        });
        return cardElement;
    }));
});

events.on('card:select', (data: { card: Product }) => {
    console.log('Карточка выбрана:', data.card);
    const card = new Card(cardPreviewTemplate, events);
    const cardElement = card.render(data.card);
    
    const button = cardElement.querySelector('.card__button');
    if (button) {
        if (data.card.price === null) {
            button.textContent = 'Недоступно';
            button.setAttribute('disabled', 'true');
        } else if (appModel.isInBasket(data.card.id)) {
            button.textContent = 'Убрать из корзины';
            button.addEventListener('click', () => {
                appModel.removeFromBasket(data.card.id);
                modal.close();
            });
        } else {
            button.textContent = 'В корзину';
            button.addEventListener('click', () => {
                appModel.addToBasket(data.card);
                modal.close();
            });
        }
    }
    
    console.log('Рендерим модальное окно с карточкой');
    modal.render({ content: cardElement });
    console.log('Модальное окно отрендерено');
});

events.on('basket:open', () => {
    console.log('Открытие корзины, товаров в корзине:', appModel.basket.items.length);
    const basketItems = appModel.basket.items.map((item, index) => {
        const card = new Card(cardBasketTemplate, events);
        const cardElement = card.renderBasketItem(item);
        const indexElement = cardElement.querySelector('.basket__item-index');
        if (indexElement) {
            indexElement.textContent = (index + 1).toString();
        }
        const deleteButton = cardElement.querySelector('.basket__item-delete');
        if (deleteButton) {
            deleteButton.addEventListener('click', () => {
                appModel.removeFromBasket(item.id);
            });
        }
        return cardElement;
    });
    modal.render({ content: basket.render({ items: basketItems, count: appModel.basket.count, total: appModel.getTotalPrice() }) });
});

events.on('basket:changed', (data: { basket: { items: any[], count: number } }) => {
    page.setCounter(data.basket.count);
    const modalContainer = document.querySelector('#modal-container.modal_active');
    if (modalContainer) {
        const modalContent = modalContainer.querySelector('.modal__content');
        if (modalContent && modalContent.querySelector('.basket')) {
        const basketItems = appModel.basket.items.map((item, index) => {
            const card = new Card(cardBasketTemplate, events);
            const cardElement = card.renderBasketItem(item);
            const indexElement = cardElement.querySelector('.basket__item-index');
            if (indexElement) {
                indexElement.textContent = (index + 1).toString();
            }
            const deleteButton = cardElement.querySelector('.basket__item-delete');
            if (deleteButton) {
                deleteButton.addEventListener('click', () => {
                    appModel.removeFromBasket(item.id);
                });
            }
            return cardElement;
        });
        modal.render({ content: basket.render({ items: basketItems, count: appModel.basket.count, total: appModel.getTotalPrice() }) });
    }
    }
});

events.on('card:add', (data: { card: any }) => {
    console.log('Добавление товара в корзину:', data);
    // Эта логика уже обрабатывается через кнопки в модальном окне
});

events.on('order:open', () => {
    modal.render({ content: order.render({ valid: false, errors: [] } as IFormState) });
});

events.on('order:payment-change', (data: { payment: PaymentMethod }) => {
    appModel.setPaymentMethod(data.payment);
});

events.on('order:submit', (data: { payment: PaymentMethod; address: string }) => {
    appModel.setOrderField('payment', data.payment);
    appModel.setOrderField('address', data.address);
    
    const errors = appModel.validateOrder();
    if (Object.keys(errors).length === 0) {
        modal.render({ content: contacts.render({ valid: false, errors: [] } as IFormState) });
    }
});

events.on('contacts:submit', (data: { email: string; phone: string }) => {
    appModel.setOrderField('email', data.email);
    appModel.setOrderField('phone', data.phone);
    const errors = appModel.validateContacts();
    if (Object.keys(errors).length === 0) {
        const orderData = {
            ...appModel.order,
            total: appModel.getTotalPrice(),
            items: appModel.basket.items.map(item => item.id)
        };
        api.submitOrder(orderData as any)
            .then(result => {
                const success = new Success(successTemplate, events);
                const successData = { total: result.total };
                modal.render({ content: success.render(successData) });
                appModel.clearBasket();
            })
            .catch(error => {
                console.error('Ошибка при оформлении заказа:', error);
            });
    }
});

events.on('success:close', () => {
    modal.close();
});

events.on('modal:open', () => {
    page.setLocked(true);
});

events.on('modal:close', () => {
    page.setLocked(false);
});

events.on('formErrors:change', (data: { errors: any; valid: boolean }) => {
    const errorMessages = Object.values(data.errors).filter(Boolean) as string[];
    const formState: IFormState = { valid: data.valid, errors: errorMessages };
    order.render(formState);
    contacts.render(formState);
});

// Инициализация приложения
console.log('Запуск приложения...');
console.log('API URL:', API_URL);
console.log('CDN URL:', CDN_URL);

api.getProducts()
    .then(catalog => {
        console.log('Товары загружены:', catalog);
        appModel.setCatalog(catalog.items);
    })
    .catch(error => {
        console.error('Ошибка при загрузке товаров:', error);
        // Показываем ошибку пользователю
        alert('Не удалось загрузить товары. Проверьте подключение к серверу.');
    });
