import { Card, ICard } from "./Card";
import { ensureElement } from "../../../utils/utils";
import { IActions } from "../../../types";

interface ICardBasket extends ICard {
  index: number;
}

export class CardBasket extends Card<ICardBasket> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: IActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      container,
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );

    this.deleteButton.addEventListener("click", actions.onClick);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
