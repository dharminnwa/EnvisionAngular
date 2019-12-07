import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { MapServiceService } from '../../../../services/map-service.service';
import { MapLayerService } from '../../../../services/MapLayer-service';
import { UtilityService } from '../../../../services/Utility.service';

declare var $: any;

@Component({
  selector: 'app-show-legend',
  templateUrl: './show-legend.component.html',
  styleUrls: ['./show-legend.component.scss']
})
export class ShowLegendComponent implements OnInit {

  legendList: any = [];
  pvtLegendList: any = [];
  srdLegendList: any = [];
  tempLegendList: any = [];

  constructor(
    public bsModalRef: BsModalRef,
    public mapServiceService: MapServiceService,
    public MapLayerService: MapLayerService,
    private UtilityService: UtilityService
  ) {
    this.mapServiceService.legendData$.subscribe(() => {
      this.GetAllChildNodeData()
    });
  }
  ngOnInit() {
    this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
    this.GetAllChildNodeData();
    setTimeout(() => {
      // if (this.legendList.length == 0 && this.pvtLegendList == 0) {
      //   this.CloseShowLegend();
      // }
      var modalDiv = document.getElementsByClassName('LegendModal')[0];
      var modalElement = $(modalDiv).parents('.modal');
      $(modalElement).attr('id', 'LegendModal');
      this.SetModal('LegendModal');
    }, 50);

    this.Draggable();
    this.Resizable()
  }

  SetModal(modalname) {
    $("#" + modalname + " .modal-dialog").css({
      position: 'fixed',
      width: '250px',
      height: $("#" + modalname + " .modal-content").height(), margin: '0px'
    });

    $("#" + modalname).css({
      position: 'fixed',
      width: '250px',
      height: $("#" + modalname + " .modal-dialog").height()
    });
    $('.modal').css('background', 'rgba(0,0,0,0)');

    $("#" + modalname).css({
      left: ($(window).width() - $('#' + modalname).outerWidth()),
      top: ($(window).height() - ($("#" + modalname).outerHeight() + 200))
    });

    setTimeout(() => {
      $("#" + modalname).css({
        height: '0px',
        top: 0,
      });
    }, 500);

    $('.modal-backdrop').hide();
  }

  Draggable() {
    setTimeout(() => { $('.modal-dialog').draggable({ handle: ".modal-header" }); }, 10);
  }

  Resizable() {
    setTimeout(() => {
      $('.modal-content').resizable({
        handles: 'w, s, se, sw',
        minHeight: 140,
        minWidth: 250
      });
    }, 10);
  }

  GetAllChildNodeData() {
    try {
      this.legendList = [];
      this.pvtLegendList = [];
      this.srdLegendList = [];
      this.tempLegendList = [];
      setTimeout(() => {
        this.legendList = this.mapServiceService.GetAllChildNodeData();
        this.legendList = this.legendList.filter(m => m.IsChecked == false);
        // this.legendList = JSON.parse(JSON.stringify(this.legendList));
        // this.legendList.forEach(x => {
        //   if (x && x.ParentLayerName)
        //     x.Name = x.ParentLayerName.split(' ')[0] + ': ' + x.Name;
        // });
      }, 100);

      // this.pvtLegendList = this.mapServiceService.PrivateTreeNode.getValue();
      this.pvtLegendList = this.UtilityService.GetChildNodeData(this.mapServiceService.PrivateTreeNode.getValue());
      if (this.pvtLegendList != null && this.pvtLegendList.length > 0) {
        this.pvtLegendList = this.pvtLegendList.filter(m => m.IsChecked == false);
      }

      this.srdLegendList = this.UtilityService.GetChildNodeData(this.mapServiceService._SharedTreeNode.getValue());
      if (this.srdLegendList != null && this.srdLegendList.length > 0) {
        this.srdLegendList = this.srdLegendList.filter(m => m.IsChecked == false);
      }

      this.tempLegendList = this.UtilityService.GetChildNodeData(this.mapServiceService.TemporaryTreeNode.getValue());
      if (this.tempLegendList != null && this.tempLegendList.length > 0) {
        this.tempLegendList = this.tempLegendList.filter(m => m.IsChecked == false);
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  CloseShowLegend() {
    this.bsModalRef.hide();
    $('#ToggleLegend').text('Show Legend');
  }
}
