import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentContainer: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container,
    );
    this.contentContainer = ensureElement<HTMLElement>(
      ".modal__content",
      container,
    );

    this.closeButton.addEventListener("click", () => this.close());

    container.addEventListener("click", (event) => {
      if (event.target === container) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentContainer.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
  }
}
