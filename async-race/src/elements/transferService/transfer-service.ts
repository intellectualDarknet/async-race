import { Observer } from '../../base/observer';

class TransferService {
  public carNamingArray: string[] = [];

  public paginationPage = 1;

  public countCars = 0;

  public IdtoUpdate = 0;

  public winnersPage = 1;

  public winnersAmount = 0;

  public resultsArray: string[] = [];

  public deleteObs = new Observer();

  public updateObs = new Observer();

  public createCaseObs = new Observer();

  public resetButtonsObs = new Observer();

  public raceResetObs = new Observer();

  public toRacesResetObs = new Observer();

  public raceObs = new Observer();

  public buttonPress = new Observer();

  public isShiftPress = false;

  public isAltPress = false;

  public isCapsFlowBlocked = false;

  public isLanguageFlowBlocked = false;

  public carsArray: string[] | never[] | [] = [];

  public map = new Map();

  public defineRaceResetBtn = new Set();

  public ImgPositionNamingArray: string[] = [];
  public ImgPositionInfoArray: string[] = [];

  public defineWinnerPage() {
    this.winnersPage = 1 + Math.floor(Math.abs(this.winnersAmount - 1) / 10);
  }
}

export const transferService = new TransferService();
