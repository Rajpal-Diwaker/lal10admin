import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { app_strings } from 'src/app/_constants/app_strings';
import * as $ from 'jquery';
import { UserService } from 'src/app/_services/user.service';
import { SocketService } from 'src/app/_services/socket.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  adminId = localStorage.getItem('x-id');
  constructor(private userService: UserService, private router: Router, private socket: SocketService) {
    const adminInfo = {
      fromId: this.adminId
    };
    // this.socket.initChat(adminInfo);
  }
  ngOnInit() {
    // [].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
    //   new SelectFx(el);
    // });
    // tslint:disable-next-line: no-unused-expression
    $('.selectpicker').selectpicker;
    // tslint:disable-next-line: only-arrow-functions
    $('.search-trigger').on('click', function (event: { preventDefault: () => void; stopPropagation: () => void; }) {
      event.preventDefault();
      event.stopPropagation();
      $('.search-trigger').parent('.header-left').addClass('open');
    });
    // tslint:disable-next-line: only-arrow-functions
    $('.search-close').on('click', function (event: { preventDefault: () => void; stopPropagation: () => void; }) {
      event.preventDefault();
      event.stopPropagation();
      $('.search-trigger').parent('.header-left').removeClass('open');
    });
    // $('.equal-height').matchHeight({
    //   property: 'max-height'
    // });
    // Counter Number
    $('.count').each(function () {
      $(this).prop('Counter', 0).animate({
        Counter: $(this).text()
      }, {
        duration: 3000,
        easing: 'swing',
        step(now: number) {
          $(this).text(Math.ceil(now));
        }
      });
    });
    // Menu Trigger
    // tslint:disable-next-line: only-arrow-functions
    $('#menuToggle').on('click', function () {
      const windowWidth = $(window).width();
      if (windowWidth < 768) {
        $('body').removeClass('open');
        if (windowWidth < 768) {
          $('#left-panel').slideToggle();
        } else {
          $('#left-panel').toggleClass('open-menu');
        }
      } else {
        $('body').toggleClass('open');
        $('#left-panel').removeClass('open-menu');
        // callthis();
      }
    });
    // function callthis(){
    //   $("body .openmenunow").on("show.bs.dropdown", function(event){
    //     $('body').toggleClass('open');
    //     $('#left-panel').removeClass('open-menu');
    //   });
    // }
    $('.menu-item-has-children.dropdown').each(function () {
      $(this).on('click', function () {
        // tslint:disable-next-line: variable-name
        const $temp_text = $(this).children('.dropdown-toggle').html();
        $(this).children('.sub-menu').prepend('<li class="subtitle">' + $temp_text + '</li>');
      });
    });
    // Load Resize
    $(window).on('load resize', function () {
      const windowWidth = $(window).width();
      if (windowWidth < 768) {
        $('body').addClass('small-device');
      } else {
        $('body').removeClass('small-device');
      }
    });
  }
  goto() {
    this.router.navigateByUrl(app_strings.HOME_ROUTE);
  }
  logout() {
    console.log('this.logotu');
    let title: string;
    if (status) {
      title = 'Are you sure you want to activate?';
    } else { title = 'Are you sure you want to deactivate?'; }
    this.userService.confirmPopup({ confirmButtonText: 'Logout', text: '', title: 'Are you sure?' }).then(el => {
      if (el.value) {
        const request = { webToken: localStorage.getItem('browserToken') };
        this.userService.removeToken(request).subscribe(Res => {
          console.log(Res);
          localStorage.removeItem('browserToken');
        })
        localStorage.removeItem('foo');
        localStorage.removeItem('browserToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('x-id');

        // localStorage.clear();
        this.socket.disconnect();
       
        this.router.navigateByUrl('/login');
       
      }
    }).catch(error => {
      console.log('error', error);
    });
  }
  ngOnDestroy() {
    // this.socket.disconnect();
  }
}
