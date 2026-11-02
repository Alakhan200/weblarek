import { Card, ICard } from "./Card";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";

export interface ICardWithImage extends ICard {
  category: string;
  image: string;
}

export abstract class CardWithImage<T extends ICardWithImage> extends Card<T> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as keyof typeof categoryMap],
        key === value,
      );
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value);
  }
}
