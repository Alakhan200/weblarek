import { Card } from './Card';
import { EventEmitter } from '../../base/Events';
import { IProduct } from '../../../types';

export class CardBasket extends Card<IProduct> {
  protected id: string = '';
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this.indexElement = container.querySelector('.basket__item-index') as HTMLElement;
    this.deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;

    this.deleteButton.addEventListener('click', () => {
      this.events.emit('card:delete', { id: this.id });
    });
  }

  set productId(value: string) {
    this.id = value;
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}