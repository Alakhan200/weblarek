import { Form } from "./Form";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { IFormChange, TContactsFormData } from "../../../types";

export class ContactsForm extends Form<TContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events, "contacts:submit");

    this.emailInput = ensureElement<HTMLInputElement>(
      'input[name="email"]',
      container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      'input[name="phone"]',
      container,
    );

    this.emailInput.addEventListener("input", () => {
      this.events.emit<IFormChange>("contacts.email:change", {
        field: "email",
        value: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit<IFormChange>("contacts.phone:change", {
        field: "phone",
        value: this.phoneInput.value,
      });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
