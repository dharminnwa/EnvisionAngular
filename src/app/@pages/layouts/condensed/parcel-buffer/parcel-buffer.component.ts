import { Component, OnInit, ViewChild, Injector } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UtilityService } from '../../../../services/Utility.service';
import { ParcelBufferToolService } from '../../../../services/ParcelBufferTool.service';
import { PointComponent } from './point/point.component';
import { LineComponent } from './line/line.component';

declare var $: any;

@Component({
  selector: 'app-parcel-buffer',
  templateUrl: './parcel-buffer.component.html',
  styleUrls: ['./parcel-buffer.component.scss']
})
export class ParcelBufferComponent implements OnInit {

  activeTabNumber: number = 1;
  @ViewChild(PointComponent) pointComponent:PointComponent;
  @ViewChild(LineComponent) lineComponent:LineComponent;

  constructor(public bsModalRef: BsModalRef, 
    public utilityService: UtilityService, 
    public parcelBufferToolService: ParcelBufferToolService) {
     }
  ngOnInit() {
    this.utilityService.CloseModalOnRouteChange(this.bsModalRef);
    this.parcelBufferToolService.InitPointForParcelBuffer();
    setTimeout(() => {
      var modalDiv = document.getElementsByClassName('parcelBuffer')[0];
      var modalElement = $(modalDiv).parents('.modal');
      $(modalElement).attr('id', 'parcelBuffer');
      this.SetModal('parcelBuffer');
    }, 100);

    this.Draggable();
  }

  ngOnDestroy() {
    // this.CloseModal(true);
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
    if ($('.modal-backdrop')) {
      $('.modal-backdrop').remove();
    }
    modalwidth = $("#" + modalname + " .modal-content").width();
    modalheight = $("#" + modalname + " .modal-content").height();
    screenwidth = $(window).width();
    $(window).resize(function () {
      if ($(window).width() < screenwidth) {
        $("#" + modalname + " .modal-content").css({ width: $(window).width() - 20 });
        $("#" + modalname + " .modal-dialog").css({ position: 'fixed', width: $("#" + modalname + " .modal-content").width(), height: $("#" + modalname + " .modal-content").height(), margin: '0px' });
        $("#" + modalname).css({ width: $("#" + modalname + " .modal-dialog").width(), height: $("#" + modalname + " .modal-dialog").height() });
      }
      else {
        $("#" + modalname + " .modal-content").css({ width: modalwidth });
        $("#" + modalname + " .modal-dialog").css({ position: 'fixed', width: $("#" + modalname + " .modal-content").width(), height: $("#" + modalname + " .modal-content").height(), margin: '0px' });
        $("#" + modalname).css({ width: $("#" + modalname + " .modal-dialog").width(), height: $("#" + modalname + " .modal-dialog").height() });
      }
      var topPos = ($(window).height() - $("#" + modalname).outerHeight()) / 2;
      $("#" + modalname).css({
        left: ($(window).width() - $("#" + modalname).outerWidth()) / 2,
        top: topPos > 0 ? topPos : 0
      });
    });
  }

  Draggable() {
    setTimeout(() => {
      $('.modal-dialog').draggable({
        handle: ".modal-header"
      });
    }, 10);
  }

  SelectTab(tabNumber: number) {
    if (this.activeTabNumber != tabNumber) {
      this.activeTabNumber = tabNumber;
      if (this.activeTabNumber == 1) {
        this.parcelBufferToolService.CloseDrawToolsForLine();
        this.parcelBufferToolService.InitPointForParcelBuffer();
        this.lineComponent.ClearData(false);
      } else if (this.activeTabNumber == 2) {
        this.parcelBufferToolService.CloseDrawToolsForPoint();
        this.parcelBufferToolService.InitLineForParcelBuffer();
        this.pointComponent.ClearData(false);
      }
    }
  }

  CloseModal(isFromDestroy: boolean = false) {
    this.pointComponent.ClearData(false);
    this.lineComponent.ClearData(false);
    this.parcelBufferToolService.CloseDrawToolsForPoint();
    this.parcelBufferToolService.CloseDrawToolsForLine();
    if(!isFromDestroy)
      this.bsModalRef.hide();
  }
}
