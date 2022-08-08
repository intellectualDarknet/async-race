import { Observer } from '../../base/observer';

class GlobalEventsService {
  public $changeRoute: Observer = new Observer();

  public changeRoute(url: string): void {
    window.history.pushState({}, url, window.location.origin + url);
    this.$changeRoute.broadcast();
  }
}

export const globalEventsService: GlobalEventsService = new GlobalEventsService();
