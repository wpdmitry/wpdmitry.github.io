import { Component, OnInit } from '@angular/core';
import {distinctUntilChanged, skip, switchMap} from "rxjs/operators";
import { Observable } from "rxjs/Observable";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppService} from "../../services/app/app.service";
import "rxjs/add/operator/skip";
import {Router} from "@angular/router";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.less']
})
export class FormComponent implements OnInit {
  activeForm = false;
  suggestPairNames$: Observable<string[]>;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      amount: ['', Validators.required],
      price: ['', Validators.required],
      pairName: ['', Validators.required],
      status: ['', Validators.required],
    });

    this.appService.selectedCoinName$
      .asObservable()
      .pipe(skip(1))
      .subscribe((coinName) => {
        this.showForm();
        this.suggestPairNames$ = this.appService.suggestPairNames(coinName);
      });
  }

  showForm() {
    this.activeForm = true;

    this.form.controls['pairName'].valueChanges.pipe(
      distinctUntilChanged(),
      switchMap((pairName: string) => this.appService.suggestPrice(pairName)),
    ).subscribe(price => this.form.controls['price'].setValue(price));
  }

  onSubmit() {
    this.form.disable();

    this.appService.addTransaction(this.form.value)
      .subscribe(
        () => this.router.navigateByUrl('/'),
        () => this.form.enable());
  }

}
