import { App } from './app';
import 'materialize-css/sass/materialize.scss';
import './style.scss';

(async function (): Promise<void> {
  await App.init();
  App.start();
})();
