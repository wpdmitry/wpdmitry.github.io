import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatInputModule, MatTabsModule } from '@angular/material';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRoutingModule,

    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatTabsModule,
    MatCardModule,
  ],
  declarations: [AuthComponent, SignInComponent, SignUpComponent],
  exports: [AuthComponent]
})
export class AuthModule { }
