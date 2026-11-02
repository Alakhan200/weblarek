import { IEvents } from "../base/Events";
import { IProduct } from "../../types";

export class BasketData {
  protected items: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
    this.events.emit("basket:changed");
  }

  removeItem(item: IProduct): void {
    this.items = this.items.filter((i) => i.id !== item.id);
    this.events.emit("basket:changed");
  }

  clear(): void {
    this.items = [];
    this.events.emit("basket:changed");
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price || 0), 0);
  }

  getQuantity(): number {
    return this.items.length;
  }

  contains(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
