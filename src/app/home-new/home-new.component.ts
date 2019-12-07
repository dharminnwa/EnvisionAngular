import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ParcelBufferComponent } from '../@pages/layouts/condensed/parcel-buffer/parcel-buffer.component';
import { MapServiceService } from '../services/map-service.service';
@Component({
  selector: 'app-home-new',
  templateUrl: './home-new.component.html',
  styleUrls: ['./home-new.component.scss'],
})
export class HomeNewComponent implements OnInit {
  videoLink = "/assets/video/How to Access the MAPSearch Data Library.mp4";
  modalRef: BsModalRef;
  isVideoOpen = false;
  constructor(private MapServiceService: MapServiceService, private modalService: BsModalService) { }
  ngOnInit() {
    //this.MapServiceService.temporaryLayer = [];
  }

  openVideoList() {
    this.isVideoOpen = true;
  }

  playVideo(value) {
    switch(value) {
      case 1 : this.videoLink = "/assets/video/How to Access the MAPSearch Data Library.mp4";
      break;
      case 2 : this.videoLink = "/assets/video/How to Change the Basemap.mp4";
      break;
      case 3 : this.videoLink = "/assets/video/How to Change the Layer Style.mp4";
      break;
      case 4 : this.videoLink = "/assets/video/How To Reset Your Password.mp4";
      break;
      case 5 : this.videoLink = "/assets/video/How to Return to a Blank Map.mp4";
      break;
      case 6 : this.videoLink = "/assets/video/How to Upload Data.mp4";
      break;
      case 7 : this.videoLink = "/assets/video/How to Use the Global Search.mp4";
      break;
    }
    this.isVideoOpen = false
  }
}
