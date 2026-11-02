import { CardWithImage, ICardWithImage } from "./CardWithImage";
import { IActions } from "../../../types";

export class CardCatalog extends CardWithImage<ICardWithImage> {
  constructor(container: HTMLElement, actions: IActions) {
    super(container);

    container.addEventListener("click", actions.onClick);
  }
}
