import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.less']
})
export class SignUpComponent implements OnInit {
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
      confirm_password: '',
    });
  }

  onSubmit() {
    this.form.disable();

    this.authService.signUp(this.form.value)
      .subscribe(
        () => this.router.navigateByUrl(this.authService.redirectUrl),
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
