import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {TokenStorageService} from "../token-storage/token-storage.service";

@Injectable()
export class WebsocketService {
  ws: WebSocket;

  constructor(private tokenStorageService: TokenStorageService) { }

  createWebSocket(url: string) {
    this.ws = new WebSocket(url);

    return new Promise((resolve, reject) => {
      console.log(this);
      this.ws.onopen = () => {
        console.log('Соедение установлено');
        this.ws.send(this.tokenStorageService.getToken());
      };
      this.ws.onclose = () => reject();
      this.ws.onmessage = () => resolve(this.webSocketObservable());
    });
  }

  webSocketObservable(): Observable<string> {
    return new Observable(observer => {
      this.ws.onmessage = (event) => observer.next(event.data);
      this.ws.onerror = (event) => observer.error(event);
      this.ws.onclose = () => observer.complete();
    })
  }

  close() {
    this.ws.close();
  }

  sendMessage(message) {
    console.log('Отправка сообщения');
    this.ws.send(message);
  }
}
