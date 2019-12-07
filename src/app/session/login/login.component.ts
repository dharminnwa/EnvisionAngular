import { Component, OnInit } from '@angular/core';
import { Profile } from '../../../../node_modules/@types/selenium-webdriver/firefox';
import { Http, Response, RequestOptions, Headers, HttpModule } from '@angular/http';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { json } from '../../../../node_modules/@types/d3';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../services/auth.service';
import { UtilityService } from '../../services/Utility.service';
import { HttpRequestService } from '../../services/all-http-request.service';
import { LocalDataService } from '../../services/localdata.service';
import * as CryptoJS from 'crypto-js';
import { RememberMeService } from '../../services/remembermedata.service';
declare var jquery: any;
declare var $: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  //Sample Varriables
  Login;
  userName;
  password;
  public KeepmeLogin: boolean = false;
  public Invalid = false;
  public errorMsg: string = "";
  public currentYear: number = 2019;

  constructor(private http: Http,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private AuthService: AuthenticationService,
    private UtilityService: UtilityService,
    private httpService: HttpRequestService,
    private localDataService: LocalDataService,
    private rememberMeService: RememberMeService
  ) {
    var Userdata = this.localDataService.getUserData();
    if (Userdata) {
      // var Userdata = JSON.parse(this.cookieService.get('UserName'));
      // if (Userdata.KeepmeLogin == true) {
      this.router.navigateByUrl('/envision/maps');
      // }
    }
  }

  ngOnInit() {
    let rememberMeData = this.rememberMeService.getRemembermeData();
    if (rememberMeData && rememberMeData.isRememberMe) {
      this.userName = rememberMeData.UserID;
      this.password = this.rememberMeService.decryptData(rememberMeData.Pwd);
      this.KeepmeLogin = rememberMeData.isRememberMe;
    }
    this.UtilityService.closeAllPopupmodalbaseonclass();
    this.currentYear = new Date().getFullYear();
  }
  selectionChange(input: HTMLInputElement) {
    this.KeepmeLogin = input.checked;
  }
  /************ Start Node js Login Method ************/
  UserLogIn() {
    sessionStorage.clear();
    let UserProfile = {
      UserID: this.userName,
      Pwd: this.password,
      KeepmeLogin: this.KeepmeLogin,
      AutoLogOutTimeInMinutes: 35,
      LoginType: "Firsttime"
    }
    
    if (this.KeepmeLogin == true) {
      UserProfile.AutoLogOutTimeInMinutes = 168;
    }
    localStorage.clear();

    this.httpService._NodeLogin(UserProfile.UserID, UserProfile.Pwd, UserProfile.KeepmeLogin, UserProfile.LoginType, UserProfile.AutoLogOutTimeInMinutes).subscribe(data => {
      let res = JSON.stringify(data);
      let Userres = JSON.parse(res);
      let UserData = Userres.responsedata.result;
      this.SetDataincookieService(Userres, UserData);
      if (this.KeepmeLogin && UserData.IsApproved) {
        let userData = {
          isRememberMe: this.KeepmeLogin,
          UserID: this.userName,
          Pwd: this.rememberMeService.encryptData(this.password)
        }
        this.rememberMeService.setRemembermeData(userData);
      }
      else {
        if (this.rememberMeService.getRemembermeData())
          this.rememberMeService.removeRemembermeData();
      }
    }, error => {
      console.log(error);
      this.setvalue("Username or Password is Incorrect", true);
    });
  }
  /************ End Node js Login Method ************/

  UserLogIn_Test() {
    let UserProfile = {
      UserID: this.userName,
      Pwd: this.password,
      KeepmeLogin: this.KeepmeLogin,
      AutoLogOutTimeInMinutes: 35,
      LoginType: "Firsttime"
    }
    if (this.KeepmeLogin == true) {
      UserProfile.AutoLogOutTimeInMinutes = 168;

    }
    localStorage.clear();
    this.httpService.Login(UserProfile.UserID, UserProfile.Pwd, UserProfile.KeepmeLogin, UserProfile.LoginType, UserProfile.AutoLogOutTimeInMinutes).subscribe(data => {
      let res = data.json();
      let Userres = JSON.parse(res);
      let UserData = Userres.result;
      this.SetDataincookieService(Userres, UserData);
      // if (Userres.isSuccess == true) {
      //   if (UserData.IsApproved == true && UserData.IsUserLocked == false) {
      //     // 1 day -> 24 hrs
      //     // ? day -> 6 hrs
      //     // (1*6)/24 -> 0.25 i.e. 6hrs        
      //     //let min = 0.30;
      //     let min = 1;
      //     let Expiretime = (1 * min) / 24;
      //     if (this.KeepmeLogin == true) {
      //       UserData["KeepmeLogin"] = this.KeepmeLogin;
      //       min = 120;
      //     }
      //     if (UserData['SystemParameterlst']) {
      //       localStorage.clear();
      //       let SystemParameterlst = JSON.stringify(UserData['SystemParameterlst']);
      //       localStorage.setItem("SystemParameterlst", SystemParameterlst)
      //       this.AuthService.SetSystemParameter(UserData['SystemParameterlst']);
      //       UserData['SystemParameterlst'] = null;
      //     }
      //     this.cookieService.set('UserName', JSON.stringify(UserData), Expiretime);
      //     this.router.navigateByUrl('/envision/maps/google');
      //   }
      //   else if (UserData.IsApproved == false && UserData.IsUserLocked == true) {
      //     let errorMsg = "Incorrect username and/or pw and your account has been locked. Please reset your password using the Forgot Password link below.";
      //     this.setvalue(errorMsg, true);
      //   }
      //   else {
      //     // this.Invalid = true;
      //     // this.errorMsg = "Username or Password is Incorrect";
      //     this.setvalue("Username or Password is Incorrect", true);
      //   }

      // }
      // else {       
      //   this.setvalue("Username or Password is Incorrect", true);
      // }

    }, error => {
      console.log(error);
      this.setvalue("Username or Password is Incorrect", true);
    });
  }

  SetDataincookieService(Userres, UserData) {
    if (Userres.responsedata.isSuccess == true) {
      if (UserData.IsApproved == true && UserData.IsUserLocked == false) {
        //       1 day -> 24 hrs
        // ? day -> 6 hrs
        // (1*6)/24 -> 0.25 i.e. 6hrs        
        //let min = 0.30; 

        let hour = 1;
        let Expiretime = (1 * hour) / 24;
        if (this.KeepmeLogin == true) {
          UserData["KeepmeLogin"] = this.KeepmeLogin;
          hour = 120;
        }
        if (UserData['SystemParameterlst']) {
          localStorage.clear();
          let SystemParameterlst = JSON.stringify(UserData['SystemParameterlst']);
          localStorage.setItem("SystemParameterlst", SystemParameterlst)
          this.AuthService.SetSystemParameter(UserData['SystemParameterlst']);
          UserData['SystemParameterlst'] = null;
        }
        this.localDataService.setUserData(UserData);
        // this.cookieService.set('UserName', JSON.stringify(UserData), Expiretime);
        if (Userres["token"]) {
          let usertoken = Userres.token;
          this.cookieService.set('HTMLENvisionToken', usertoken);
        }
        this.router.navigateByUrl('/envision/maps');
      }
      else if (UserData.IsApproved == false && UserData.IsUserLocked == true) {
        this.Invalid = true;
        this.errorMsg = "Incorrect username and/or pw and your account has been locked. Please reset your password using the Forgot Password link below.";
      }
      else {
        this.Invalid = true;
        this.errorMsg = "Username or Password is Incorrect";
      }

    }
    else {
      this.Invalid = true;
      this.errorMsg = "Username or Password is Incorrect";
      this.cookieService.delete('UserName');
    }
  }

  setvalue(errorMsg: string, Invalid: boolean) {
    this.Invalid = Invalid;
    this.errorMsg = errorMsg;
    this.cookieService.delete('UserName');
  }
}
