import { BaseComponent } from '../../../base/base-component';
import { Component } from '../../../base/component';
import { Subscription } from '../../../base/subscription';
import { Watcher } from '../../../base/watcher';
import { carsProducer, carXmark, SERVER_URL } from '../../consts-func-enum/constants';
import './races.scss';
import 'materialize-css';
import { transferService } from '../../transferService/transfer-service';
import { Icar, Iwinner } from '../../epams/interface';

export class RacesComponent extends BaseComponent {
  public getCarsArray: Iwinner[] | [] = [];

  public NamingArray: string[];

  public garageTitle: HTMLElement;

  public currentPage: HTMLElement;

  public color1: HTMLInputElement;

  public color2: HTMLInputElement;

  public input1: HTMLInputElement;

  public input2: HTMLInputElement;

  public updateBtn: HTMLButtonElement;

  public createBtn: HTMLButtonElement;

  public resetBtn: HTMLButtonElement;

  public raceBtn: HTMLButtonElement;

  public create100Btn: HTMLButtonElement;

  public paginationLeft: HTMLButtonElement;

  public paginationRight: HTMLButtonElement;

  public ObjToChange: Iwinner;

  public async getWinners() {
    const WinnerInfo: Response = await fetch(SERVER_URL + 'winners', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const CarsInfo = await WinnerInfo.json();
    CarsInfo.forEach((a: Icar) => transferService.carNamingArray.push(a.name));
  }

  public defineDisables() {
    if (transferService.paginationPage >= Math.ceil(transferService.countCars / 7)) {
      this.paginationRight.classList.add('disabled');
    } else {
      this.paginationRight.classList.remove('disabled');
    }
    if (transferService.paginationPage == 1) {
      this.paginationLeft.classList.add('disabled');
    } else {
      this.paginationLeft.classList.remove('disabled');
    }
  }

  public toggleRaceResetClasses() {
    this.raceBtn.classList.toggle('disabled');
    this.resetBtn.classList.toggle('disabled');
  }

  public defineRaceReset() {
    const miniarray = Array.from(transferService.defineRaceResetBtn.keys());
    console.log('carsArray', transferService.carsArray);
    console.log('miniarray', miniarray);
    console.log('set', new Set([...miniarray, ...transferService.carsArray]));
    if (new Set([...miniarray, ...transferService.carsArray]).size != miniarray.length + transferService.carsArray.length) {
      this.raceBtn.classList.add('disabled');
      this.resetBtn.classList.remove('disabled');
    } else {
      this.raceBtn.classList.remove('disabled');
      this.resetBtn.classList.add('disabled');
    }
  }

  public displayCar(response: Icar) {
    if (transferService.countCars < 7) {
      this.querySelector('.races__flex').innerHTML += `<app-singlecar data-id = "${response.id}" car-info='${JSON.stringify(
        response
      )}'></app-singlecar>`;
    }
  }

  public async getCars() {
    const cars: Response = await fetch(SERVER_URL + 'garage', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.getCarsArray = await cars.json();
    console.log(this.getCarsArray);
    const NamingArray: string[] = [];
    this.getCarsArray.forEach((a: Icar) => NamingArray.push(a.name));
    transferService.countCars = this.getCarsArray.length;
    this.garageTitle.textContent = `Garage (${transferService.countCars})`;
    this.NamingArray = NamingArray;
  }

  public async displayCars(page = 1) {
    const cars: Response = await fetch(SERVER_URL + `garage?_limit=7&_page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    transferService.carsArray = [];
    const carsArray: Iwinner[] | [] = await cars.json();
    this.querySelector('.races__flex').innerHTML = carsArray
      .map((elem) => `<app-singlecar data-id = "${elem.id}" car-info='${JSON.stringify(elem)}'></app-singlecar>`)
      .join('');
    carsArray.map((a) => transferService.carsArray.push(a.name as never));
    this.defineRaceReset();
    this.defineDisables();
  }

  public async createCar(a: string): Promise<void> {
    if (a) {
      const response: Response = await fetch(SERVER_URL + 'garage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: a,
          color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        }),
      });
      const data: Icar = await response.json();
      console.log(data);
    } else {
      const response: Response = await fetch(SERVER_URL + 'garage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.input1.value,
          color: this.color1.value,
        }),
      });
      const data = await response.json();
      this.displayCar(data);
    }
  }

  public create100cars(a: string[]) {
    const newArray: string[] = [];
    while (newArray.length < 100) {
      const f = Math.round(Math.random() * (carsProducer.length - 1));
      const b = Math.round(Math.random() * (carXmark.length - 1));
      const carName = carsProducer[f] + ' ' + carXmark[b];
      if (!a.includes(carName) && !newArray.includes(carName)) {
        newArray.push(carName);
        transferService.countCars++;
        this.createCar(carName);
        this.NamingArray = [...a, ...newArray];
      }
    }
    this.displayCars(transferService.paginationPage);
    this.garageTitle.textContent = `Garage (${transferService.countCars})`;
  }

  public async update(id: number | string): Promise<void> {
    if (id) {
      const response: Response = await fetch(SERVER_URL + 'garage' + `/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.input2.value,
          color: this.color2.value,
        }),
      });
      const data = await response.json();
      console.log('update', data);
      if (transferService.defineRaceResetBtn.has(this.ObjToChange.name)) {
        transferService.ImgPositionNamingArray[this.ObjToChange.id] = this.input2.value;
        transferService.defineRaceResetBtn.delete(this.ObjToChange.name);
        transferService.defineRaceResetBtn.add(this.input2.value);
      }
      if (transferService.carNamingArray.includes(this.ObjToChange.name)) {
        const getWinner: Response = await fetch(SERVER_URL + `winners/${this.ObjToChange.id}`, {
          method: 'GET',
        });
        const winnerInfo = await getWinner.json();

        const updateWinner: Response = await fetch(SERVER_URL + `winners/${this.ObjToChange.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: this.input2.value,
            id: this.ObjToChange.id,
            color: this.color2.value,
            wins: winnerInfo.wins,
            time: winnerInfo.time,
          }),
        });
        const updateWinnerInfo = await updateWinner.json();
        console.log(updateWinnerInfo);
      }
      this.input2.value = '';
    }
  }

  public async CreateCars(): Promise<void> {
    this.create100cars(this.NamingArray);
  }

  public template: string;

  init(): void {
    this.template = `

    <div class="addcard">
      <div class="addcard__wrapper">
        <div class="addcard__lain row">
          <div class="input-field">
            <input type="text" class = "input1" id = "input1">
            <label for="input1">New's car name</label>
          </div>

          <input type="color" name="" class="color1 s1">
          <button class = "gather btn s1">Create</button>
        </div>
    
        <div class="addcard__lain row">

          <div class="input-field">
            <input type="text" class = "input2 s3" id = 'input2' placeholder="Write here">
            <label for="input2"></label>
          </div>
          
          <input type="color" name="" class="color2 s1">
          <button class = "update btn s1">Update</button>
        </div>
    
        <div class="addcard__lain row">
          <button class = "race btn">race</button>
          <button class = "reset disabled btn">reset</button>
          <button class = "gather100 btn">Generate Cars</button>
        </div>
      </div>
    </div>

    <div class="races">


      <div class="races__wrapper">
        <h3 class = races__garage>Garage (${transferService.countCars})</h3>
        <h4 class = races__page>Page ${transferService.paginationPage}<h4>
        <div class = "races__flex">

        </div>
        <div class ="races__pagination">
          <div class = "races__wrapper-pagination">
            <button class = "btn pagination__left"><</button>
            <button class = "btn pagination__right">></button>
          </div>
        </div>
    </div>
    `;
  }

  public initHosts(): void {
    this.updateBtn = this.querySelector('.update');
    this.createBtn = this.querySelector('.gather');
    this.create100Btn = this.querySelector('.gather100');
    this.input1 = this.querySelector('.input1');
    this.input2 = this.querySelector('.input2');
    this.color1 = this.querySelector('.color1');
    this.color2 = this.querySelector('.color2');
    this.paginationLeft = this.querySelector('.pagination__left');
    this.paginationRight = this.querySelector('.pagination__right');
    this.resetBtn = this.querySelector('.reset');
    this.raceBtn = this.querySelector('.race');
    this.garageTitle = this.querySelector('.races__garage');
    this.currentPage = this.querySelector('.races__page');
  }

  public initHandlers(): void {
    this.getCars();
    this.getWinners();
    this.displayCars(transferService.paginationPage);
    this.defineDisables();
    this.subscriptions.push(
      new Subscription<MouseEvent>(this.createBtn, 'click', () => {
        transferService.countCars++;
        this.createCar(undefined);
        this.input1.value = '';
        this.color1.value = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        this.displayCars(transferService.paginationPage);
        this.defineDisables();
        this.garageTitle.textContent = `Garage (${transferService.countCars})`;
      }),

      new Subscription<MouseEvent>(this.create100Btn, 'click', () => {
        this.CreateCars();
      }),

      new Subscription<MouseEvent>(this.updateBtn, 'click', () => {
        this.update(transferService.IdtoUpdate);
        this.displayCars(transferService.paginationPage);
        transferService.IdtoUpdate = 0;
      }),

      new Subscription<MouseEvent>(this.paginationLeft, 'click', () => {
        transferService.paginationPage--;
        this.displayCars(transferService.paginationPage);
        this.currentPage.textContent = `Page ${transferService.paginationPage}`;
        this.defineDisables();
        transferService.resultsArray.pop();
      }),

      new Subscription<MouseEvent>(this.paginationRight, 'click', () => {
        transferService.paginationPage++;
        this.currentPage.textContent = `Page ${transferService.paginationPage}`;
        this.displayCars(transferService.paginationPage);
        this.defineDisables();
        transferService.resultsArray.pop();
      }),

      new Subscription<MouseEvent>(this.resetBtn, 'click', () => {
        transferService.raceResetObs.broadcast('remove');
        transferService.resetButtonsObs.broadcast();
        transferService.resultsArray.pop();
      }),

      new Subscription<MouseEvent>(this.raceBtn, 'click', () => {
        transferService.raceResetObs.broadcast('add');
        transferService.raceObs.broadcast();
      })
    );

    this.watchers.push(
      new Watcher(transferService.updateObs, (resp) => {
        this.input2.value = resp.name;
        this.color2.value = resp.color;
        transferService.IdtoUpdate = resp.id;
        this.ObjToChange = resp;
      }),
      new Watcher(transferService.deleteObs, () => {
        transferService.countCars--;
        this.garageTitle.textContent = `Garage (${transferService.countCars})`;
        this.displayCars(transferService.paginationPage);
      }),
      new Watcher(transferService.toRacesResetObs, () => {
        this.toggleRaceResetClasses();
      })
    );
  }
}
export const racesComponent: Component = new Component('app-races', RacesComponent);
