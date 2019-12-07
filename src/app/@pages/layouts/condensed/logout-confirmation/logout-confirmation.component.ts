import { Component, OnInit, Injector } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { AuthenticationService } from '../../../../services/auth.service';
import { CondensedComponent } from '../condensed.component';
import { MapServiceService } from '../../../../services/map-service.service'
import { GoogleMapPage } from '../../../../maps/google/google.component';

@Component({
  selector: 'app-logout-confirmation',
  templateUrl: './logout-confirmation.component.html',
  styleUrls: ['./logout-confirmation.component.scss']
})
export class LogoutConfirmationComponent implements OnInit {

  private CondensedComponent: CondensedComponent;
  constructor(private bsModalRef: BsModalRef,
    public AuthServices: AuthenticationService,
    private MapServiceService: MapServiceService,
    private injector: Injector,
    private googleMapPage: GoogleMapPage

  ) { setTimeout(() => this.CondensedComponent = injector.get(CondensedComponent)); }

  ngOnInit() {
  }

  CloseModal() {
    this.bsModalRef.hide();
  }

  Ignore() {
    this.googleMapPage.energyLayer = [];
    this.AuthServices.LogoutUserProfile();

  }

  Save() {
    this.CondensedComponent.SaveMap();
  }
}
