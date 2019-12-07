import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MapServiceService } from './map-service.service';
import { HttpRequestService } from './all-http-request.service';
import { LocalDataService } from './localdata.service';

@Injectable()
export class AuthenticationService {
    constructor(private router: Router,
        private cookieService: CookieService,
        private MapServiceService: MapServiceService,
        private httpService: HttpRequestService,
        private localDataService: LocalDataService
    ) { }



    /****************start  Node js  API Logout method  */

    public LogoutUserProfile() {   
        var UserData = this.localDataService.getUserData();
        if (UserData) {
            // var UserData = JSON.parse(this.cookieService.get('UserName'));
            if (UserData.IsApproved == true) {
                //this.DeleteTempImgData(UserData.UserGuid);
                let LoginHandlerId = UserData.LoginHandlerId;
                this.httpService._NodeLogout(LoginHandlerId, this.getLoggedinUserId()).subscribe(data => {
                    console.log('Logged Out');
                    let Userjson = JSON.stringify(data);
                    let LogoutUser = JSON.parse(Userjson);
                    if (LogoutUser.isSuccess == true) {
                        this.resirecttoLogin_ReloadthePage();
                    }
                    else {
                        this.resirecttoLogin_ReloadthePage();
                    }
                }, error => {
                    console.log(error);
                    this.resirecttoLogin_ReloadthePage();
                });
            }
            else {
                this.resirecttoLogin_ReloadthePage();
            }
        }
        else {
            this.resirecttoLogin_ReloadthePage();
        }
    }
    /****************End  Node js  API Logout method  */

    /****************start Web API Logout method  */
    public LogoutUserProfile_Test() {
        var UserData = this.localDataService.getUserData();
        if (UserData) {
            // var UserData = JSON.parse(this.cookieService.get('UserName'));
            if (UserData.IsApproved == true) {
                let LoginHandlerId = UserData.LoginHandlerId;
                this.httpService.Logout(LoginHandlerId).subscribe(data => {
                    let Userjson = data.json();
                    let LogoutUser = JSON.parse(Userjson);
                    if (LogoutUser.isSuccess == true) {
                        this.resirecttoLogin_ReloadthePage();
                    }
                    else {
                        this.resirecttoLogin_ReloadthePage();
                    }
                }, error => {
                    this.resirecttoLogin_ReloadthePage();
                });
            }
            else {
                this.resirecttoLogin_ReloadthePage();
            }
        }
        else {
            this.resirecttoLogin_ReloadthePage();
        }
    }
    /****************End Web API Logout methods */


    private resirecttoLogin() {
        this.router.navigateByUrl('/envision/session/login');
    }
    private reloadpage() {
        setTimeout(() => {
            document.location.reload();
        }, 1000);
    }
    public GetAuthTokan() {
        let Tokan = '';
        if (this.cookieService.check("HTMLENvisionToken")) {
            Tokan = this.cookieService.get('HTMLENvisionToken')
        }
        return Tokan;
    }
    public GetUserData() {
        let UserDataList;
        var UserData = this.localDataService.getUserData();
        if (UserData) {
            // let UserData = JSON.parse(this.cookieService.get('UserName'));
            if (UserData.IsApproved == true) {
                UserDataList = UserData;
            }
            else {
                this.resirecttoLogin_ReloadthePage();
            }
        }
        return UserDataList;
    }
    public GetUsername() {
        let Username = "";
        var UserData = this.localDataService.getUserData();
        if (UserData) {
            // var UserData = JSON.parse(this.cookieService.get('UserName'));
            if (UserData.IsApproved == true) {
                Username = UserData.UserName;
            }
            else {
                this.resirecttoLogin_ReloadthePage();
            }
        } else {
            this.resirecttoLogin_ReloadthePage();
        }
        return Username;
    }
    public GetMyProfileUserDetails() {
        let UserDetails = {
            UserName: '',
            DisplayName: '',
            EmailAddress: ''
        };
        var UserData = this.localDataService.getUserData();
        if (UserData) {
            // var UserData = JSON.parse(this.cookieService.get('UserName'));
            if (UserData.IsApproved == true) {
                UserDetails.UserName = UserData.UserName;
                UserDetails.DisplayName = UserData.DisplayName;
                UserDetails.EmailAddress = UserData.EMailAddress;
            }
            else {
                this.resirecttoLogin_ReloadthePage();
            }
        } else {
            this.resirecttoLogin_ReloadthePage();
        }
        return UserDetails;
    }
    public getUserId() {
        let LoginId = '';
        var UserData = this.localDataService.getUserData();
        if (UserData) {
            // var UserData = JSON.parse(this.cookieService.get('UserName'));
            if (UserData.IsApproved == true) {
                LoginId = UserData.LoginHandlerId;
            }
            else {
                this.resirecttoLogin_ReloadthePage();
            }
        } else {
            this.resirecttoLogin_ReloadthePage();
        }
        return LoginId;
    }

