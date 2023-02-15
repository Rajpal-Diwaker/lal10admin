import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { Router } from '@angular/router';
import { SocketService } from 'src/app/_services/socket.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menus: any = [];
  subadminMenu: any = [];
  constructor(private socket: SocketService, private userService: UserService, private router: Router) { }
  ngOnInit() {
    this.menus = [
      'artisan', 'products', 'newsfeed', 'onboarding'
    ];

    this.subadminMenu = localStorage.getItem('menu');
    console.log(this.subadminMenu.split(','))
    /*  1  Artisan                     1    2020-09-15 15:53:03
     2  Enquiries                   1    2020-09-15 15:53:03
     3  Generated Enquiries         1    2020-09-15 15:53:03
     4  Orders                      1    2020-09-15 15:53:03
     5  Products                    1    2020-09-15 15:53:03
     6  App CMS                     1    2020-09-15 15:53:03
     7  Website CMS                 1    2020-09-15 15:53:03
     8  Manage Listing              1    2020-09-15 15:53:03
     9  Sub Admin                   1    2020-09-15 15:53:03 */
    // "enquiries", "orders"
  }

  allow(val) {
    if (this.subadminMenu.length > 0) {
      return this.subadminMenu.indexOf(val)
    }else{
      return 1
    }

  }
  goto(uri) {
    this.router.navigateByUrl(uri);
  }
  logout() {
    console.log('this.logotu');
    let title;
    if (status) {
      title = 'Are you sure you want to activate?';
    } else { title = 'Are you sure you want to deactivate?'; }
    this.userService.confirmPopup({ confirmButtonText: 'Logout', text: '', title: 'Are you sure?' }).then(el => {
      if (el.value) {
        localStorage.removeItem('x-id');
        this.router.navigateByUrl('/login');
        this.socket.disconnect();



      }
    }).catch(error => {
      console.log('error', error);
    });
  }
}
