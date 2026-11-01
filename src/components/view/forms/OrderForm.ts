import { Form } from './Form';
import { EventEmitter } from '../../base/Events';

export class OrderForm extends Form<{ payment: string; address: string }> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container, events);

    this.cardButton = container.querySelector('button[name="card"]') as HTMLButtonElement;
    this.cashButton = container.querySelector('button[name="cash"]') as HTMLButtonElement;
    this.addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;

    this.cardButton.addEventListener('click', () => {
      this.events.emit('order.payment:change', { field: 'payment', value: 'card' });
    });

    this.cashButton.addEventListener('click', () => {
      this.events.emit('order.payment:change', { field: 'payment', value: 'cash' });
    });

    this.addressInput.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit('order.address:change', { field: 'address', value: target.value });
    });
  }

  set payment(value: string) {
    this.cardButton.classList.remove('button_alt-active');
    this.cashButton.classList.remove('button_alt-active');

    if (value === 'card') this.cardButton.classList.add('button_alt-active');
    if (value === 'cash') this.cashButton.classList.add('button_alt-active');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}