import { IProduct } from '../../types';

export class BasketData {
  protected items: IProduct[] = [];

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
  }

  removeItem(item: IProduct): void {
    this.items = this.items.filter((i) => i.id !== item.id);
  }

  clear(): void {
    this.items = [];
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getQuantity(): number {
    return this.items.length;
  }

  contains(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}