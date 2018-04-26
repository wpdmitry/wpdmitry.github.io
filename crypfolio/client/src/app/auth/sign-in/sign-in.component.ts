import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.less']
})
export class SignInComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      login: '',
      password: '',
    });
  }

  onSubmit() {
    this.form.disable();

    this.authService.signIn(this.form.value)
      .subscribe(
        (user) => this.router.navigateByUrl(this.authService.redirectUrl),
        ({error}) => {
          this.form.enable();

          const errorMessages = error['errors'];
          Object.entries(errorMessages).forEach(([key, messages]) => {
            this.form.get(key).setErrors(messages);
          });
        }
      );
  }
}
