import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { UserService } from "src/app/_services/user.service";
import { Router, ActivatedRoute } from "@angular/router";
import { take } from "rxjs/operators";

@Component({
  selector: "app-user-details",
  templateUrl: "./user-details.component.html",
  styleUrls: ["./user-details.component.css"],
})
export class UserDetailsComponent implements OnInit {
  List: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      this.getdetail(params);
    });
  }

  ngOnInit() {}
  getdetail(obj) {
    this.userService
      .getWebUserByid(obj)
      .pipe(take(1))
      .subscribe((res) => {
        this.List = res.result[0];

        let hearaboutus = [];
        let productTheySell = [];
        this.List["hearaboutus"].forEach((element) => {
          hearaboutus.push(element.title);
        });
        this.List["sellcategories"].forEach((element) => {
          productTheySell.push(element.categoryName);
        });

        this.List.hearaboutus = hearaboutus.toString();
        this.List.productTheySell = productTheySell.toString();
      });
  }
}
