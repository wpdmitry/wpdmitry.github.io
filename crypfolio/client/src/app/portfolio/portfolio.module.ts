import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioComponent } from './portfolio.component';
import { BalanceComponent } from './balance/balance.component';
import { HoldingsComponent } from './holdings/holdings.component';
import {
  MatCardModule,
  MatExpansionModule,
  MatIconModule,
  MatListModule,
  MatProgressSpinnerModule
} from "@angular/material";
import { SignModule } from "../pipes/sign/sign.module";
import { RoudingModule } from "../pipes/rouding/rouding.module";
import { PortfolioService } from "./portfolio.service";
import { PortfolioDirective } from './portfolio.directive';
import {CustomDateModule} from "../pipes/custom-date/custom-date.module";

@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    RoudingModule,
    SignModule,
    MatProgressSpinnerModule,
    CustomDateModule
  ],
  declarations: [
    PortfolioComponent,
    BalanceComponent,
    HoldingsComponent,
    PortfolioDirective
  ],
  exports: [PortfolioComponent],
  providers: [PortfolioService]
})
export class PortfolioModule { }
