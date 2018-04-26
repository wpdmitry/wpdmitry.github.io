import { Injectable } from '@angular/core';
import {ApiService} from '../api/api.service';
import {User} from '../../model/user';
import {Observable} from 'rxjs/Observable';
import {map, tap} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {of} from 'rxjs/observable/of';

@Injectable()
export class AuthService {

  redirectUrl = '/';
  user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(private api: ApiService,) {}

  getUser() {
    return this.user$.getValue();
  }

  signIn(ignInForm: SignInForm): Observable<SignResponse<User>> {
    return this.api.post('auth/sign-in', ignInForm).pipe(
      tap((response) => this.user$.next(response.data)),
      map(response => response.data),
    );
  }

  signUp(signUpForm: SignUpForm): Observable<SignResponse<User>> {
    return this.api.post('auth/sign-up', signUpForm).pipe(
      tap((response) => this.user$.next(response.data)),
      map(response => response.data),
    );
  }

  signOut() {
    return this.api.post('auth/sign-out').pipe(
      tap((response) => this.user$.next(null)),
      map(response => response.data),
    );
  }

  checkAuthorize(): Observable<boolean> {
    if (this.getUser()) {
      return of(true);
    }

    return this.api.get('auth/authentication').pipe(
      map(response => {
        if (response && response.data) {
          this.user$.next(response.data);
          return true;
        } else {
          return false;
        }
      })
    );
  }
}

interface SignResponse<T> {
  user: T;
}

interface SignUpForm {
  login: string;
  password: string;
  confirm_password: string;
}

interface SignInForm {
  login: string;
  password: string;
}


