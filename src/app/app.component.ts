import { Component } from '@angular/core';
import { SocketService } from './_services/socket.service';
import { MessagingService } from './_services/messaging.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lal10admin';
  message: any;
  constructor(private socket: SocketService, private messagingService: MessagingService) {

    if (localStorage.getItem('x-id')) {
      // debugger
      const adminInfo = {
        fromId: 1
      };
      this.socket.initChat(adminInfo);
      const userId = 'user001';
      this.messagingService.requestPermission(userId);
      this.messagingService.receiveMessage();
      this.message = this.messagingService.currentMessage;
      console.log(this.message,'receeeeeeeee')
    }

  }
}
