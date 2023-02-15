import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class MessagingService {

  currentMessage = new BehaviorSubject(null);

  constructor(
    private angularFireDB: AngularFireDatabase,
    private userService: UserService,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging) {
      this.angularFireMessaging.messaging.subscribe(
        (_messaging) => {
          _messaging.onMessage = _messaging.onMessage.bind(_messaging);
          _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
          // _messaging.onBackgroundMessage = _messaging.onBackgroundMessage.bind(_messaging);
        }
      )
  }

  /**
   * update token in firebase database
   *
   * @param userId userId as a key
   * @param token token as a value
   */
  updateToken(userId, token) {
    // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe(
      () => {
        const data = {};
        data[userId] = token;
        localStorage.setItem('browserToken', token)
        const request = { webToken: token };
        this.userService.updateToken(request).subscribe(res => {
          console.log(res);
        })

        this.angularFireDB.object('fcmTokens/').update(data)
      });
  }

  /**
   * request permission for notification from firebase cloud messaging
   *
   * @param userId userId
   */
  requestPermission(userId) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
        this.updateToken(userId, token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    console.log('receivemessgae')
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        debugger
        console.log('new message received. ', payload);
        this.currentMessage.next(payload);
      });
  }
}