    public getCustomerId() {
        let CustomerId = '';
        var UserData = this.localDataService.getUserData();
        if (UserData) {
            if (UserData.IsApproved == true) {
                CustomerId = UserData.CustomerId;
            }
            else {
                this.resirecttoLogin_ReloadthePage();
            }
        } else {
            this.resirecttoLogin_ReloadthePage();
        }
        return CustomerId;
    }

    public getLoggedinUserId() {
        let LoginId = '';
        var UserData = this.localDataService.getUserData();
        if (UserData) {
            // if (this.cookieService.check("UserName")) {
            // var UserData = JSON.parse(this.cookieService.get('UserName'));
            if (UserData.IsApproved == true) {
                LoginId = UserData.UserGuid;
            }
            else {
                this.resirecttoLogin_ReloadthePage();
            }
        } else {
            this.resirecttoLogin_ReloadthePage();
        }
        return LoginId;
    }
    public SetSystemParameter(sys) {
        if (this.MapServiceService._Systemperlst.getValue() == null) {
            this.MapServiceService.setSystemParameterList(sys);
        }
        else {
            this.MapServiceService._Systemperlst.getValue().length = 0;
            Array.prototype.push.apply(this.MapServiceService._Systemperlst.getValue(), sys);
        }

    }
    public getSystemParameter() {
        let SystemParameter;
        var UserData = this.localDataService.getUserData();
        if (UserData) {
            // var UserData = JSON.parse(this.cookieService.get('UserName'));     
            if (UserData.IsApproved == true) {
                if (this.MapServiceService._SystemParameterList) {
                    if (this.MapServiceService._SystemParameterList.getValue()) {
                        SystemParameter = this.MapServiceService._SystemParameterList.getValue();
                    } else {
                        SystemParameter = JSON.parse(localStorage.getItem("SystemParameterlst"));
                    }
                }
                else {
                    this.resirecttoLogin_ReloadthePage();
                }
            }
            else {
                this.resirecttoLogin_ReloadthePage();
            }
        } else {
            this.resirecttoLogin_ReloadthePage();
        }
        return SystemParameter;
    }
    public GetSystemParameterValue(SystemParameterName) {
        let SystemParameterValue = "";
        let sys = this.getSystemParameter();
        for (let s = 0; s < sys.length; s++) {
            let p = sys[s];
            if (p.SystemParameterName == SystemParameterName) {
                SystemParameterValue = p.SystemParameterValue;
            }
        }
        return SystemParameterValue;
    }
    public resirecttoLogin_ReloadthePage() {
        this.DeleteAllObjects();
        this.resirecttoLogin();
        
        //this.reloadpage();                
    }

    public DeleteTempImgData(userId: string) {
        this.httpService._NodeDeleteGeoImageProp(userId).subscribe(x => {             
        }, error => { console.log(error); })
    }

    public DeleteAllObjects() {
        this.MapServiceService.DestroyAllObjects();
        localStorage.clear();
        //this.cookieService.deleteAll();
    }

    /*    ---------------------------     */
    /*     Comapny Users Permissions      */
    /*    ---------------------------     */

