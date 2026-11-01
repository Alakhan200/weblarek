import { Card } from './Card';
import { EventEmitter } from '../../base/Events';
import { IProduct } from '../../../types';

export interface ICardPreview extends IProduct {
  isInBasket: boolean;
}

export class CardPreview extends Card<ICardPreview> {
  protected id: string = '';
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    
    this.descriptionElement = container.querySelector('.card__text') as HTMLElement;
    this.buttonElement = container.querySelector('.card__button') as HTMLButtonElement;

    this.buttonElement.addEventListener('click', () => {
      if (this.buttonElement.textContent === 'Удалить из корзины') {
        this.events.emit('card:remove', { id: this.id });
      } else {
        this.events.emit('card:buy', { id: this.id });
      }
    });
  }

  set productId(value: string) {
    this.id = value;
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set inBasket(value: boolean) {
    if (this.priceElement.textContent === 'Бесценно') {
      this.buttonElement.textContent = 'Недоступно';
      this.buttonElement.disabled = true;
    } else {
      this.buttonElement.disabled = false;
      this.buttonElement.textContent = value ? 'Удалить из корзины' : 'Купить';
    }
  }
}