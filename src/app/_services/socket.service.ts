import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
// import { Base64 } from 'js-base64';
// import * as rncryptor from 'jscryptor';
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  //  private url = 'http://172.16.16.220:1419';
  public url: string = 'https://lal10.com:8443/';
  public socket: SocketIOClient.Socket;
  constructor() {
    this.socket = io(this.url, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });
    this.socket.on('connect_error', (data: any) => {
      console.log('server restarted', data);
    });
  }
  /*  all emitter event  */
  public initChat(message: any) {
    console.log(message);
    this.socket.emit('online', message);
  }
  public windowOn(message: any) {
    this.socket.emit('windowOn', message);
  }
  public windowOff(message: any) {
    this.socket.emit('windowOff', message);
  }
  public sendMessage(message: any) {
    this.socket.emit('sendMessage', message);
  }
  public removeListerner(val) {
    this.socket.removeListener(val);
  }
  public getMessage(message: any) {
    this.socket.emit('getMessage', message);
  }
  public readMessage(message: any) {
    this.socket.emit('readMessage', message);

  }
  public disconnect() {
    this.socket.close();
    // this.socket.emit('disconnect');
  }
  /* on event */
  receiveMessageON(): Observable<any> {
    return Observable.create((observer: { next: (arg0: any) => void; }) => {
      this.socket.on('receiveMessage', (message: any) => {
        observer.next(message);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
  blueTikON(): Observable<any> {
    return Observable.create((observer: { next: (arg0: any) => void; }) => {
      this.socket.on('blueTik', (message: any) => {
        observer.next(message);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
  getMessageON(): Observable<any> {
    return Observable.create((observer: { next: (arg0: any) => void; }) => {
      this.socket.on('getMessage', (message: any) => {
        observer.next(message);
      });
    });
  }
  receiveEnquiryChatON(): Observable<any> {
    return Observable.create((observer: { next: (arg0: any) => void; }) => {
      this.socket.on('receiveEnquiryChat', (message: any) => {
        observer.next(message);
      });
    });
  }
  receiveOrderChatON(): Observable<any> {
    return Observable.create((observer: { next: (arg0: any) => void; }) => {
      this.socket.on('receiveOrderChat', (message: any) => {
        observer.next(message);
      });
    });
  }
  receiveEnquiryListChatON(): Observable<any> {
    return Observable.create((observer: { next: (arg0: any) => void; }) => {
      this.socket.on('receiveEnquiryListChat', (message: any) => {
        observer.next(message);
      });
    });
  }
  receiveOrderListChatON(): Observable<any> {
    return Observable.create((observer: { next: (arg0: any) => void; }) => {
      this.socket.on('receiveOrderListChat', (message: any) => {
        observer.next(message);
      });
    });
  }
  readTikON(): Observable<any> {
    return Observable.create((observer: { next: (arg0: any) => void; }) => {
      this.socket.on('readTik', (message: any) => {
        observer.next(message);
      });
    });
  }
  errormessage(): Observable<any> {
    return Observable.create((observer: { next: (arg0: any) => void; }) => {
      this.socket.on('error_callback', (message: any) => {
        observer.next(message);
      });
      return () => {
        this.socket.disconnect();
      };
    });
  }
}
