import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IBasket {
  items: HTMLElement[];
  total: number;
  canOrder: boolean;
}

export class Basket extends Component<IBasket> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.listElement = ensureElement<HTMLElement>(".basket__list", container);
    this.totalElement = ensureElement<HTMLElement>(".basket__price", container);
    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container,
    );

    this.orderButton.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  set items(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }

  set canOrder(value: boolean) {
    this.orderButton.disabled = !value;
  }
}
