"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var tools_service_1 = require("../../../../services/tools.service");
var auth_service_1 = require("../../../../services/auth.service");
var map_service_service_1 = require("../../../../services/map-service.service");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var Utility_service_1 = require("../../../../services/Utility.service");
var all_http_request_service_1 = require("../../../../services/all-http-request.service");
var environment_1 = require("../../../../../environments/environment");
var BookMarksComponent = (function () {
    function BookMarksComponent(
        // public activeModal: NgbActiveModal,
        bsModalRef, toolsService, authServices, mapservice, UtilityService, httpService) {
        this.bsModalRef = bsModalRef;
        this.toolsService = toolsService;
        this.authServices = authServices;
        this.mapservice = mapservice;
        this.UtilityService = UtilityService;
        this.httpService = httpService;
        this.ShowLoader = false;
        this.totalBM = 0;
        this.bookMarks = [];
        this.EmptyBookmarkMSG = '';
        this.rows = [];
        this.ImageURLPath = environment_1.environment.ImagespreviewPath;
    }
    ;
    BookMarksComponent.prototype.ngOnInit = function () {
        this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
        this.Draggable();
        this.GetAllBookMarks();
    };
    BookMarksComponent.prototype.Draggable = function () {
        setTimeout(function () {
            $('.modal-dialog').draggable({
                handle: ".modal-header"
            });
        }, 10);
    };
    BookMarksComponent.prototype.GetAllBookMarks = function () {
        var _this = this;
        var Userid = this.authServices.getLoggedinUserId();
        this.ShowLoader = true;
        this.httpService._NodeGetAllBookMark(Userid).subscribe(function (data) {
            if (data._Issuccess == true) {
                _this.bookMarks = data.BookMarks;
                if (_this.bookMarks.length == 0) {
                    _this.EmptyBookmarkMSG = 'No bookmark created';
                }
                _this.ShowLoader = false;
            }
        }, function (error) {
            console.log(error);
            _this.ShowLoader = false;
        });
    };
    BookMarksComponent.prototype.NewBookMark = function () {
        this.totalBM = this.bookMarks.length + this.rows.length + 1;
        this.rows.push({ 'ID': 'bmInput' + this.totalBM, 'VALUE': 'Bookmark ' + this.totalBM });
        $('#bookmarkGroup').animate({ scrollTop: 2000 });
    };
    BookMarksComponent.prototype.SaveBookmark = function (row) {
        var _this = this;
        var map = this.mapservice._mapdata.getValue();
        if (map != undefined) {
            var bmName = "";
            var bmID = "#" + row.ID;
            var bmInputField = $(bmID);
            if (bmInputField != undefined) {
                bmName = bmInputField.val();
            }
            if (bmName != "") {
                var UID = this.authServices.getLoggedinUserId();
                var Name = bmName;
                var Latitude = map.getCenter().lat();
                var Longitude = map.getCenter().lng();
                var Zoom = map.getZoom();
                this.httpService._NodeSaveBookMark(UID, Name, Latitude, Longitude, Zoom).subscribe(function (data) {
                    _this.GetAllBookMarks();
                    _this.CancelBookmark(row);
                }, function (error) {
                    console.log(error);
                });
            }
        }
    };
    BookMarksComponent.prototype.CancelBookmark = function (row) {
        var index = this.rows.indexOf(row);
        this.rows.splice(index, 1);
    };
    BookMarksComponent.prototype.DeleteBookMark = function (bm) {
        var _this = this;
        var bookmarkID = bm.BookmarkID;
        if (bookmarkID) {
            this.httpService._NodeDeleteBookmark(bookmarkID).subscribe(function (data) {
                _this.GetAllBookMarks();
            }, function (error) {
                console.log(error);
            });
        }
    };
    BookMarksComponent.prototype.NavigateBookmark = function (bookmarkData) {
        var myMap = this.mapservice._mapdata.getValue();
        if (myMap != undefined) {
            var zoomLevel = bookmarkData.ZoomLevel;
            var center = { lat: bookmarkData.Latitude, lng: bookmarkData.Longitude };
            var myOptions = {
                zoom: zoomLevel,
                center: center,
            };
            myMap.setOptions(myOptions);
        }
    };
    BookMarksComponent.prototype.OnChangeBookmarkName = function (e, rowID) {
        var inputValue = e.target.value;
        var btnOK = document.getElementById('btn' + rowID);
        if (btnOK != undefined) {
            if (inputValue == "") {
                btnOK.classList.add('btnDisabled');
            }
            else {
                btnOK.classList.remove('btnDisabled');
            }
        }
    };
    BookMarksComponent = __decorate([
        core_1.Component({
            selector: 'app-book-marks',
            templateUrl: './book-marks.component.html',
            styleUrls: ['./book-marks.component.scss']
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef,
            tools_service_1.ToolsService,
            auth_service_1.AuthenticationService,
            map_service_service_1.MapServiceService,
            Utility_service_1.UtilityService,
            all_http_request_service_1.HttpRequestService])
    ], BookMarksComponent);
    return BookMarksComponent;
}());
exports.BookMarksComponent = BookMarksComponent;
//# sourceMappingURL=book-marks.component.js.map