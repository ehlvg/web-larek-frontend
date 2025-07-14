import { Form } from './Form';
import { IOrderView, PaymentMethod } from '../types';
import { IEvents } from './base/events';
import { ensureElement, ensureAllElements } from '../utils/utils';

export class Order extends Form implements IOrderView {
    paymentButtons: HTMLButtonElement[];
    address: HTMLInputElement;
    private selectedPayment: PaymentMethod | null = null;

    constructor(template: HTMLTemplateElement, protected events: IEvents) {
        const container = template.content.cloneNode(true) as HTMLFormElement;
        super(container.querySelector('form'), events);
        
        this.paymentButtons = ensureAllElements<HTMLButtonElement>('.order__buttons .button', this.form);
        this.address = ensureElement<HTMLInputElement>('[name="address"]', this.form);

        this.paymentButtons.forEach(button => {
            button.addEventListener('click', (event) => this.handlePaymentClick(event));
        });
        this.address.addEventListener('input', () => {
            this.events.emit('order:address-change', { address: this.address.value });
        });
    }

    setPaymentMethod(method: PaymentMethod): void {
        this.selectedPayment = method;
        this.paymentButtons.forEach(button => {
            const buttonMethod = button.name === 'card' ? PaymentMethod.Online : PaymentMethod.Cash;
            this.toggleClass(button, 'button_alt-active', buttonMethod === method);
        });
    }

    handlePaymentClick(event: Event): void {
        const target = event.target as HTMLButtonElement;
        const method = target.name === 'card' ? PaymentMethod.Online : PaymentMethod.Cash;
        this.setPaymentMethod(method);
        this.events.emit('order:payment-change', { payment: method });
    }

    handleSubmit(event: Event): void {
        event.preventDefault();
        this.events.emit('order:submit', {
            payment: this.selectedPayment,
            address: this.address.value
        });
    }

    clear(): void {
        super.clear();
        this.selectedPayment = null;
        this.paymentButtons.forEach(button => {
            this.toggleClass(button, 'button_alt-active', false);
        });
    }
}