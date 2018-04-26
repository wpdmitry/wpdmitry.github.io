import { Component, OnInit } from '@angular/core';
import { tap } from "rxjs/operators";
import { PortfolioService } from "../portfolio.service";

@Component({
  selector: 'app-holdings',
  templateUrl: './holdings.component.html',
  styleUrls: ['./holdings.component.less']
})
export class HoldingsComponent implements OnInit {
  holdings$;
  panelOpenState = false;
  ws: WebSocket;

  constructor(private portfolioService: PortfolioService) { }

  ngOnInit() {
    this.holdings$ = this.portfolioService.getHoldings();
  }
}
