import { Injectable } from '@angular/core';
import {delay, map} from "rxjs/operators";
import { ApiService } from "../services/api/api.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class PortfolioService {
  balanceData$: BehaviorSubject<BalanceData> = new BehaviorSubject<BalanceData>({balance: 0, diffBalance: 0});
  holdings$: BehaviorSubject<Holding[]> = new BehaviorSubject<Holding[]>([]);

  constructor(private apiService: ApiService) { }

  getBalanceData() {
    return this.balanceData$.asObservable();
  }

  getHoldings() {
    return this.holdings$.asObservable();
  }

  getPortfolio() {
    return this.apiService.get('portfolio').pipe(
      map((response) => {
        const {balance, diffBalance, holdings} = response.data;
        console.log(response.data);
        this.balanceData$.next({balance, diffBalance});
        this.holdings$.next(holdings);
      }),
      delay(1000)
    );
  }
}

interface BalanceData {
  balance: number,
  diffBalance: number,
}

interface Portfolio {
  balance: number;
  diffBalance: number;
  holdings: [Holding];
}

interface Holding {
  currentPrice: number;
  totalCost: number;
  coinIcon: string;
  totalAmount: number;
  totalDiffCost: number;
  batches: [Batch];
}

interface Batch {
  price: number;
  amount: number;
  cost: number;
  diffCost: number;
}
