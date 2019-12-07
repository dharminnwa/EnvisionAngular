import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from '../../../../services/Utility.service';

@Component({
  selector: 'app-map-library',
  templateUrl: './map-library.component.html',
  styleUrls: ['./map-library.component.scss']
})
export class MapLibraryComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal, private utilityService: UtilityService) { }
  ngOnInit() {
    this.utilityService.CloseModalOnRouteChange(this.activeModal);
  }
}
