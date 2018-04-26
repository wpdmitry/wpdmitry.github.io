import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoudingPipe } from './rouding.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [RoudingPipe],
  exports: [RoudingPipe]
})
export class RoudingModule { }
