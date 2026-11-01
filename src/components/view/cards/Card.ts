import { Component } from '../../base/Component';
import { categoryMap } from '../../../utils/constants';

export interface ICard {
  title: string;
  price: number | null;
}

export class Card<T extends ICard> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected categoryElement: HTMLElement | null;
  protected imageElement: HTMLImageElement | null;

  constructor(container: HTMLElement) {
    super(container);
    
    this.titleElement = container.querySelector('.card__title') as HTMLElement;
    this.priceElement = container.querySelector('.card__price') as HTMLElement;
    this.categoryElement = container.querySelector('.card__category');
    this.imageElement = container.querySelector('.card__image');
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    if (value === null) {
      this.priceElement.textContent = 'Бесценно';
    } else {
      this.priceElement.textContent = `${value} синапсов`;
    }
  }

  set category(value: string) {
    if (this.categoryElement) {
      this.categoryElement.textContent = value;
      
      this.categoryElement.className = 'card__category';
      
      const modifier = (categoryMap as Record<string, string>)[value];
      if (modifier) {
        this.categoryElement.classList.add(modifier);
      }
    }
  }

  set image(value: string) {
    if (this.imageElement) {
      this.setImage(this.imageElement, value, this.titleElement.textContent || '');
    }
  }
}