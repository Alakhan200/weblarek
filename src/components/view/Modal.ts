import { Component } from '../base/Component';
import { EventEmitter } from '../base/Events';

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentContainer: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);
    
    this.closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
    this.contentContainer = container.querySelector('.modal__content') as HTMLElement;

    this.closeButton.addEventListener('click', () => this.close());
    
    container.addEventListener('click', (event) => {
      if (event.target === container) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentContainer.replaceChildren(value);
  }

  open() {
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
    this.events.emit('modal:close');
  }

  render(): HTMLElement {
    return this.container;
  }
}