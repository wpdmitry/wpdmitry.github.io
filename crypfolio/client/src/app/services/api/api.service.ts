import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs/Observable';
// import * as queryString from 'query-string';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) { }

  private url(path) {
    return environment.host + '/api/' + path;
  }

  get(path, data = {}): Observable<any> {
    // let qs = queryString.stringify(data);
    // qs = qs ? '?' + qs : qs;
    // const url = this.url(path) + qs;

    const url = this.url(path);
    return this.http.get(url, {params: data});
  }

  post(path, data = {}): Observable<any> {
    return this.http.post(this.url(path), data);
  }
}
