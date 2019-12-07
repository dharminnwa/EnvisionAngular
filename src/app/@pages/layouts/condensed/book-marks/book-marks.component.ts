import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToolsService } from '../../../../services/tools.service';
import { AuthenticationService } from '../../../../services/auth.service';
import { MapServiceService } from '../../../../services/map-service.service';
import { BsModalRef } from 'ngx-bootstrap';
import { UtilityService } from '../../../../services/Utility.service';
import { HttpRequestService } from '../../../../services/all-http-request.service';
import { environment } from '../../../../../environments/environment';
declare var $: any;

@Component({
  selector: 'app-book-marks',
  templateUrl: './book-marks.component.html',
  styleUrls: ['./book-marks.component.scss']
})
export class BookMarksComponent implements OnInit {
  ShowLoader: boolean = false;
  totalBM: number = 0;;
  bookMarks: any = [];
  EmptyBookmarkMSG: string = '';
  rows: any = [];
  ImageURLPath: string = environment.ImagespreviewPath;
  constructor(
    // public activeModal: NgbActiveModal,
    public bsModalRef: BsModalRef,
    public toolsService: ToolsService,
    public authServices: AuthenticationService,
    public mapservice: MapServiceService,
    private UtilityService: UtilityService,
    private httpService: HttpRequestService
  ) { }

  ngOnInit() {
    this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
    this.Draggable();
    this.GetAllBookMarks();
  }

  Draggable() {
    setTimeout(() => {
      $('.modal-dialog').draggable({
        handle: ".modal-header"
      });
    }, 10);
  }

  GetAllBookMarks() {
    let Userid = this.authServices.getLoggedinUserId();
    this.ShowLoader = true;
    this.httpService._NodeGetAllBookMark(Userid).subscribe(data => {
      if (data._Issuccess == true) {
        this.bookMarks = data.BookMarks;
        if (this.bookMarks.length == 0) {
          this.EmptyBookmarkMSG = 'No bookmark created';
        }
        this.ShowLoader = false;
      }
    },
      error => {
        console.log(error);
        this.ShowLoader = false;
      });
  }

  NewBookMark() {
    this.totalBM = this.bookMarks.length + this.rows.length + 1;
    this.rows.push({ 'ID': 'bmInput' + this.totalBM, 'VALUE': 'Bookmark ' + this.totalBM });
    $('#bookmarkGroup').animate({ scrollTop: 2000 });
  }

  SaveBookmark(row: any) {
    let map = this.mapservice._mapdata.getValue();
    if (map != undefined) {
      let bmName = "";
      let bmID = "#" + row.ID;
      let bmInputField = $(bmID);
      if (bmInputField != undefined) {
        bmName = bmInputField.val();
      }
      if (bmName != "") {
        let UID = this.authServices.getLoggedinUserId();
        let Name = bmName;
        let Latitude = map.getCenter().lat();
        let Longitude = map.getCenter().lng();
        let Zoom = map.getZoom();

        this.httpService._NodeSaveBookMark(UID, Name, Latitude, Longitude, Zoom).subscribe(data => {
          this.GetAllBookMarks();
          this.CancelBookmark(row);
        },
          error => {
            console.log(error);
          });
      }
    }
  }

  CancelBookmark(row: any) {
    let index = this.rows.indexOf(row);
    this.rows.splice(index, 1);
  }

  DeleteBookMark(bm: any) {
    let bookmarkID = bm.BookmarkID;
    if (bookmarkID) {
      this.httpService._NodeDeleteBookmark(bookmarkID).subscribe(data => {
        this.GetAllBookMarks();
      },
        error => {
          console.log(error);
        });
    }
  }

  NavigateBookmark(bookmarkData: any) {
    let myMap: any = this.mapservice._mapdata.getValue();
    if (myMap != undefined) {
      let zoomLevel = bookmarkData.ZoomLevel;
      let center = { lat: bookmarkData.Latitude, lng: bookmarkData.Longitude };
      var myOptions = {
        zoom: zoomLevel,
        center: center,
      };
      myMap.setOptions(myOptions);
    }
  }

  OnChangeBookmarkName(e: any, rowID: any) {
    let inputValue = e.target.value;
    let btnOK = document.getElementById('btn' + rowID)
    if (btnOK != undefined) {
      if (inputValue == "") {
        btnOK.classList.add('btnDisabled');
      }
      else {
        btnOK.classList.remove('btnDisabled');
      }
    }
  }
}
