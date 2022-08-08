import { Observer } from './observer';

export class Watcher {
  constructor(public observer: Observer, public fn: (...args: any[]) => void) {}

  public subscribe(): void {
    this.observer.subscribe(this.fn);
  }

  public unsubscribe(): void {
    this.observer.unsubscribe(this.fn);
  }

  public static createAndObserve(observer: Observer, fn: (...args: any[]) => void): Watcher {
    const instance: Watcher = new Watcher(observer, fn);
    instance.observer.subscribe(instance.fn);
    return instance;
  }
}
