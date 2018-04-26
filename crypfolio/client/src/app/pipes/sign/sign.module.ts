import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SignPipe} from './sign.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SignPipe],
  exports: [SignPipe],
})
export class SignModule { }
