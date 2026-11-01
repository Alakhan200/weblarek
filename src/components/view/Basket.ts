import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

export class Basket extends Component<{ items: HTMLElement[]; total: number }> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this.listElement = container.querySelector('.basket__list') as HTMLElement;
    this.totalElement = container.querySelector('.basket__price') as HTMLElement;
    this.orderButton = container.querySelector('.basket__button') as HTMLButtonElement;

    this.orderButton.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  set items(items: HTMLElement[]) {
    if (items.length === 0) {
      this.listElement.innerHTML = '<p>Корзина пуста</p>';
      this.orderButton.disabled = true;
    } else {
      this.listElement.replaceChildren(...items);
      this.orderButton.disabled = false;
    }
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }
}