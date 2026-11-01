import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

interface IHeader {
  counter: number;
}

export class Header extends Component<IHeader> {
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    
    this.basketButton = container.querySelector('.header__basket') as HTMLButtonElement;
    this.counterElement = container.querySelector('.header__basket-counter') as HTMLElement;

    this.basketButton.addEventListener('click', () => {
      this.events.emit('basket:open');
    });
  }

  set counter(value: number) {
    this.counterElement.textContent = String(value);
  }

  render(): HTMLElement {
    return this.container;
  }
}