import { Component } from './component';

export class Module {
  public components: Component[];

  constructor(components: Component[]) {
    this.components = components;
  }

  public defineComponents(): void {
    this.components.forEach((component: Component) => component.define());
  }

  public whenComponentsDefined(): Promise<CustomElementConstructor[]> {
    return Promise.all(this.components.map((component: Component) => component.whenDefined()));
  }
}
