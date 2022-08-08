export class Observer {
  private observers: ((...args: any[]) => void)[];

  constructor() {
    this.observers = [];
  }

  public subscribe(fn: (...args: any[]) => void): void {
    this.observers.push(fn);
  }

  public unsubscribe(fn: (...args: any[]) => void): void {
    this.observers = this.observers.filter((subscriber: () => void) => subscriber !== fn);
  }

  public broadcast(...args: any[]): void {
    this.observers.forEach((subscriber) => subscriber(...args));
  }
}
