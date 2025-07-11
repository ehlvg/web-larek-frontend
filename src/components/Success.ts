import { Component } from './base/Component';
import { ISuccessView } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export interface ISuccessData {
    total: number;
}

export class Success extends Component<ISuccessData> implements ISuccessView {
    title: HTMLElement;
    description: HTMLElement;
    close: HTMLButtonElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        super(template.content.cloneNode(true) as HTMLElement);
        
        this.title = ensureElement('.order-success__title', this.container);
        this.description = ensureElement('.order-success__description', this.container);
        this.close = ensureElement('.order-success__close', this.container) as HTMLButtonElement;

        this.close.addEventListener('click', () => this.handleClose());
    }

    handleClose(): void {
        this.events.emit('success:close');
    }

    render(data: ISuccessData): HTMLElement {
        this.setText(this.title, 'Заказ оформлен');
        this.setText(this.description, `Списано ${data.total} синапсов`);
        return this.container;
    }
}