import { Watcher } from './watcher';
import { Component } from './component';
import { Subscription } from './subscription';
import { globalEventsService } from '../elements/global-events/global-events.service';

export interface RouterProps {
  baseUrl: string;
}

export interface Routes {
  [key: string]: HTMLTemplateElement;
}

export class RouterComponent extends HTMLElement {
  public props: RouterProps;

  public routes: Routes;

  public subscriptions: Subscription[] = [];

  public watchers: Watcher[] = [];

  public renderedUrl: string;

  public redirectUrl: string;

  public get url(): string {
    return window.location.hash;
  }

  public get matchUrlRegExp(): RegExp {
    return new RegExp(`\^${process.env.BASE_URL}\(\/${this.props.baseUrl}\)\?\/${this.renderedUrl}\(\/.\*\)\?\$`);
  }

  public get fullRedirectUrl(): string {
    return `\/${process.env.BASE_URL}\/${this.props.baseUrl ? this.props.baseUrl + '/' : ''}${this.redirectUrl}`;
  }

  constructor() {
    super();
    this.initSubscriptions();
    this.init();
  }

  public init(): void {
    this.props = { baseUrl: this.getAttribute('baseUrl') };
    this.routes = this.configureRoutes(Array.from(this.querySelectorAll('template')));
    this.innerHTML = '';
    this.render();
  }

  public initSubscriptions(): void {
    this.watchers.push(Watcher.createAndObserve(globalEventsService.$changeRoute, () => this.render()));
    this.subscriptions.push(Subscription.createAndInit(window, 'popstate', () => this.render()));
  }

  public render(): void {
    if (!this.matchUrlRegExp.test(this.url)) {
      this.innerHTML = '';
      this.renderedUrl = Object.keys(this.routes).find((url: string) => this.url.includes(url));
      if (this.renderedUrl) {
        this.appendChild(this.routes[this.renderedUrl].content.cloneNode(true));
      } else {
        globalEventsService.changeRoute(this.fullRedirectUrl);
      }
    }
  }

  public configureRoutes(templates: HTMLTemplateElement[]): Routes {
    const routes: Routes = {};
    templates.forEach((tpl: HTMLTemplateElement) => {
      if (tpl.dataset.redirect) {
        this.redirectUrl = tpl.dataset.url;
      }
      routes[tpl.dataset.url] = tpl;
    });
    return routes;
  }

  public disconnectedCallback(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.remove());
    this.watchers.forEach((watcher: Watcher) => watcher.unsubscribe());
  }
}
export const routerComponent: Component = new Component('app-router', RouterComponent);
