import { Component, OnInit } from '@angular/core';
import {debounceTime, distinctUntilChanged, switchMap, tap} from "rxjs/operators";
import {Observable} from "rxjs/Observable";
import {FormControl} from "@angular/forms";
import {AppService} from "../../services/app/app.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less']
})
export class SearchComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  suggestCoinNames$: Observable<string[]>;

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.suggestCoinNames$ = this.searchControl.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(),
        switchMap((term: string) => this.appService.suggestCoinNames(term)),
      );
  }

  onSelect(coinName) {
    this.appService.selectedCoinName$.next(coinName);
  }
}
