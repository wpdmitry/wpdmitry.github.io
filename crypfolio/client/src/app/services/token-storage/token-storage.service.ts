import { Injectable } from '@angular/core';

@Injectable()
export class TokenStorageService {
  private key:string = 'my_token';

  constructor() { }

  setToken(value) {
    localStorage.setItem(this.key, value);
  }

  getToken() {
    return localStorage.getItem(this.key);
  }

  removeToken() {
    localStorage.removeItem(this.key);
  }
}
