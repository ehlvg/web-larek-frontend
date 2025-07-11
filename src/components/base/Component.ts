import { IComponent } from "../../types";

export abstract class Component<T> implements IComponent {
    protected constructor(protected readonly container: HTMLElement) {}

    toggleClass(element: HTMLElement, className: string, force?: boolean): void {
        element.classList.toggle(className, force);
    }

    setText(element: HTMLElement, value: unknown): void {
        if (element) {
            element.textContent = String(value);
        }
    }

    setDisabled(element: HTMLElement, state: boolean): void {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }

    setHidden(element: HTMLElement): void {
        element.style.display = 'none';
    }

    setVisible(element: HTMLElement): void {
        element.style.removeProperty('display');
    }

    setImage(element: HTMLImageElement, src: string, alt?: string): void {
        if (element) {
            element.src = src;
            if (alt) {
                element.alt = alt;
            }
        }
    }

    render(data?: object): HTMLElement {
        return this.container;
    }
}