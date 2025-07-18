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
    protected deleteButton?: HTMLElement;
    private cardData: Product | null = null;

    constructor(template: HTMLTemplateElement | HTMLElement, protected events: IEvents, actions?: ICardActions) {
        let container: HTMLElement;
        if (template instanceof HTMLTemplateElement) {
            const cloned = template.content.cloneNode(true) as DocumentFragment;
            container = cloned.firstElementChild as HTMLElement;
        } else {
            container = template;
        }
        super(container);

        this.title = ensureElement('.card__title', this.container);
        this.category = this.container.querySelector('.card__category') as HTMLElement;
        this.image = this.container.querySelector('.card__image') as HTMLImageElement;
        this.price = ensureElement('.card__price', this.container);
        this.description = this.container.querySelector('.card__text');
        this.button = this.container.querySelector('.card__button');
        this.index = this.container.querySelector('.basket__item-index');
        this.deleteButton = this.container.querySelector('.basket__item-delete');

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }
        
        if (this.button && actions?.onButtonClick) {
            this.button.addEventListener('click', (event) => {
                event.stopPropagation();
                actions.onButtonClick();
            });
        }

        if (this.deleteButton && actions?.onDeleteClick) {
            this.deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();
                actions.onDeleteClick();
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

    setIndexText(text: string): void {
        if (this.index) {
            this.setText(this.index, text);
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

    renderBasketItem(data: IBasketItem, itemIndex?: number): HTMLElement {
        this.id = data.id;
        this.cardData = data as Product;
        if (this.title) this.setText(this.title, data.title);
        if (this.price) this.setText(this.price, data.price + ' синапсов');
        if (this.index && itemIndex !== undefined) {
            this.setIndexText((itemIndex + 1).toString());
        }
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