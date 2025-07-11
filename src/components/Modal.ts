import { Component } from './base/Component';
import { IModal, IModalData } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Modal extends Component<IModalData> implements IModal {
    modal: HTMLElement;
    closeButton: HTMLButtonElement;
    content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.modal = container;
        this.closeButton = ensureElement('.modal__close', container) as HTMLButtonElement;
        this.content = ensureElement('.modal__content', container);

        this.closeButton.addEventListener('click', () => this.handleClose());
        this.modal.addEventListener('click', (event) => this.handleOverlayClick(event));
    }

    open(): void {
        console.log('Открываем модальное окно, добавляем класс modal_active');
        this.modal.classList.add('modal_active');
        console.log('Классы модального окна:', this.modal.className);
        this.events.emit('modal:open');
    }

    close(): void {
        this.modal.classList.remove('modal_active');
        this.content.innerHTML = '';
        this.events.emit('modal:close');
    }

    handleClose(): void {
        this.close();
    }

    handleOverlayClick(event: MouseEvent): void {
        if (event.target === this.modal) {
            this.close();
        }
    }

    render(data: IModalData): HTMLElement {
        console.log('Modal render вызван');
        this.content.innerHTML = '';
        this.content.appendChild(data.content);
        this.open();
        return this.modal;
    }
}