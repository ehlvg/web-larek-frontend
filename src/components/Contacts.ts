import { Form } from './Form';
import { IContactsView } from '../types';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export class Contacts extends Form implements IContactsView {
    email: HTMLInputElement;
    phone: HTMLInputElement;

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        const container = template.content.cloneNode(true) as HTMLFormElement;
        super(container.querySelector('form'), events);
        this.email = ensureElement<HTMLInputElement>('[name="email"]', this.form);
        this.phone = ensureElement<HTMLInputElement>('[name="phone"]', this.form);
        this.email.addEventListener('input', () => {
            this.events.emit('contacts:email-change', { email: this.email.value });
            this.events.emit('contacts:validate');
        });
        this.phone.addEventListener('input', () => {
            this.events.emit('contacts:phone-change', { phone: this.phone.value });
            this.events.emit('contacts:validate');
        });
    }

    handleSubmit(event: Event): void {
        event.preventDefault();
        this.events.emit('contacts:submit', {
            email: this.email.value,
            phone: this.phone.value
        });
    }
}