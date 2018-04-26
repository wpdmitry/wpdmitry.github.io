import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderComponent } from './header.component';
import { NavigationModule } from '../navigation/navigation.module';
import {MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {ProfileModule} from '../profile/profile.module';

@NgModule({
  imports: [
    CommonModule,
    NavigationModule,
    RouterModule,
    ProfileModule,

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
})
export class HeaderModule {}
