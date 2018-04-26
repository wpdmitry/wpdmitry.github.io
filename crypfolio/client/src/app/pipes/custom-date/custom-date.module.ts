import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {CustomDatePipe} from "./custom-date.pipe";

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [CustomDatePipe],
  exports: [CustomDatePipe],
})
export class CustomDateModule { }
