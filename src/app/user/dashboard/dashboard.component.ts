import { Component, OnInit } from '@angular/core';
import { Label } from 'ng2-charts';
import { UserService } from 'src/app/_services/user.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: Array<object> = [{}];
  public barChartOptions: any = {
    responsive: true,
       scales: {
      xAxes: [{
        maxBarThickness: 70,
      }],
    },
  };
  public barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: any = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Craft' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Product' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Material' }
  ];
  dashboardData: any = [];
  constructor(private userService: UserService,
 
    ) { }

  ngOnInit() {
    if (!localStorage.getItem('foo')) {
      localStorage.setItem('foo', 'no reload')
      location.reload()
    } else {
      // localStorage.removeItem('foo')
    }
       
    this.stats = [
      {title: 'Total Artisan', stat: 0},
      {title: 'Total Enquiries', stat: 0},
      {title: 'Total Orders', stat: 0},
      {title: 'Total Shop products', stat: 0},
      {title: 'Total Live products', stat: 0},
    ];
    this.dashboard();
   
  }

  dashboard(){
    this.userService.dashboard()
     .pipe(take(1))
     .subscribe(res => {
        this.dashboardData = res.result;
        this.stats = [
          {title: 'Total Artisan', stat: this.dashboardData.artisan},
          {title: 'Total Enquiries', stat:this.dashboardData.enquiry},
          {title: 'Total Orders', stat:this.dashboardData.order},
          {title: 'Total Shop products', stat:this.dashboardData.product},
          {title: 'Total Live products', stat:this.dashboardData.shop},
        ];

        this.barChartData=this.dashboardData.barData;
        this.barChartLabels=this.dashboardData.barLabel;
     });
  }

}