    public ShowAddDataUIBasedOnRole() {
        try {
            let userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                let Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Upload Rights") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        } catch (e) { console.log(e); this.resirecttoLogin_ReloadthePage(); }
    }

    public ShowSharedRightsUIBaedOnRole() {
        try {
            let userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                let Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Shared Rights") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        } catch (e) { console.log(e); this.resirecttoLogin_ReloadthePage(); }
    }

    public ShowCompanyIntelligenceUIBasedOnRole() {
        try {
            let userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                let Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("CompanyProfile") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        } catch (e) { console.log(e); this.resirecttoLogin_ReloadthePage(); }
    }

    public ShowPipelineActivityUIBasedOnRole() {
        try {
            let userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                let Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("PipelineActivity") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        } catch (e) { console.log(e); this.resirecttoLogin_ReloadthePage(); }
    }

    public ShowTransmissionUIBasedOnRole() {
        try {
            let userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                let Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Transmission") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        } catch (e) { console.log(e); this.resirecttoLogin_ReloadthePage(); }
    }


    public ShowPowerPlantsUIBasedOnRole() {
        try {
            let userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                let Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("PowerPlants") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        } catch (e) { console.log(e); this.resirecttoLogin_ReloadthePage(); }
    }


    public ShowGeneratingUnitUIBasedOnRole() {
        try {
            let userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                let Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("GHub") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        } catch (e) { console.log(e); this.resirecttoLogin_ReloadthePage(); }
    }

    public ShowParcelBufferToolUIBasedOnRole() {
        try {
            let userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                let Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Parcel Buffer Tool Rights") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        } catch (e) { console.log(e); this.resirecttoLogin_ReloadthePage(); }
    }

    public ShowOilAndGasUIBasedOnRole() {
        try {
            let userData = this.GetUserData();
            if (userData && userData.LayerCategoriesRoles) {
                let Roles = userData.LayerCategoriesRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Oil and Gas") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        } catch (e) { console.log(e); this.resirecttoLogin_ReloadthePage(); }
    }

    public ShowElectricPowerUIBasedOnRole() {
        try {
            let userData = this.GetUserData();
            if (userData && userData.LayerCategoriesRoles) {
                let Roles = userData.LayerCategoriesRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Electric Power") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        } catch (e) { console.log(e); this.resirecttoLogin_ReloadthePage(); }
    }

    public ShowParcelLookupWidgetUIBasedOnRole() {
        try {
            let userData = this.GetUserData();
            if (userData && userData.LayerCategoriesRoles) {
                let Roles = userData.LayerCategoriesRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Parcel Data") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        } catch (e) { console.log(e); this.resirecttoLogin_ReloadthePage(); }
    }

    public ShowWellLookupWidgetUIBasedOnRole() {
        try {
            let userData = this.GetUserData();
            if (userData && userData.LayerCategoriesRoles) {
                let Roles = userData.LayerCategoriesRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Wells") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        } catch (e) { console.log(e); this.resirecttoLogin_ReloadthePage(); }
    }

    public ShowExportDataGridRightsUIBasedOnRole() {
        try {
            let userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                let Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Export Data Grid Rights") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();

        } catch (e) {
            console.log(e); this.resirecttoLogin_ReloadthePage();
        }
    }
    public ShowRailWizardcreateLayerRightsUIBasedOnRole() {
        try {
            let userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                let Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Rail Wizard") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        } catch (e) {
            console.log(e); this.resirecttoLogin_ReloadthePage();
        }
    }
    public ShowPipelineWizardcreateLayerRightsUIBasedOnRole() {
        try {
            let userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                let Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Pipeline Wizard") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        } catch (e) {
            console.log(e); this.resirecttoLogin_ReloadthePage();
        }
    }
    public ShowSiteSelectionWizardRightsRightsUIBasedOnRole() {
        try {
            let userData = this.GetUserData();
            if (userData && userData.CustomerRoles) {
                let Roles = userData.CustomerRoles;
                if (Roles && Roles.length > 0 && Roles.indexOf("Site Selection Wizard Rights") > -1)
                    return true;
                else
                    return false;
            }
            else
                this.resirecttoLogin_ReloadthePage();
        } catch (e) {
            console.log(e); this.resirecttoLogin_ReloadthePage();
        }
    }
}
