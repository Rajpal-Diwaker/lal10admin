import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'onboarding-sidebar',
  templateUrl: './sidebar-tab.component.html',
  styleUrls: ['./sidebar-tab.component.css']
})
export class SidebarTabComponent implements OnInit {
  @Input() activeState: string;
  activeObj: any = {};
  constructor(private router: Router) { }
  ngOnInit() {
    this.activeObj[this.activeState] = true;
  }
  active(e, num, type){
    $('a').removeClass('is-active');
    $(`#a${num}`).addClass('is-active');
    this.router.navigateByUrl(type);
  }
}
