export class Component {
  public name: string;

  public element: CustomElementConstructor;

  constructor(name: string, element: CustomElementConstructor) {
    this.name = name;
    this.element = element;
  }

  public define(): void {
    window.customElements.define(this.name, this.element);
  }

  public whenDefined(): Promise<CustomElementConstructor> {
    return window.customElements.whenDefined(this.name);
  }
}
