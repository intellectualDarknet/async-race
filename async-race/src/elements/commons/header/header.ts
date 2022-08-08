import { BaseComponent } from '../../../base/base-component';
import { Component } from '../../../base/component';
import { gatherFullUrl } from '../utilities/siteway';
import { ERotes } from '../../consts-func-enum/routes/routes';
import './header.scss';
import 'materialize-css';

export class HeaderComponent extends BaseComponent {
  public count: number;

  public init() {
    this.template = `
    <header class = "header">
      <nav class = "nav-extended header__nav pink lighten-2">
        <div class="nav-wrapper container header__container">
          <ul class = "header__flex right">
            <li><a href="${gatherFullUrl(ERotes.Garage)}" class=" ">Garage</a></li>
            <li><a href="${gatherFullUrl(ERotes.Winners)}" class = "header__flex" ><span>Winners</span></a></li>
          </ul>
        </div>
      </nav>
    </header>`;
  }
}

export const headerComponent: Component = new Component('app-header', HeaderComponent);
