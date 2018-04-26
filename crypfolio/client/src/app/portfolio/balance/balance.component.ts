import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {PortfolioService} from "../portfolio.service";

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.less']
})
export class BalanceComponent implements OnInit {
  balance: number = 0;
  diffBalance: number = 0;

  constructor(private portfolioService: PortfolioService) { }

  ngOnInit() {
    this.portfolioService.getBalanceData()
      .subscribe((data) => {
        this.balance = data.balance;
        this.diffBalance = data.diffBalance;
      });
  }
}
