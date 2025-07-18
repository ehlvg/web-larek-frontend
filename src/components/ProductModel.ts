import { IProductModel, Product, IBasket, IBasketItem, OrderData, PaymentMethod, IFormErrors } from '../types';
import { IEvents } from './base/events';

export class ProductModel implements IProductModel {
    products: Product[] = [];
    preview: string | null = null;
    basket: IBasket = {
        items: [],
        count: 0
    };
    order: Partial<OrderData> = {};
    loading: boolean = false;
    selected: string[] = [];

    constructor(data: Partial<IProductModel>, protected events: IEvents) {
        Object.assign(this, data);
    }

    setCatalog(items: Product[]): void {
        this.products = items;
        this.events.emit('items:changed', { catalog: this.products });
    }

    setPreview(item: Product): void {
        this.preview = item.id;
        this.events.emit('preview:changed', { item });
    }

    addToBasket(item: Product): void {
        if (item.price === null) return;
        
        const basketItem: IBasketItem = {
            id: item.id,
            title: item.title,
            price: item.price
        };

        this.basket.items.push(basketItem);
        this.basket.count = this.basket.items.length;
        this.selected.push(item.id);

        this.events.emit('basket:changed', { basket: this.basket });
    }

    removeFromBasket(itemId: string): void {
        this.basket.items = this.basket.items.filter(item => item.id !== itemId);
        this.basket.count = this.basket.items.length;
        this.selected = this.selected.filter(id => id !== itemId);

        this.events.emit('basket:changed', { basket: this.basket });
    }

    clearBasket(): void {
        this.basket.items = [];
        this.basket.count = 0;
        this.selected = [];
        this.events.emit('basket:changed', { basket: this.basket });
    }

    setOrderField(field: keyof OrderData, value: string): void {
        (this.order as any)[field] = value;
        
        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    setPaymentMethod(method: PaymentMethod): void {
        this.order.payment = method;
        
        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    validateOrder(): IFormErrors {
        const errors: IFormErrors = {};

        if (!this.order.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }

        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес доставки';
        }

        this.events.emit('formErrors:change', {
            errors,
            valid: Object.keys(errors).length === 0
        });

        return errors;
    }

    validateContacts(): IFormErrors {
        const errors: IFormErrors = {};

        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.order.email)) {
            errors.email = 'Некорректный формат email';
        }

        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        } else if (!/^(\+7|8)[\d\s\-\(\)]{10,}$/.test(this.order.phone.replace(/\s/g, ''))) {
            errors.phone = 'Некорректный формат телефона';
        }

        this.events.emit('formErrors:change', {
            errors,
            valid: Object.keys(errors).length === 0
        });

        return errors;
    }

    isInBasket(itemId: string): boolean {
        return this.selected.includes(itemId);
    }

    getTotalPrice(): number {
        return this.basket.items.reduce((sum, item) => sum + item.price, 0);
    }

    getPaymentMethod(): PaymentMethod | null {
        return this.order.payment || null;
    }
}