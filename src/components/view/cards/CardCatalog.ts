import { Card } from './Card';
import { EventEmitter } from '../../base/Events';
import { IProduct } from '../../../types';

export class CardCatalog extends Card<IProduct> {
  protected id: string = '';

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this.container.addEventListener('click', () => {
      this.events.emit('card:select', { id: this.id });
    });
  }

  set productId(value: string) {
    this.id = value;
  }
}