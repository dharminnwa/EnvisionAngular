import { Component, OnInit } from '@angular/core';
import { Http, Response, RequestOptions, Headers,HttpModule  } from '@angular/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class CondensedDashboardComponent implements OnInit {
  constructor(private http:Http,private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService  ){}
    test

    
  ngOnInit() {
    if(!this.cookieService.check("UserName"))
        {
            this.router.navigateByUrl('/envision/session/login');
            return false;
        }
    // this.test=this.http
    //   .get(environment.baseUrl+"Test").subscribe(data => {
    //     console.log(data.json());
    //   });
    } 
}
