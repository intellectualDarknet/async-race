export class Subscription<T = Event> {
  public host: HTMLElement | Element | Window | Document;

  public type: string;

  public eventFunction: () => void;

  public capture: boolean;

  constructor(host: HTMLElement | Element | Window | Document, type: string, eventFunction: (event?: T) => void, capture: boolean = false) {
    this.host = host;
    this.type = type;
    this.eventFunction = eventFunction;
    this.capture = capture;
  }

  public init(): void {
    this.host.addEventListener(this.type, this.eventFunction, this.capture);
  }

  public remove(): void {
    this.host.removeEventListener(this.type, this.eventFunction);
  }

  public static createAndInit<T = Event>(
    host: HTMLElement | Window | Document,
    type: string,
    eventFunction: (event?: T) => void,
    capture: boolean = false
  ): Subscription<T> {
    const instance: Subscription<T> = new Subscription<T>(host, type, eventFunction, capture);
    instance.init();
    return instance;
  }
}
