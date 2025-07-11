import { Api } from './base/api';
import { IProductAPI, Product, ProductCatalog, OrderData, OrderResult } from '../types';

export class ProductAPI extends Api implements IProductAPI {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    async getProducts(): Promise<ProductCatalog> {
        const result = await this.get('/product') as ProductCatalog;
        return {
            ...result,
            items: result.items.map(item => ({
                ...item,
                image: this.cdn + item.image
            }))
        };
    }

    async getProduct(id: string): Promise<Product> {
        const result = await this.get(`/product/${id}`) as Product;
        return {
            ...result,
            image: this.cdn + result.image
        };
    }

    async submitOrder(order: OrderData): Promise<OrderResult> {
        return await this.post('/order', order) as OrderResult;
    }
}