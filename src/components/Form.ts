import { Component } from './base/Component';
import { IFormView, IFormErrors } from '../types';
import { IEvents } from './base/events';
import { ensureElement, ensureAllElements } from '../utils/utils';

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export class Form extends Component<object> implements IFormView {
    form: HTMLFormElement;
    inputs: HTMLInputElement[];
    submit: HTMLButtonElement;
    errors: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);
        
        this.form = container;
        this.inputs = ensureAllElements<HTMLInputElement>('.form__input', this.form);
        this.submit = ensureElement('.button[type=submit]', this.form) as HTMLButtonElement;
        this.errors = ensureElement('.form__errors', this.form);

        this.form.addEventListener('submit', (event) => this.handleSubmit(event));
        this.inputs.forEach(input => {
            input.addEventListener('input', (event) => this.handleInput(event));
        });
    }

    render(state: IFormState): HTMLElement {
        const { valid, errors } = state;
        this.setValid(valid);
        this.setErrors(errors);
        return this.form;
    }

    clear(): void {
        this.form.reset();
        this.setValid(false);
        this.setErrors([]);
    }

    setValid(isValid: boolean): void {
        this.setDisabled(this.submit, !isValid);
    }

    setErrors(errors: string[]): void {
        this.setText(this.errors, errors.join(', '));
    }

    onInputChange(field: string, value: string): void {
        this.events.emit('input:change', { field, value });
    }

    handleSubmit(event: Event): void {
        event.preventDefault();
        this.events.emit('form:submit');
    }

    handleInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.onInputChange(target.name, target.value);
    }
}