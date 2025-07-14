import { Component } from './base/Component';
import { ICard, ICardActions, Product, IBasketItem } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Card extends Component<Product> implements ICard {
    id: string;
    title: HTMLElement;
    category: HTMLElement;
    image: HTMLImageElement;
    price: HTMLElement;
    description?: HTMLElement;
    button?: HTMLButtonElement;
    index?: HTMLElement;
    private cardData: Product | null = null;

    constructor(template: HTMLTemplateElement, protected events: IEvents, actions?: ICardActions) {
        super(template.content.cloneNode(true) as HTMLElement);
        
        this.title = ensureElement('.card__title', this.container);
        this.category = this.container.querySelector('.card__category') as HTMLElement;
        this.image = this.container.querySelector('.card__image') as HTMLImageElement;
        this.price = ensureElement('.card__price', this.container);
        // Необязательные элементы
        this.description = this.container.querySelector('.card__text');
        this.button = this.container.querySelector('.card__button');
        this.index = this.container.querySelector('.basket__item-index');

        const clickHandler = () => {
            console.log('Клик по карточке (универсальный обработчик)');
            this.handleClick();
        };
        this.container.addEventListener('click', clickHandler);
        Array.from(this.container.querySelectorAll('*')).forEach(el => {
            el.addEventListener('click', clickHandler);
        });
        
        if (this.button) {
            this.button.addEventListener('click', (event) => {
                event.stopPropagation();
                this.handleButtonClick();
            });
        }
    }

    setText(element: HTMLElement, value: string): void {
        if (element) {
            element.textContent = value;
        }
    }

    setImage(element: HTMLImageElement, src: string, alt?: string): void {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    setDisabled(element: HTMLElement, state: boolean): void {
        if (element) {
            if (state) {
                element.setAttribute('disabled', 'disabled');
            } else {
                element.removeAttribute('disabled');
            }
        }
    }

    setButtonText(text: string): void {
        if (this.button) {
            this.setText(this.button, text);
        }
    }

    handleClick(): void {
        console.log('handleClick вызван, cardData:', this.cardData);
        if (this.cardData) {
            console.log('Клик по карточке:', this.cardData.title);
            this.events.emit('card:select', { card: this.cardData });
        } else {
            console.log('cardData отсутствует!');
        }
    }

    handleButtonClick(): void {
        this.events.emit('card:add', { card: this });
    }

    handleDeleteClick(): void {
        this.events.emit('card:delete', { card: this });
    }

    render(data: Product): HTMLElement {
        const { id, title, category, image, price, description } = data;
        
        this.id = id;
        this.cardData = data;
        this.setText(this.title, title);
        this.setText(this.category, category);
        this.setImage(this.image, image, title);
        
        if (price === null) {
            this.setText(this.price, 'Бесценно');
            if (this.button) {
                this.setDisabled(this.button, true);
            }
        } else {
            this.setText(this.price, price + ' синапсов');
        }
        
        if (this.description && description) {
            this.setText(this.description, description);
        }

        // Устанавливаем CSS класс для категории
        const categoryClass = `card__category_${this.getCategoryClass(category)}`;
        this.category.className = `card__category ${categoryClass}`;

        return this.container;
    }

    renderBasketItem(data: IBasketItem): HTMLElement {
        this.id = data.id;
        if (this.title) this.setText(this.title, data.title);
        if (this.price) this.setText(this.price, data.price + ' синапсов');
        if (this.index) this.setText(this.index, '');
        return this.container;
    }

    private getCategoryClass(category: string): string {
        const categoryMap: { [key: string]: string } = {
            'софт-скил': 'soft',
            'хард-скил': 'hard',
            'кнопка': 'button',
            'дополнительно': 'additional',
            'другое': 'other'
        };
        return categoryMap[category] || 'other';
    }
}