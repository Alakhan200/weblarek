import { Form } from './Form';
import { EventEmitter } from '../../base/Events';

export class ContactsForm extends Form<{ email: string; phone: string }> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container,events);

    this.emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
    this.phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;

    this.emailInput.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit('contacts.email:change', { field: 'email', value: target.value });
    });

    this.phoneInput.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      this.events.emit('contacts.phone:change', { field: 'phone', value: target.value });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
