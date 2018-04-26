import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {map, tap} from "rxjs/operators";
import {Observable} from "rxjs/Observable";
import {ApiService} from "../api/api.service";
import {of} from "rxjs/observable/of";

@Injectable()
export class AppService {
  selectedCoinName$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private apiService: ApiService) { }

  suggestCoinNames(term): Observable<string[]> {
    if (!term.trim()) {
      return of([]);
    }

    return this.apiService.get(`suggest/coin/?term=${term}`).pipe(
      map((response) => response.data)
    );
  }

  suggestPairNames(coinName): Observable<string[]> {
    return this.apiService.get(`suggest/pairs/?name=${coinName}`).pipe(
      tap(response => console.log('suggest-pairs', response)),
      map((response) => response.data)
    );
  }

  suggestPrice(pairName): Observable<number> {
    return this.apiService.get(`suggest/price/?name=${pairName}`).pipe(
      map((response) => response.data)
    );
  }

  // getPortfolio() {
  //   return this.apiService.get('portfolio').pipe(
  //     map((response) => {
  //       const {balance, diffBalance, holdings} = response.data;
  //
  //       this.balance$.next({balance, diffBalance});
  //       this.holdings$.next(holdings);
  //     })
  //   );
  // }

  addTransaction(transaction: Transaction) {
    return this.apiService.post('transaction', transaction);
  }
}

interface Transaction {
  amount: number;
  price: number;
  status: string;
  pairName: string;
}
