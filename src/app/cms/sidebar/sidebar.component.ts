import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'cms-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
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
