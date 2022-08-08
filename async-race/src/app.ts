import { routerComponent } from './base/router';
import { ERotes } from './elements/consts-func-enum/routes/routes';
import { headerComponent } from './elements/commons/header/header';
import { racesComponent } from './elements/commons/races/races';
import { singleCarComponent } from './elements/commons/signlerace/singlerace';
import { winnerComponent } from './elements/commons/winners/winners';
export class App {
  public static body: HTMLBodyElement = document.querySelector('body');
  public static render(): void {
    App.body.innerHTML = `
    <app-header></app-header>
      <app-router class="app-content purple lighten-5">
        <template data-url="${ERotes.Garage}" data-redirect="true">
          <app-races></app-races>
        </template>

        <template data-url="${ERotes.Winners}">
          <app-winner></app-winner>
        </template>
      </app-router>
    `;
  }

  public static start(): void {
    App.render();
  }

  public static async init(): Promise<void> {
    routerComponent.define();
    headerComponent.define();
    racesComponent.define();
    singleCarComponent.define();
    winnerComponent.define();
    await routerComponent.whenDefined();
    await headerComponent.whenDefined();
    await racesComponent.whenDefined();
    await singleCarComponent.whenDefined();
    await winnerComponent.whenDefined();
  }
}
