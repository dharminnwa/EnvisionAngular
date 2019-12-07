import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapServiceService } from '../../services/map-service.service';
import { delayWhen } from 'rxjs/operator/delayWhen';
import { UtilityService } from '../../services/Utility.service';
@Component({
  selector: 'app-widget-modal',
  templateUrl: './widget-modal.component.html',
  styleUrls: ['./widget-modal.component.scss'],
  providers: [NgbModal]
})

export class WidgetModalComponent implements OnInit {
  closeResult: string;
  providers: [NgbModal]
  constructor(
    public modalService: NgbModal,
    public activeModal: NgbActiveModal,
    public MapServiceService: MapServiceService,
    private utilityService: UtilityService
  ) { }

  public activeWidgets = [];
  public homeWidgets = [];

  public allWidgets = [
    { Id: 1, Title: 'Parcel Centerpint Lookup'},
    { Id: 2, Title: 'Latest Industry News'},
    { Id: 3, Title: 'Envision 101' },
    { Id: 4, Title: 'PipeLine Activity Reports' },
    { Id: 5, Title: 'Latest Electric Industry news' },
    { Id: 6, Title: 'Fincial markets' },
    { Id: 7, Title: 'Assential Lookup' },
    { Id: 8, Title: 'Favourite Companies' },
    { Id: 9, Title: 'Favourite Layers' },
    { Id: 10, Title: 'Latest Energy Research from PennEnergy Research'},
    { Id: 11, Title: 'News Articles' },
    { Id: 12, Title: 'Most Recent Pipeline Projects' },
    { Id: 13, Title: 'Transmission Project Reports' },
    { Id: 14, Title: 'Transmission Projects' },
    { Id: 15, Title: 'Recent Maps' },
    { Id: 16, Title: 'Well Lookup' },
  ];

  ngOnInit() {
    this.utilityService.CloseModalOnRouteChange(this.activeModal);
    const widgets = this.MapServiceService._HomeWidgetArray.getValue();
    this.activeWidgets = widgets;
  }

  ChangeWidget(subItem,item) {    
    const index: number = this.activeWidgets.indexOf(item);
    if (index !== -1) {
      this.activeWidgets.splice(index, 1);
    }
    this.activeWidgets.splice(index, 0, { Id: subItem.Id, Title: subItem.Title });
  }
  SaveWidget(){    
    this.activeModal.close(this.activeWidgets);
  }
}
