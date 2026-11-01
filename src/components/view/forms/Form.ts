import { Component } from '../../base/Component';
import { EventEmitter } from '../../base/Events';

export class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this.submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.errorsElement = container.querySelector('.form__errors') as HTMLElement;

    this.submitButton.addEventListener('click', (event) => {
      event.preventDefault(); 
      this.events.emit('form:submit');
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}