import { Component } from './base/Component';
import { IPage } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Page extends Component<object> implements IPage {
    counter: HTMLElement;
    catalog: HTMLElement;
    wrapper: HTMLElement;
    basket: HTMLButtonElement;
    locked: boolean = false;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.counter = ensureElement('.header__basket-counter', container);
        this.catalog = ensureElement('.gallery', container);
        this.wrapper = ensureElement('.page__wrapper', container);
        this.basket = ensureElement('.header__basket', container) as HTMLButtonElement;

        this.basket.addEventListener('click', () => this.handleBasketClick());
    }

    setCounter(value: number): void {
        this.setText(this.counter, value);
    }

    setCatalog(items: HTMLElement[]): void {
        this.catalog.innerHTML = '';
        items.forEach(item => this.catalog.appendChild(item));
    }

    setLocked(value: boolean): void {
        this.locked = value;
        this.toggleClass(this.wrapper, 'page__wrapper_locked', value);
    }

    handleBasketClick(): void {
        this.events.emit('basket:open');
    }

    render(data?: object): HTMLElement {
        return this.container;
    }
}