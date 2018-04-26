import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule} from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HeaderModule } from './header/header.module';
import { PortfolioModule } from "./portfolio/portfolio.module";
import { TransactionModule } from "./transaction/transaction.module";

import { ApiService } from './services/api/api.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenStorageService } from './services/token-storage/token-storage.service';
import { AuthInterceptor } from './interceptions/auth.interceptor';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth/auth.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { AppService } from "./services/app/app.service";
import {WebsocketService} from "./services/websocket/websocket.service";

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,

    HeaderModule,
    TransactionModule,
    PortfolioModule,
  ],
  providers: [
    ApiService,
    TokenStorageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthGuard,
    AuthService,
    AppService,
    WebsocketService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
