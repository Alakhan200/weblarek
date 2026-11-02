import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IActions } from "../../types";

interface IOrderSuccess {
  total: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions: IActions) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      ".order-success__description",
      container,
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      container,
    );

    this.closeButton.addEventListener("click", actions.onClick);
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
