import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import {TokenStorageService} from '../services/token-storage/token-storage.service';
import {User} from '../model/user';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenStorage.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        }
      });
    }

    return next.handle(req).pipe(
      tap(
        (response: HttpResponse<AuthResponse>) => {
          try {
            const newToken = response.body.data.token;

            if (newToken) {
              this.tokenStorage.setToken(newToken);
            }

          } catch (e) {}
        },
        (error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.tokenStorage.removeToken();
            this.router.navigateByUrl('auth');
          }
        },
      ),
    );
  }
}

interface AuthResponse {
  error: string | null;
  data: User | null;
}
