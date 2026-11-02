import { CardWithImage, ICardWithImage } from "./CardWithImage";
import { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";

interface ICardPreview extends ICardWithImage {
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export class CardPreview extends CardWithImage<ICardPreview> {
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      container,
    );

    this.buttonElement.addEventListener("click", () => {
      this.events.emit("card:button");
    });
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  }
}
