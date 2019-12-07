import { Component, OnInit, Injector } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { HttpRequestService } from '../../../../../services/all-http-request.service';
import { MyMapService } from '../../../../../services/my-map.service';
import { MapServiceService } from '../../../../../services/map-service.service';
import { CondensedComponent } from '../../condensed.component';

declare var $: any;
@Component({
    selector: 'app-deletemap-confirmation',
    templateUrl: './deletemap-confirmation.component.html',
    styleUrls: ['./deletemap-confirmation.component.scss'],
})
export class DeleteMapConfirmationComponent implements OnInit {
    MapId: any;
    MapName: any;
    condensedComponent: CondensedComponent;
    constructor(
        public bsModalRef: BsModalRef,
        private bsModalService: BsModalService,
        private httpRequestService: HttpRequestService,
        private myMapService: MyMapService,
        private mapServiceService: MapServiceService,
        public Injector: Injector,
    ) { this.condensedComponent = Injector.get(CondensedComponent); }

    ngOnInit() {

    }

    DeleteMyMap() {
        this.httpRequestService._NodeDeleteMyMap(this.MapId).subscribe(data => {
            if (data._Issuccess && data.CustomMapData.length == 1) {
                this.bsModalRef.hide();
                this.myMapService.DeleteMapInUserMapList(data.CustomMapData[0]);
                if (this.myMapService.isCustomMapLoaded == true) {
                    if (this.myMapService.loadedMapData.CustomMaps[0].CustomMapId == this.MapId) {
                        this.condensedComponent.BlankMap();
                        this.myMapService.isCustomMapLoaded = false;
                        this.myMapService.loadedMapData = null;
                    }
                }
            }
        }, error => {
        });
    }
}
