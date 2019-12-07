import { Component, OnInit, ViewChild } from '@angular/core';
import { MapServiceService } from '../../../../services/map-service.service';
import { BaseMapService } from '../../../../services/base-map.service';
import { BsModalRef } from 'ngx-bootstrap';
import { UtilityService } from '../../../../services/Utility.service';
import { HttpRequestService } from '../../../../services/all-http-request.service';
import { AuthenticationService } from '../../../../services/auth.service';
declare var google: any;
declare var $: any;
@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  constructor(public BaseMapService: BaseMapService,
    public MapServiceService: MapServiceService,
    public bsModalRef: BsModalRef,
    private utilityService: UtilityService,
    private httpRequestService: HttpRequestService,
    private authenticationService: AuthenticationService) { }

  UserName: string = "";
  DisplayName: string = "";
  EmailAddress: string = "";
  ChangePwdnote: string = "ENvision password must contain a minimum of seven characters, including one nonalphanumeric character:(~!@#$%^*--+='|\(){}[]:;>,.?/).";
  OldPassword: string = "";
  NewPassword: string = "";
  ConfirmNewPassword: string = "";
  ValidationError: string = "";
  IsChangepwdSuccessfulmsg: string = "";
  @ViewChild("TabHeading") TabHeading;
  TabEnum = Object.freeze({ "UserDetails": "UserDetails", "Mapsettings": "Mapsettings", "ChangePassword": "ChangePassword" });
  ngOnInit() {
    this.IsChangepwdSuccessfulmsg = "";
    this.ValidationError = "";
    setTimeout(() => {
      $('.modal-dialog').draggable({
        handle: ".modal-header"
      });
      this.GetUserDetails();
    }, 100);

  }
  ActiveTab: string = this.TabEnum.UserDetails;
  GetUserDetails() {
    this.IsChangepwdSuccessfulmsg = "";
    this.ValidationError = "";
    if (this.MapServiceService.MyProfileUserDetails.length == 0) {
      let UserId = this.authenticationService.getLoggedinUserId();
      this.httpRequestService._NodeGetUserDetails(UserId).subscribe(data => {
        if (data._Issuccess) {
          if (data.UserData.length > 0) {
            this.MapServiceService.MyProfileUserDetails = data.UserData;
            this.UserName = this.MapServiceService.MyProfileUserDetails[0].UserName;
            this.DisplayName = this.MapServiceService.MyProfileUserDetails[0].DisplayName;
            this.EmailAddress = this.MapServiceService.MyProfileUserDetails[0].Email;
          }
        }
      }, error => {
        console.log(error);
      });
    }
    else {
      this.UserName = this.MapServiceService.MyProfileUserDetails[0].UserName;
      this.DisplayName = this.MapServiceService.MyProfileUserDetails[0].DisplayName;
      this.EmailAddress = this.MapServiceService.MyProfileUserDetails[0].Email;
    }
  }
  Saveclick(SaveMapsetting) {
    this.IsChangepwdSuccessfulmsg = "";
    this.ValidationError = "";
    if (document.getElementById("tabUserDetails").parentElement.classList.contains('active'))
      this.ActiveTab = this.TabEnum.UserDetails;
    if (document.getElementById("tabMapsettings").parentElement.classList.contains('active'))
      this.ActiveTab = this.TabEnum.Mapsettings;
    if (document.getElementById("tabChangepassword").parentElement.classList.contains('active'))
      this.ActiveTab = this.TabEnum.ChangePassword;
    switch (this.ActiveTab) {
      case "Mapsettings":
        let List = this.MapServiceService.BaseMapData.getValue();
        if (List && List.BaseMapData) {
          var activeBasemap = List.BaseMapData.filter(m => m.IsDefault == true)[0];
          let BaseMapProviderID = activeBasemap.BaseMapProviderID;
          let UserId = this.authenticationService.getLoggedinUserId();
          this.httpRequestService._NodeSaveMapsettings(UserId, BaseMapProviderID).subscribe(data => {
            if (data._Issuccess) {
              if (data.MapSettingData[0].BaseMapProviderID == activeBasemap.BaseMapProviderID)
                activeBasemap = List.BaseMapData.filter(m => m.BaseMapProviderID == data.MapSettingData[0].BaseMapProviderID)[0];
              activeBasemap.IsDefault = true;
              List.MapSettingData = data.MapSettingData;
              this.BaseMapService.setBasemap(activeBasemap);
            }
          }, error => {
            console.log(error);
          });
        }
        break;
      case "ChangePassword":
        if (this.NewPassword.length >= 6 && this.ConfirmNewPassword.length >= 6 && this.NewPassword === this.ConfirmNewPassword) {
          var letters = /^[0-9a-zA-Z]+$/;
          var nonalphanumeric = "~!@#$%^*--+='|\(){}[]:;>,.?/";
          var regex = " -_*(!@#$%^&*()_-={}[]:\"<>,.?/~`";
          var stripped = this.NewPassword.replace(/[A-Za-z0-9]/g, '');
          var crmstripped = this.ConfirmNewPassword.replace(/[A-Za-z0-9]/g, '');
          // if (this.NewPassword.match(letters) && this.ConfirmNewPassword.match(letters)) {
          if (regex.indexOf(stripped) > 0 && regex.indexOf(crmstripped) > 0) {
            this.ValidationError = "";
            let oldtext = this.OldPassword;
            let newtext = this.NewPassword;
            let UserId = this.authenticationService.getLoggedinUserId();
            this.httpRequestService._NodeChangePassword(oldtext, newtext, UserId).subscribe(data => {
              if (data.IsSuccessful) {
                this.ValidationError = "";
                this.IsChangepwdSuccessfulmsg = "Password changed successfully!";
              } else {
                this.ValidationError = "";
                this.ValidationError = data.ErrorMessage;
              }
              this.OldPassword = "";
              this.NewPassword = "";
              this.ConfirmNewPassword = "";
            }, error => {
              console.log(error);
            });
          } else {
            this.ValidationError = "Non alpha numeric characters in 'newPassword' needs to be greater than or equal to '1'.";
          }
          // } else {
          //   this.ValidationError = "Error occured during change!";
          // }

        } else {
          this.ValidationError = "The length of parameter 'newPassword' needs to be greater or equal to '7'.";
        }
        break;
    }
  }
  SaveMapsetting() {

  }
  close() {
    this.bsModalRef.hide();
  }


}
