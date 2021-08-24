import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  socket: any;
  uri = environment.apiUrl;// enviroment wird während docker-compose gebildet
   //uri = 'http://localhost:3000'
  //uri = 'wss://sqhelper.com:8090'; // 8090 = sqhelper leitet auf lokalen Port 5000 || 8080 Sqlesson leitet auf lokalen Port 3000
  constructor() {
    this.socket = io(this.uri, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      query: { temp_user_id: window.localStorage.getItem('temp_user_id') },
    });
  }

  listen(eventname: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventname, (data) => {
        subscriber.next(data);
      });
    });
  }
  emit(eventname: string, data: any) {
    this.socket.emit(eventname, data);
  }
}
