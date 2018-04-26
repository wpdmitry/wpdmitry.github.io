import {Component, OnDestroy, OnInit} from '@angular/core';
import {PortfolioService} from "./portfolio.service";
import {WebsocketService} from "../services/websocket/websocket.service";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.less']
})
export class PortfolioComponent implements OnInit, OnDestroy {
  preloader: boolean = true;
  mode = 'indeterminate';
  value = 50;

  constructor(
    private portfolioService: PortfolioService,
    private wsService: WebsocketService
  ) {
    console.log('Constructor');
    this.portfolioService.getPortfolio()
      .subscribe(() => this.preloader = false);

    this.wsService.createWebSocket('ws://95.183.10.101:7777')
      .then((observable: Observable<string>) => {
        observable.subscribe(data => {
          const {balance, diffBalance, holdings} = JSON.parse(data);

          console.log(balance, diffBalance, holdings);

          this.portfolioService.balanceData$.next({balance, diffBalance});
          this.portfolioService.holdings$.next(holdings)
        });
      })
  }


  ngOnInit() {
    console.log('OnInit');
  }

  ngOnDestroy() {
    console.log('OnDestroy');
    this.wsService.close();
  }
}
