import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavigationComponent} from './navigation.component';
import { MatButtonModule, MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    MatIconModule,
    MatButtonModule
  ],
  declarations: [NavigationComponent],
  exports: [NavigationComponent],
})
export class NavigationModule { }
