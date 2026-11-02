import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

interface IFormState {
  valid: boolean;
  errors: string;
}

export abstract class Form<T> extends Component<T & IFormState> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
    submitEvent: string,
  ) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container,
    );
    this.errorsElement = ensureElement<HTMLElement>(".form__errors", container);

    container.addEventListener("submit", (event) => {
      event.preventDefault();
      this.events.emit(submitEvent);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
