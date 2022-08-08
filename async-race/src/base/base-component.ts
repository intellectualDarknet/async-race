import { Watcher } from './watcher';
import { Subscription } from './subscription';

export abstract class BaseComponent extends HTMLElement {
  public template: string;

  public subscriptions: Subscription[] = [];

  public watchers: Watcher[] = [];

  public isInitialized: boolean = false;

  public isDynamicallyInitiated: boolean = false;

  constructor() {
    super();
    this.init();
    this.render();
  }

  abstract init(): void;

  // tslint:disable-next-line: no-empty
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(name: string, oldValue: string, newValue: string): void {}

  // tslint:disable-next-line: no-empty
  public initHosts(): void {}

  // tslint:disable-next-line: no-empty
  public initHandlers(): void {}

  public render() {
    if (!this.template) {
      throw new Error(`template should be provided for ${this.nodeName}`);
    }
    this.innerHTML = this.template;
  }

  public connectedCallback(): void {
    this.initHosts();
    this.initHandlers();
    this.isInitialized = true;
    this.subscriptions.forEach((sub: Subscription) => sub.init());
    this.watchers.forEach((watcher: Watcher) => watcher.subscribe());
  }

  public disconnectedCallback(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.remove());
    this.watchers.forEach((watcher: Watcher) => watcher.unsubscribe());
  }

  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    if (this.isInitialized || this.isDynamicallyInitiated) {
      this.update(name, oldValue, newValue);
    }
  }
}
