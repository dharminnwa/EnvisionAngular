import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MapServiceService } from '../../../../../services/map-service.service';
import { UtilityService } from '../../../../../services/Utility.service';

declare var $: any;
@Component({
    selector: 'app-elevation-graph',
    templateUrl: './elevation-graph.component.html',
    styleUrls: ['./elevation-graph.component.scss']
})
export class ElevationGraphComponent implements OnInit {
    constructor(
        public bsModalRef: BsModalRef,
        public mapService: MapServiceService,
        private UtilityService: UtilityService
    ) { }

    ngOnInit() {
        this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
        setTimeout(() => {
            var modalDiv = document.getElementsByClassName('elevationGraph')[0];
            var modalElement = $(modalDiv).parents('.modal');
            $(modalElement).attr('id', 'elevationGraph');
            this.SetModal('elevationGraph');
        }, 100);
        this.Draggable();
    }

    Draggable() {
        setTimeout(() => {
            $('.modal-dialog').draggable({
                handle: ".modal-header"
            });
        }, 10);
    }

    SetModal(modalname) {
        var modalwidth;
        var modalheight;
        var screenwidth;
        //$("#" + modalname).modal({ show: 'fade', hide: 'drop', backdrop: 'static', keyboard: false });
        
        $("#" + modalname + " .modal-dialog").css({ position: 'fixed', width: $("#" + modalname + " .modal-content").width(), height: $("#" + modalname + " .modal-content").height(), margin: '0px' });
        $("#" + modalname).css({ position: 'fixed', width: $("#" + modalname + " .modal-dialog").width(), height: $("#" + modalname + " .modal-dialog").height() });
        $('.modal').css('background', 'rgba(0,0,0,0)');
        $("#" + modalname).css({ left: ($(window).width() - $('#' + modalname).outerWidth()) / 2, top: ($(window).height() - $("#" + modalname).outerHeight()) / 2 });

        $('.modal-backdrop').hide();
        setTimeout(() => {
            $("#" + modalname).css({
                height: '0px',
                top: 0,
            });
        }, 500);
    }

}
