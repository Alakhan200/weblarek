import { Component } from '../base/Component';

export class Gallery extends Component<{ catalog: HTMLElement[] }> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.catalogElement = container; 
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  }
}