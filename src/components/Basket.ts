import { Component } from './base/Component';
import { IBasketView, IBasket } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Basket extends Component<IBasket> implements IBasketView {
    items: HTMLElement[] = [];
    list: HTMLElement;
    button: HTMLButtonElement;
    totalPrice: HTMLElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        super(template.content.cloneNode(true) as HTMLElement);
        
        this.list = ensureElement('.basket__list', this.container);
        this.button = ensureElement('.basket__button', this.container) as HTMLButtonElement;
        this.totalPrice = ensureElement('.basket__price', this.container);

        this.button.addEventListener('click', () => this.handleOrderClick());
    }

    setItems(items: HTMLElement[]): void {
        this.items = items;
        this.list.innerHTML = '';
        if (items.length > 0) {
            items.forEach(item => {
                this.list.appendChild(item);
            });
        } else {
            this.list.innerHTML = '<li>Корзина пуста</li>';
        }
        super.setDisabled(this.button, items.length === 0);
    }

    setTotal(total: number): void {
        this.setText(this.totalPrice, `${total} синапсов`);
    }

    setButtonDisabled(state: boolean): void {
        super.setDisabled(this.button, state);
    }

    handleOrderClick(): void {
        this.events.emit('order:open');
    }

    render(data: { items: HTMLElement[]; count: number; total: number }): HTMLElement {
        this.setItems(data.items);
        this.setTotal(data.total);
        return this.container;
    }
}