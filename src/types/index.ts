export interface Product {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number | null;
  description: string;
}

export interface ProductCatalog {
  total: number;
  items: Product[];
}

export interface OrderData {
  payment: PaymentMethod;
  address: string;
  email: string;
  phone: string;
  total: number;
  items: string[];
}

export interface OrderResult {
  id: string;
  total: number;
}

export interface ApiError {
  error: string;
}

export enum PaymentMethod {
  Online = 'online',
  Cash = 'cash'
}

export interface IProductAPI {
  getProducts(): Promise<ProductCatalog>;
  getProduct(id: string): Promise<Product>;
  submitOrder(order: OrderData): Promise<OrderResult>;
}

export interface IDeliveryForm {
  payment: PaymentMethod;
  address: string;
}

export interface IContactsForm {
  email: string;
  phone: string;
}

export interface IFormErrors {
  [key: string]: string;
}

export interface IBasketItem {
  id: string;
  title: string;
  price: number;
}

export interface IBasket {
  items: IBasketItem[];
  total: number;
  count: number;
}

export interface IProductModel {
  products: Product[];
  preview: string | null;
  basket: IBasket;
  order: Partial<OrderData>;
  loading: boolean;
  
  setCatalog(items: Product[]): void;
  setPreview(item: Product): void;
  addToBasket(item: Product): void;
  removeFromBasket(itemId: string): void;
  clearBasket(): void;
  setOrderField(field: keyof OrderData, value: string): void;
  validateOrder(): IFormErrors;
  validateContacts(): IFormErrors;
}

export interface IView {
  render(data?: object): HTMLElement;
}

export interface IModal extends IView {
  open(): void;
  close(): void;
  content: HTMLElement;
}

export interface IFormView extends IView {
  valid: boolean;
  errors: string[];
  render(state: Partial<IFormErrors> & { valid: boolean; errors: string[] }): HTMLElement;
  clear(): void;
}

export interface IPage extends IView {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

export interface ICard extends IView {
  id: string;
  title: string;
  category: string;
  image: string;
  price: string;
  description: string;
  button: string;
}

export interface IBasketView extends IView {
  items: HTMLElement[];
  total: number;
  selected: string[];
}

export interface IEvents {
  on<T extends object>(eventName: EventName, callback: (event: T) => void): void;
  emit<T extends object>(eventName: string, data?: T): void;
  trigger<T extends object>(eventName: string, context?: Partial<T>): (event: T) => void;
}

export interface IComponent {
  toggleClass(element: HTMLElement, className: string, force?: boolean): void;
  setText(element: HTMLElement, value: unknown): void;
  setDisabled(element: HTMLElement, state: boolean): void;
  setHidden(element: HTMLElement): void;
  setVisible(element: HTMLElement): void;
  setImage(element: HTMLImageElement, src: string, alt?: string): void;
  render(data?: object): HTMLElement;
}

export interface IApi {
  baseUrl: string;
  get(uri: string): Promise<object>;
  post(uri: string, data: object, method?: ApiPostMethods): Promise<object>;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type EventName = string;

export enum AppEvents {
  ITEMS_CHANGED = 'items:changed',
  CARD_SELECT = 'card:select',
  PREVIEW_CHANGED = 'preview:changed',
  BASKET_OPEN = 'basket:open',
  BASKET_CHANGED = 'basket:changed',
  BASKET_ADD = 'basket:add',
  BASKET_REMOVE = 'basket:remove',
  ORDER_OPEN = 'order:open',
  ORDER_SUBMIT = 'order:submit',
  CONTACTS_SUBMIT = 'contacts:submit',
  ORDER_READY = 'order:ready',
  FORM_ERRORS_CHANGE = 'formErrors:change',
  MODAL_OPEN = 'modal:open',
  MODAL_CLOSE = 'modal:close'
}

export interface IItemsChangedEvent {
  catalog: Product[];
}

export interface ICardSelectEvent {
  card: Product;
}

export interface IBasketChangedEvent {
  basket: IBasket;
}

export interface IOrderEvent {
  order: Partial<OrderData>;
}

export interface IFormErrorsChangeEvent {
  errors: IFormErrors;
  valid: boolean;
}

export enum ProductCategory {
  SoftSkill = 'софт-скил',
  HardSkill = 'хард-скил',
  Button = 'кнопка',
  Additional = 'дополнительно',
  Other = 'другое'
}

export interface IAppConfig {
  baseUrl: string;
  cdnUrl: string;
}

export interface IPageSelectors {
  counter: string;
  catalog: string;
  wrapper: string;
  basket: string;
}

export interface ICardSelectors {
  category: string;
  title: string;
  image: string;
  price: string;
  description: string;
  button: string;
}

export interface IBasketSelectors {
  list: string;
  total: string;
  button: string;
}

export interface IModalSelectors {
  modal: string;
  close: string;
  content: string;
}

export interface IFormSelectors {
  form: string;
  inputs: string;
  submit: string;
  errors: string;
}
