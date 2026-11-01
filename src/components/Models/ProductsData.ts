import { EventEmitter } from '../base/Events';
import { IProduct } from '../../types';

export class ProductsData {
  protected items: IProduct[] = [];
  protected preview: IProduct | null = null;

  constructor(protected events: EventEmitter) {}

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('products:changed');
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItem(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  setPreview(item: IProduct): void {
    this.preview = item;
    this.events.emit('preview:changed');
  }

  getPreview(): IProduct | null {
    return this.preview;
  }
}