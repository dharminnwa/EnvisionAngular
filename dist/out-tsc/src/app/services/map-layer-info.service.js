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
var environment_1 = require("../../environments/environment");
var map_service_service_1 = require("./map-service.service");
var Utility_service_1 = require("./Utility.service");
var all_http_request_service_1 = require("./all-http-request.service");
var auth_service_1 = require("./auth.service");
var map_layer_feedback_component_1 = require("../@pages/layouts/condensed/map-layer-feedback/map-layer-feedback.component");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var infobox_notes_1 = require("../models/infobox-notes");
var MapLayerInfoService = (function () {
    function MapLayerInfoService(MapServiceService, UtilityService, httpRequest, authService, modalService) {
        this.MapServiceService = MapServiceService;
        this.UtilityService = UtilityService;
        this.httpRequest = httpRequest;
        this.authService = authService;
        this.modalService = modalService;
        // Observable string sources
        // private feedbackComponentMethod = new Subject<any>();
        // Observable string streams
        // feedbackMethodCalled$ = this.feedbackComponentMethod;
        // Service message commands
        this.openedInfoboxes = [];
        this.ActiveInfoBoxPageInfo = [];
        this.allEnergyLayer = [];
        this.energyLayer = [];
        this.DeatailsProperty = [];
        this.FilterALL = [];
        this.currentLayerIndex = 0;
        this.pixelX = 0;
        this.pixelY = 0;
        this.infoBoxCount = 0;
        this.locationList = [];
        this.notesIndex = 0; //Index
    }
    MapLayerInfoService.prototype.GetActiveEnergyLayerList = function (selectedLayers) {
        for (var _i = 0, selectedLayers_1 = selectedLayers; _i < selectedLayers_1.length; _i++) {
            var i = selectedLayers_1[_i];
            if (i.ListOfChildID.length > 0) {
                var _loop_1 = function (j) {
                    var filteredLayer = i.energyLayer.filter(function (el) {
                        if (el.EnergyLayerID) {
                            if (el.EnergyLayerID == parseInt(j))
                                return el;
                        }
                        else if (el.DataSetID) {
                            if (el.DataSetID == parseInt(j))
                                return el;
                        }
                    });
                    if (filteredLayer && filteredLayer.length > 0)
                        this_1.energyLayer.push(filteredLayer[0]);
                };
                var this_1 = this;
                for (var _a = 0, _b = i.ListOfChildID; _a < _b.length; _a++) {
                    var j = _b[_a];
                    _loop_1(j);
                }
            }
        }
    };
    MapLayerInfoService.prototype.onClickMarker = function (location) {
        var isDrawToolOpened = this.MapServiceService.isDrawToolsOpened.getValue();
        if (isDrawToolOpened == true)
            return;
        this.locationPoint = location;
        var event;
        if (location.ra)
            event = location.ra;
        else if (location.wa)
            event = location.wa;
        else
            event = location.xa;
        var x = parseInt(event.pageX);
        var y = parseInt(event.pageY);
        this.map = this.MapServiceService._mapdata.getValue();
        var selectedLayers = this.MapServiceService._GridTabData.getValue();
        if (selectedLayers.length > 0 || this.MapServiceService.ExternalEnergyLayer.length > 0) {
            this.energyLayer = [];
            this.GetActiveEnergyLayerList(selectedLayers);
            if (this.MapServiceService.ExternalEnergyLayer.length > 0) {
                for (var _i = 0, _a = this.MapServiceService.ExternalEnergyLayer; _i < _a.length; _i++) {
                    var exlayer = _a[_i];
                    this.energyLayer.push(exlayer);
                }
            }
            if (location.pixel != undefined) {
                this.pixelX = x;
                this.pixelY = y;
                var cor = {
                    latitude: location.latLng.lat(),
                    longitude: location.latLng.lng()
                };
                this.map = this.MapServiceService._mapdata.getValue();
                if (this.energyLayer.length > 0) {
                    for (var i = 0; i < this.energyLayer.length; i++) {
                        if (this.energyLayer[i].UploadFileType && this.energyLayer[i].UploadFileType != null && this.energyLayer[i].UploadFileType != "" && (this.energyLayer[i].UploadFileType.toLowerCase() == ".kml" || this.energyLayer[i].UploadFileType.toLowerCase() == ".kmz")) {
                            this.pixelX = 0;
                            this.pixelY = 0;
                            continue;
                        }
                        var default_filter = "";
                        var Gridfilter = "";
                        var bbox = "";
                        if (this.energyLayer[i].RepresentationType == "Line" || this.energyLayer[i]["IconType"].indexOf('Line') >= 0) {
                            bbox = this.UtilityService.GetBboxForInfoBox_New(this.map, cor.latitude, cor.longitude, location);
                        }
                        else if ((this.energyLayer[i].RepresentationType == "Area" || this.energyLayer[i].RepresentationType.indexOf("Area") >= 0) && (this.energyLayer[i].IconType.indexOf("RoundedRectangle") >= 0 || this.energyLayer[i].IconType.indexOf("Area") >= 0)) {
                            bbox = this.UtilityService.GetBboxForInfoBox_New(this.map, cor.latitude, cor.longitude, location, 'Area');
                        }
                        else {
                            bbox = this.UtilityService.GetBboxForInfoBox_New(this.map, cor.latitude, cor.longitude, location, 'Point');
                        }
                        this.currentLayerIndex = i;
                        this.currentLayer = this.energyLayer;
                        if (this.energyLayer[i].FilterValue) {
                            var IsFilterval = [];
                            IsFilterval.push(this.energyLayer[i].FilterValue);
                            if (this.energyLayer[i].IsFromHomeLookup)
                                default_filter = this.MapServiceService.filtervalForHomeLookup(IsFilterval);
                            else
                                default_filter = this.MapServiceService.filterval(IsFilterval);
                        }
                        if (this.energyLayer[i].serversidefilterval) {
                            Gridfilter = this.MapServiceService.gridfilter(this.energyLayer[i].serversidefilterval);
                        }
                        if (default_filter == '' && Gridfilter != '') {
                            default_filter = '(' + Gridfilter + ')';
                        }
                        else if (Gridfilter != '' && default_filter != '') {
                            default_filter = '(' + Gridfilter + ') and (' + default_filter + ')';
                        }
                        var cql_Filter = "";
                        if ((this.energyLayer[i].RepresentationType == "Area" || this.energyLayer[i].RepresentationType.indexOf("Area") >= 0) && (this.energyLayer[i].IconType.indexOf("RoundedRectangle") >= 0 || this.energyLayer[i].IconType.indexOf("Area") >= 0)) {
                            cql_Filter = this.MapServiceService.SetInfoBoxCqlFilter(default_filter, true, bbox, 'Area');
                        }
                        else {
                            cql_Filter = this.MapServiceService.SetInfoBoxCqlFilter(default_filter, true, bbox);
                        }
                        //let cql_Filter = this.MapServiceService.setTempCqlFilter(default_filter, true);
                        if (this.energyLayer[i].EnergyLayerID) {
                            this.SetInfoboxData(this.energyLayer[i].TableName, bbox, cql_Filter, this.energyLayer[i].EnergyLayerID, location);
                        }
                        else if (this.energyLayer[i].DataSetID) {
                            this.SetInfoboxData(this.energyLayer[i].TableName, bbox, cql_Filter, this.energyLayer[i].DataSetID, location);
                        }
                    }
                }
            }
        }
        else {
            this.energyLayer = [];
        }
    };
    MapLayerInfoService.prototype.latLng2Point = function (latLng) {
        if (!this.map) {
            this.map = this.MapServiceService._mapdata.getValue();
        }
        var topRight = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getNorthEast());
        var bottomLeft = this.map.getProjection().fromLatLngToPoint(this.map.getBounds().getSouthWest());
        var scale = Math.pow(2, this.map.getZoom());
        var worldPoint = this.map.getProjection().fromLatLngToPoint(latLng);
        return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
    };
    MapLayerInfoService.prototype.SetPointer = function (mainInfoDiv, quadrant, heightOffset) {
        var _this = this;
        if (heightOffset === void 0) { heightOffset = 0; }
        var canvasEle = $('<canvas id="canvas" class="triangle" width="200" height="200" data-id=' +
            this.infoBoxCount +
            ' data-x=' +
            this.pixelX +
            ' data-y=' +
            this.pixelY +
            ' style="top:-45px;left:-20px;z-index:-1"></canvas>');
        canvasEle.appendTo(mainInfoDiv);
        setTimeout(function () {
            var infoDiv = mainInfoDiv[0];
            var offset = $(mainInfoDiv).offset();
            _this.updatePointer(infoDiv, offset, infoDiv);
        }, 150);
    };
    MapLayerInfoService.prototype.SetPointerforKML = function (mainInfoDiv, heightOffset) {
        if (heightOffset === void 0) { heightOffset = 0; }
        var canvasEle = $('<canvas id="canvas" class="triangle" width="200" height="200" data-id=' + this.infoBoxCount + ' data-x=' + this.pixelX + ' data-y=' + this.pixelY + ' style="top:-45px;left:-20px;z-index:-1"></canvas>');
        canvasEle.appendTo(mainInfoDiv);
        var canvasElement = mainInfoDiv.children("#canvas");
        if (canvasElement) {
            var canvas = canvasElement[0];
            canvas.style.top = heightOffset - 44 + "px";
            if (canvas.getContext) {
                var ctx = canvas.getContext('2d');
                ctx.strokeStyle = "black";
                ctx.fillStyle = "white";
                ctx.lineWidth = 1;
                if (heightOffset < 44) {
                    ctx.moveTo(0, 0);
                    ctx.lineTo(50, 50);
                    ctx.lineTo(25, 50);
                }
                else {
                    canvas.style.top = heightOffset - 204 + "px";
                    ctx.moveTo(0, 160);
                    ctx.lineTo(160, 0);
                    ctx.lineTo(120, 0);
                }
                ctx.stroke();
                ctx.fill();
            }
        }
    };
    MapLayerInfoService.prototype.DisplayInfoPopup = function (infoData, uniqueId, energyLayer) {
        var _this = this;
        var clearance = 50;
        var clearance2 = 50;
        var gridHeight = document.getElementById('_footerDrawer').offsetHeight;
        if (parseInt($("#main").css("margin-left")))
            clearance = 50 + parseInt($("#main").css("margin-left"));
        this.infoBoxCount++;
        var currentInfoboxCount = this.infoBoxCount;
        var infoBoxClearance = new google.maps.Size(clearance, clearance2);
        var mainInfoDiv = this.setInfoBox(this.map, false, infoData, energyLayer);
        $(mainInfoDiv).attr('id', 'mainInfoDiv' + this.infoBoxCount);
        //$(document.createElement('div')).addClass('pointer bottomLeft').appendTo(mainInfoDiv);
        if (gridHeight < 44)
            gridHeight = 0;
        var myOptions = {
            content: mainInfoDiv[0],
            disableAutoPan: true,
            maxWidth: 0
            // , pixelOffset: new google.maps.Size(20, (44 - gridHeight))
            ,
            pixelOffset: this.getInfowindowOffset(this.map, this.locationPoint.latLng, gridHeight, mainInfoDiv),
            position: this.locationPoint.latLng,
            isHidden: false,
            pane: "floatPane",
            zIndex: 999999,
            width: "280px",
            opacity: 0.6,
            enableEventPropagation: false,
            closeBoxURL: "https://node.envisionmaps.net/Images/delete.png",
            closeBoxMargin: "12px 8px 5px 2px",
            infoBoxClearance: infoBoxClearance
        };
        var infoBoxModal = new InfoBox(myOptions);
        infoBoxModal.open(this.map);
        var infoBoxData = {
            Infobox: infoBoxModal,
            Id: uniqueId
        };
        this.openedInfoboxes.push(infoBoxData);
        var locationListData = {
            data: this.locationPoint,
            id: this.infoBoxCount
        };
        this.locationList.push(locationListData);
        setTimeout(function () {
            var currentInfoBox;
            var currentmainDiv = $("#mainInfoDiv" + currentInfoboxCount);
            if (currentmainDiv) {
                currentInfoBox = $(currentmainDiv).parents('.infoBox')[0];
            }
            try {
                var handleObject = ".drag" + currentInfoboxCount;
                var IsDraggble = 1;
                currentInfoBox.addEventListener("mouseup", function (event) { IsDraggble = 0; });
                currentInfoBox.addEventListener("mousedown", function (event) { IsDraggble = 1; });
                $(currentInfoBox).draggable({
                    handle: handleObject,
                    drag: function (event, ui) {
                        if (IsDraggble == 1) {
                            var mainInfo = $(event.target).children('.maininfodiv');
                            var iHeader;
                            if (mainInfo) {
                                iHeader = mainInfo.children('.infoHeader')[0];
                                iHeader.onmousedown = _this.updatePointer(event.target, ui.offset, infoBoxModal);
                            }
                            else {
                                mainInfo.onmousedown = _this.updatePointer(event.target, ui.offset, infoBoxModal);
                            }
                        }
                        else {
                            return false;
                        }
                    },
                });
            }
            catch (e) {
                console.log(e);
            }
            var feedbackLink = document.getElementById('FeedbackLink' + currentInfoboxCount);
            if (feedbackLink != undefined && feedbackLink != null) {
                var data_1 = {
                    energyLayer: energyLayer,
                    clickLocation: _this.locationPoint.latLng,
                    infoData: undefined
                };
                feedbackLink.addEventListener("click", function (event) {
                    var id = event.currentTarget['id'];
                    if (id) {
                        id = id.replace("FeedbackLink", "");
                        var infoBoxData_1 = _this.ActiveInfoBoxPageInfo.find(function (x) { return x.infoBoxId == "mainInfoDiv" + id; });
                        if (infoBoxData_1)
                            data_1.infoData = infoBoxData_1.infoData[infoBoxData_1.index];
                        else
                            data_1.infoData = infoData[0];
                    }
                    _this.OpenMapLayerFeedback(data_1);
                });
            }
            setTimeout(function () {
                _this.SetandGetNotes(currentInfoboxCount, energyLayer, infoData);
            }, 100);
            setTimeout(function () {
                _this.hideInfoBoxmodal(infoBoxModal, false);
            }, 10000);
        }, 100);
    };
    MapLayerInfoService.prototype.SetandGetNotes = function (infoId, energyLayer, infoData) {
        var _this = this;
        if (infoData && infoData.length > 0) {
            var _loop_2 = function (j) {
                notesLink = document.getElementById('NoteLink' + infoId + j);
                if (notesLink != undefined && notesLink != null) {
                    if (infoData[j].Notes && infoData[j].Notes.length > 0) {
                        for (var k = 0; k < infoData[j].Notes.length; k++) {
                            var NoteItem = infoData[j].Notes[k];
                            this_2.AddNotesDiv(infoId, j, energyLayer, infoData, NoteItem);
                        }
                    }
                    notesLink.addEventListener("click", function (event) {
                        _this.PinInfoBox(infoId);
                        _this.AddNotesDiv(infoId, j, energyLayer, infoData);
                    });
                }
            };
            var this_2 = this, notesLink;
            for (var j = 0; j < infoData.length; j++) {
                _loop_2(j);
            }
        }
    };
    MapLayerInfoService.prototype.PinInfoBox = function (infoId) {
        var InfoDiv = $('#mainInfoDiv' + infoId);
        var InfoHeader = InfoDiv.find('.infoHeader');
        if (InfoHeader) {
            var PinIcon = InfoHeader.find('i');
            if (PinIcon.hasClass('pinH')) {
                PinIcon.removeClass('pinH');
                InfoDiv.parent().addClass('pinned');
            }
        }
    };
    MapLayerInfoService.prototype.AddNotesDiv = function (infoId, j, energyLayer, infoData, notesItem) {
        var _this = this;
        if (notesItem === void 0) { notesItem = {}; }
        var addNotesDiv = $('<div id="NoteNode' + this.notesIndex + infoId + j + '">');
        addNotesDiv.addClass('add-notes-wrap');
        var NotesLabel = $('<label for="addNotes' + this.notesIndex + infoId + j + '" class="add-notes-label">Note</label>');
        var NotesInput;
        var SaveIcon;
        var NotesId;
        if (notesItem && notesItem.NoteValue && notesItem.Id) {
            NotesInput = $('<input type="text" class="show-only-text" value="' + notesItem.NoteValue + '" name="addNotes' + this.notesIndex + infoId + j + '" id="addNotes' + this.notesIndex + infoId + j + '" placeholder="Add note here" disabled />');
            SaveIcon = $('<a id="SaveNote' + this.notesIndex + infoId + j + '"><i class="fa fa-pencil"></i></a>');
            NotesId = $('<input type="hidden"  value="' + notesItem.Id + '" name="NotesId' + this.notesIndex + infoId + j + '" id="NotesId' + this.notesIndex + infoId + j + '" />');
        }
        else {
            NotesInput = $('<input type="text" name="addNotes' + this.notesIndex + infoId + j + '" id="addNotes' + this.notesIndex + infoId + j + '" placeholder="Add note here" />');
            SaveIcon = $('<a id="SaveNote' + this.notesIndex + infoId + j + '"><i class="fa fa-save"></i></a>');
            NotesId = $('<input type="hidden" value="" name="NotesId' + this.notesIndex + infoId + j + '" id="NotesId' + this.notesIndex + infoId + j + '" />');
        }
        var CloseIcon = $('<a id="RemoveNote' + this.notesIndex + infoId + j + '"><i class="fa fa-times"></i></a>');
        NotesLabel.appendTo(addNotesDiv);
        NotesInput.appendTo(addNotesDiv);
        NotesId.appendTo(addNotesDiv);
        SaveIcon.appendTo(addNotesDiv);
        CloseIcon.appendTo(addNotesDiv);
        var NotesWrapper = document.getElementById('NotesWrap' + infoId + j);
        if (NotesWrapper) {
            addNotesDiv.appendTo(NotesWrapper);
            var closeIconLink = document.getElementById('RemoveNote' + this.notesIndex + infoId + j);
            var NotesIdRef_1 = '#NotesId' + this.notesIndex + infoId + j;
            closeIconLink.addEventListener("click", function (event) {
                var NotesId = $(NotesIdRef_1).val();
                if (NotesId) {
                    var Id = { id: NotesId };
                    _this.httpRequest._NodeDeleteInfoboxNotes(Id).subscribe(function (data) {
                        if (energyLayer && energyLayer.EnergyLayerID) {
                            _this.DeleteNotesFromSubscriber(NotesId, energyLayer.EnergyLayerID);
                        }
                    });
                }
                event.currentTarget.parentElement.remove();
            });
            var SaveIconLink = document.getElementById('SaveNote' + this.notesIndex + infoId + j);
            var InputId_1 = "" + this.notesIndex + infoId + j;
            SaveIconLink.addEventListener("click", function (event) {
                _this.SaveNotes(InputId_1, energyLayer, infoData[j], notesItem);
            });
            this.notesIndex++;
        }
    };
    MapLayerInfoService.prototype.SaveNotes = function (inputId, energyLayer, infoData, notesItem) {
        var _this = this;
        var NotesInput = $('#addNotes' + inputId);
        var InputIsDisabled = NotesInput.attr('disabled');
        if (InputIsDisabled) {
            NotesInput.removeAttr('disabled');
            NotesInput.removeClass('show-only-text');
            var SaveLink = $('#SaveNote' + inputId);
            if (SaveLink)
                SaveLink.children().removeClass('fa-pencil').addClass('fa-save');
        }
        else {
            var NotesId = $('#NotesId' + inputId).val();
            if (NotesId) {
                // if (notesItem.Id && notesItem.Id == NotesId) {
                var energyLayerId_1 = '';
                if (energyLayer && energyLayer.EnergyLayerID)
                    energyLayerId_1 = energyLayer.EnergyLayerID;
                var NotesItem = {
                    NoteValue: NotesInput.val().trim(),
                    Id: NotesId
                };
                this.httpRequest._NodeUpdateInfoboxNotes(NotesItem).subscribe(function (data) {
                    if (data._Issuccess == true) {
                        NotesInput.attr("disabled", "true").addClass("show-only-text");
                        var SaveLink = $('#SaveNote' + inputId);
                        if (SaveLink)
                            SaveLink.children().removeClass('fa-save').addClass('fa-pencil');
                        if (data.data && data.data.length > 0) {
                            _this.AddNotesToSubscriber(data.data[0], energyLayerId_1);
                        }
                    }
                });
                // }
            }
            else {
                var NoteItem_1 = new infobox_notes_1.InfoboxNotes();
                NoteItem_1.NoteValue = NotesInput.val();
                if (NoteItem_1.NoteValue.trim() != '') {
                    NoteItem_1.NoteValue = NoteItem_1.NoteValue.trim();
                    NoteItem_1.UserId = this.authService.getLoggedinUserId();
                    if (energyLayer && energyLayer.EnergyLayerID)
                        NoteItem_1.EnergyLayerId = energyLayer.EnergyLayerID;
                    if (infoData && infoData.data) {
                        var LayerData = infoData.data;
                        var UniqueIds = ['MSID', 'OBJECTID', 'PARCELAPN', 'TAXAPN', 'gid', 'id'];
                        for (var i = 0; i < UniqueIds.length; i++) {
                            var uId = UniqueIds[i];
                            if (LayerData[uId]) {
                                NoteItem_1.EnergyLayerRecordLabel = uId;
                                NoteItem_1.EnergyLayerRecordId = LayerData[uId];
                                break;
                            }
                        }
                    }
                    this.httpRequest._NodeSaveInfoboxNotes(NoteItem_1).subscribe(function (data) {
                        if (data._Issuccess == true) {
                            if (data.data && data.data.length > 0 && data.data[0].Id) {
                                var newNoteId = data.data[0].Id;
                                $('#NotesId' + inputId).val(newNoteId);
                                _this.AddNotesToSubscriber(data.data[0], NoteItem_1.EnergyLayerId);
                            }
                            NotesInput.attr("disabled", "true").addClass("show-only-text");
                            var SaveLink = $('#SaveNote' + inputId);
                            if (SaveLink)
                                SaveLink.children().removeClass('fa-save').addClass('fa-pencil');
                        }
                    });
                }
            }
        }
    };
    MapLayerInfoService.prototype.AddNotesToSubscriber = function (NotesData, energyLayerId) {
        var AllNotes = this.MapServiceService.LodedIsNotesArray.getValue();
        var item = {
            energylayerId: energyLayerId,
            NotesData: NotesData
        };
        if (AllNotes && AllNotes.length > 0) {
            var ExistingNotesData = AllNotes.find(function (x) { return x.energylayerId == energyLayerId; });
            if (ExistingNotesData) {
                ExistingNotesData = JSON.parse(JSON.stringify(ExistingNotesData));
                var ExistingNoteIndex = ExistingNotesData.NotesData.findIndex(function (x) { return x.Id == NotesData.Id; });
                if (ExistingNoteIndex > -1)
                    ExistingNotesData.NotesData[ExistingNoteIndex] = NotesData;
                else
                    ExistingNotesData.NotesData.push(NotesData);
                this.MapServiceService.setLodedIsNotesArray(ExistingNotesData);
            }
            else {
                this.MapServiceService.setLodedIsNotesArray(item);
            }
        }
        else {
            this.MapServiceService.setLodedIsNotesArray(item);
        }
    };
    MapLayerInfoService.prototype.DeleteNotesFromSubscriber = function (NotesId, energyLayerId) {
        var AllNotes = this.MapServiceService.LodedIsNotesArray.getValue();
        if (AllNotes && AllNotes.length > 0) {
            var ExistingNotesData = AllNotes.find(function (x) { return x.energylayerId == energyLayerId; });
            if (ExistingNotesData) {
                ExistingNotesData = JSON.parse(JSON.stringify(ExistingNotesData));
                var ExistingNoteIndex = ExistingNotesData.NotesData.findIndex(function (x) { return x.Id == NotesId; });
                if (ExistingNoteIndex > -1) {
                    var notesVal = ExistingNotesData.NotesData[ExistingNoteIndex].NoteValue;
                    this.RemoveNotesFromGridData(notesVal, energyLayerId);
                    ExistingNotesData.NotesData.splice(ExistingNoteIndex, 1);
                    this.MapServiceService.setLodedIsNotesArray(ExistingNotesData);
                }
            }
        }
    };
    MapLayerInfoService.prototype.RemoveNotesFromGridData = function (noteValue, energyLayerId) {
        var allStoredData = this.MapServiceService.LodedGridData.getValue();
        var sameLayerData = allStoredData.filter(function (x) { return x.TabData.EnergyLayerID == energyLayerId; });
        if (sameLayerData && sameLayerData.length > 0) {
            for (var i = 0; i < sameLayerData.length; i++) {
                var layerData = sameLayerData[i];
                if (layerData && layerData.data && layerData.data.length > 0) {
                    layerData.data.forEach(function (item) {
                        if (item['Notes'] && item['Notes'].includes(noteValue)) {
                            if (item['Notes'] == noteValue)
                                item['Notes'] = '';
                            if (item['Notes'].includes(noteValue + ','))
                                item['Notes'] = item['Notes'].replace(noteValue + ',', '');
                            else if (item['Notes'].includes(noteValue))
                                item['Notes'] = item['Notes'].replace(noteValue, '');
                        }
                    });
                }
            }
        }
    };
    MapLayerInfoService.prototype.getInfowindowOffset = function (map, marker, gridHeight, mainInfoDiv) {
        var a = document.createElement('div');
        a.id = "temp123";
        a.innerHTML = mainInfoDiv[0].innerHTML;
        document.body.appendChild(a);
        var h = -a.clientHeight;
        if (a.clientHeight > 370) {
            h = -370;
        }
        $("#temp123").remove();
        // mainInfoDiv.style.visibility = "";
        // $('body').append(mainInfoDiv);
        var center = this.getPixelFromLatLng(map.getCenter()), point = this.getPixelFromLatLng(marker), quadrant = "", offset;
        quadrant += (point.y > center.y) ? "b" : "t";
        quadrant += (point.x < center.x) ? "l" : "r";
        if (quadrant == "tr") {
            offset = new google.maps.Size(-280, 44 - gridHeight);
        }
        else if (quadrant == "tl") {
            offset = new google.maps.Size(20, 44 - gridHeight);
        }
        else if (quadrant == "br") {
            offset = new google.maps.Size(-280, h - 12);
        }
        else if (quadrant == "bl") {
            offset = new google.maps.Size(20, h);
            // offset = new google.maps.Size(20, 0);
        }
        $(mainInfoDiv[0].id).remove();
        this.SetPointer(mainInfoDiv, quadrant, gridHeight);
        return offset;
    };
    MapLayerInfoService.prototype.getPixelFromLatLng = function (latLng) {
        var projection = this.map.getProjection();
        var point = projection.fromLatLngToPoint(latLng);
        return point;
    };
    MapLayerInfoService.prototype.DisplayInfoPopupForKml = function (currentPosition, data) {
        var _this = this;
        var clearance = 50;
        this.infoBoxCount++;
        var infoBoxClearance = new google.maps.Size(clearance + parseInt($("#main").css("margin-left")), clearance);
        var mainInfoDiv = this.setInfoBoxForKml(this.map, false, data);
        $(mainInfoDiv).attr('id', 'mainInfoDiv' + this.infoBoxCount);
        //$(document.createElement('div')).addClass('pointer bottomLeft').appendTo(mainInfoDiv);
        // this.SetPointerforKML(mainInfoDiv);
        var gridHeight = document.getElementById('_footerDrawer').offsetHeight;
        if (gridHeight < 44)
            gridHeight = 0;
        var myOptions = {
            content: mainInfoDiv[0],
            disableAutoPan: true,
            maxWidth: 0,
            pixelOffset: this.getInfowindowOffset(this.map, currentPosition, gridHeight, mainInfoDiv),
            position: currentPosition,
            isHidden: false,
            pane: "floatPane",
            zIndex: 999999,
            width: "280px",
            opacity: 0.6,
            enableEventPropagation: false,
            closeBoxURL: "https://node.envisionmaps.net/Images/delete.png",
            closeBoxMargin: "9px 8px 5px 2px",
            infoBoxClearance: infoBoxClearance
        };
        var infoBoxModal = new InfoBox(myOptions);
        infoBoxModal.open(this.map);
        var locationListData = {
            data: {
                latLng: currentPosition
            },
            id: this.infoBoxCount
        };
        this.locationList.push(locationListData);
        setTimeout(function () {
            var currentInfoBox;
            var currentmainDiv = $("#mainInfoDiv" + _this.infoBoxCount);
            if (currentmainDiv) {
                currentInfoBox = $(currentmainDiv).parents('.infoBox')[0];
            }
            try {
                var handleObject = ".drag" + _this.infoBoxCount;
                var IsDraggble = 1;
                currentInfoBox.addEventListener("mouseup", function (event) { IsDraggble = 0; });
                currentInfoBox.addEventListener("mousedown", function (event) { IsDraggble = 1; });
                $(currentInfoBox).draggable({
                    handle: handleObject,
                    drag: function (event, ui) {
                        if (IsDraggble == 1) {
                            var mainInfo = $(event.target).children('.maininfodiv');
                            var iHeader;
                            if (mainInfo) {
                                iHeader = mainInfo.children('.infoHeader')[0];
                                iHeader.onmousedown = _this.updatePointer(event.target, ui.offset, infoBoxModal);
                            }
                            else {
                                mainInfo.onmousedown = _this.updatePointer(event.target, ui.offset, infoBoxModal);
                            }
                        }
                        else {
                            return false;
                        }
                    },
                });
            }
            catch (e) {
                console.log(e);
            }
            // var feedbackLink = document.getElementById('FeedbackLink' + this.infoBoxCount) as HTMLElement;
            // feedbackLink.addEventListener("click", (event) => {
            //   this.feedbackComponentMethod.next();
            // });
            setTimeout(function () {
                _this.hideInfoBoxmodal(infoBoxModal, false);
            }, 10000);
        }, 100);
    };
    MapLayerInfoService.prototype.hideInfoBoxmodal = function (infoBoxModal, forced) {
        try {
            if (infoBoxModal.div_ && infoBoxModal.div_.classList) {
                if (infoBoxModal.div_.classList.contains('pinned') == false || forced == true)
                    infoBoxModal.close();
            }
            else {
                if (infoBoxModal.contextListener_ != null && infoBoxModal.contextListener_.f != undefined) {
                    if (infoBoxModal.contextListener_.f.classList.contains('pinned') == false || forced == true)
                        infoBoxModal.close();
                }
                if (infoBoxModal.contextListener_ != null && infoBoxModal.contextListener_.l != undefined) {
                    if (infoBoxModal.contextListener_.l.classList.contains('pinned') == false || forced == true)
                        infoBoxModal.close();
                }
            }
        }
        catch (e) {
            infoBoxModal.close();
            console.log(e);
        }
    };
    MapLayerInfoService.prototype.SetInfoboxData = function (TableName, Bbox, CQL_FILTER, EnergyLayerID, location) {
        var _this = this;
        var infoData = [];
        var ml = this.currentLayerIndex;
        var StrokeColor = this.energyLayer[ml]["StrokeColor"].replace('#', '');
        var FillColor = this.energyLayer[ml]["FillColor"].replace('#', '');
        var Opacity = this.energyLayer[ml]["Opacity"];
        var ExternalIconId = this.energyLayer[ml]["ExternalIconId"];
        var IconType = this.energyLayer[ml]["IconType"];
        var SizePercent = this.energyLayer[ml]["SizePercent"];
        var StrokeThicknessPercent = this.energyLayer[ml]["StrokeThicknessPercent"];
        var IconURL;
        if (this.energyLayer[ml].EnergyLayerStylesByUserModel && this.energyLayer[ml].EnergyLayerStylesByUserModel.length > 0) {
            var EnergyLayerStylesByUserModel = this.energyLayer[ml].EnergyLayerStylesByUserModel[0];
            if (EnergyLayerStylesByUserModel["StrokeColor"])
                StrokeColor = EnergyLayerStylesByUserModel["StrokeColor"].replace('#', '');
            if (EnergyLayerStylesByUserModel["FillColor"])
                FillColor = EnergyLayerStylesByUserModel["FillColor"].replace('#', '');
            if (EnergyLayerStylesByUserModel["Opacity"])
                Opacity = EnergyLayerStylesByUserModel["Opacity"];
            if (EnergyLayerStylesByUserModel["ExternalIconId"])
                ExternalIconId = EnergyLayerStylesByUserModel["ExternalIconId"];
            if (EnergyLayerStylesByUserModel["IconType"])
                IconType = EnergyLayerStylesByUserModel["IconType"];
            if (EnergyLayerStylesByUserModel["SizePercent"])
                SizePercent = EnergyLayerStylesByUserModel["SizePercent"];
            if (EnergyLayerStylesByUserModel["StrokeThicknessPercent"])
                StrokeThicknessPercent = EnergyLayerStylesByUserModel["StrokeThicknessPercent"];
        }
        IconType = IconType.replace("Area", "");
        if (this.energyLayer[ml]["RepresentationType"] == "Area")
            SizePercent = 100;
        if (ExternalIconId == null || ExternalIconId == '') {
            //IconURL = "http://energymapit.com/en/Handlers/IconImage.ashx?Id=" + EnergyLayerID + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + energyLayer[ml]["SizePercent"] + '&amp;StrokeThicknessPercent=' + energyLayer[ml]["StrokeThicknessPercent"] + '&amp;Opacity=' + Opacity;
            IconURL = environment_1.environment.GetLayerIconURL + "/icongenerate/get/?Id=" + EnergyLayerID + '&URLType=CustomStyleIcon&FillColor=' + FillColor + '&IconType=' + IconType + '&StrokeColor=' + StrokeColor + '&SizePercent=' + SizePercent + '&StrokeThicknessPercent=' + StrokeThicknessPercent + '&Opacity=' + Opacity;
        }
        else {
            var ExternalIconurl = this.UtilityService.GetDefaultExternalIcon(ExternalIconId);
            var PreviewImageURL = environment_1.environment.ImagespreviewPath;
            var ImagePath = PreviewImageURL + "01)AngularEnvision%20Images";
            if (ExternalIconurl.indexOf(ImagePath) >= 0) {
                IconURL = ExternalIconurl;
            }
            else {
                IconURL = environment_1.environment.ImagespreviewPath + "EnvisionAngularUsersIcon/" + this.authService.getLoggedinUserId() + '/' + ExternalIconId + '.png';
            }
            // IconURL = "http://energymapit.com/en/Handlers/IconImage.ashx?Id=" + EnergyLayerID + '&amp;URLType=CustomStyleIcon&amp;FillColor=' + FillColor + '&amp;IconType=' + IconType + '&amp;ExternalIconId=' + ExternalIconId + '&amp;StrokeColor=' + StrokeColor + '&amp;SizePercent=' + SizePercent + '&amp;StrokeThicknessPercent=' + StrokeThicknessPercent + '&amp;Opacity=' + Opacity;
            //IconURL = "http://env3.beta.mapsearch360.com/api/Test?Id=" + EnergyLayerID + '&URLType=CustomStyleIcon&FillColor=' + FillColor + '&IconType=' + IconType + '&ExternalIconId=' + ExternalIconId + '&StrokeColor=' + StrokeColor + '&SizePercent=' + SizePercent + '&StrokeThicknessPercent=' + StrokeThicknessPercent + '&Opacity=' + Opacity;
        }
        var layer = this.energyLayer[ml]["TableName"];
        var filter = this.energyLayer[ml]["FilterValue"];
        var layerType = 'pipeline';
        var energyLayer = this.energyLayer[ml];
        var i = 0;
        if (layer) {
            if (energyLayer && energyLayer['ZoomMax'] && energyLayer['ZoomMin']) {
                var zoomlevel = this.map.getZoom();
                if (!((zoomlevel >= energyLayer['ZoomMin']) && (zoomlevel <= energyLayer['ZoomMax'])))
                    return;
            }
            var UserId = this.authService.getLoggedinUserId();
            var energyLayerId = '';
            if (energyLayer && energyLayer.EnergyLayerID)
                energyLayerId = energyLayer.EnergyLayerID;
            this.httpRequest._NodeGetInfoboxData(TableName, Bbox, CQL_FILTER, UserId, energyLayerId).subscribe(function (result) {
                //let att = Object.keys(result.features)[0];
                // var jsonData = result[att];
                // var jsonData = JSON.parse(jsonData);
                var jsonData = result;
                var features = [];
                var Notes = [];
                if (jsonData.totalFeatures > 0) {
                    for (var index in jsonData.features) {
                        var coordinates = jsonData.features[index]["geometry"]["coordinates"];
                        var FeatureBbox = jsonData.features[index].properties.bbox;
                        var Shaptype = jsonData.features[index]["geometry"].type;
                        var splitbbox = Bbox.split(',');
                        var isIntersect12 = null;
                        var bboxcoordinates = null;
                        bboxcoordinates = [[[
                                    parseFloat(splitbbox[0]),
                                    parseFloat(splitbbox[1])
                                ],
                                [
                                    parseFloat(splitbbox[2]),
                                    parseFloat(splitbbox[1])
                                ],
                                [
                                    parseFloat(splitbbox[0]),
                                    parseFloat(splitbbox[3])
                                ],
                                [
                                    parseFloat(splitbbox[2]),
                                    parseFloat(splitbbox[3])
                                ],
                                [
                                    parseFloat(splitbbox[0]),
                                    parseFloat(splitbbox[1])
                                ]]];
                        if (Shaptype == "MultiLineString") {
                            // var jsonDatabboxcoordinates = [[[
                            //   parseFloat(jsonData.features[index].properties.bbox[0]),
                            //   parseFloat(jsonData.features[index].properties.bbox[1])
                            // ],
                            // [
                            //   parseFloat(jsonData.features[index].properties.bbox[2]),
                            //   parseFloat(jsonData.features[index].properties.bbox[1])
                            // ],
                            // [
                            //   parseFloat(jsonData.features[index].properties.bbox[0]),
                            //   parseFloat(jsonData.features[index].properties.bbox[3])
                            // ],
                            // [
                            //   parseFloat(jsonData.features[index].properties.bbox[2]),
                            //   parseFloat(jsonData.features[index].properties.bbox[3])
                            // ],
                            // [
                            //   parseFloat(jsonData.features[index].properties.bbox[0]),
                            //   parseFloat(jsonData.features[index].properties.bbox[1])
                            // ]]];
                            // var MultiLineString1 = turf.multiLineString(jsonData.features[index]["geometry"]["coordinates"]);
                            // var MultiLineString2 = turf.multiLineString(bboxcoordinates);
                            // isIntersect12 = turf.intersect(MultiLineString1, MultiLineString2);
                            // if (!isIntersect12) {
                            //   var MultiLineString1 = turf.multiLineString(jsonDatabboxcoordinates);
                            //   var MultiLineString2 = turf.multiLineString(bboxcoordinates);
                            //   isIntersect12 = turf.intersect(MultiLineString1, MultiLineString2);
                            //   if (!isIntersect12 && this.map.getZoom() > 16) {
                            //     isIntersect12 = this.checkIntersection(coordinates, Bbox, jsonData.features[index].geometry.type);
                            //   }
                            // }
                            var coords = [];
                            var coords2 = [];
                            var Linestring = ""; //"LINESTRING()";
                            var Linestring1 = "";
                            for (var _i = 0, _a = jsonData.features[index]["geometry"]["coordinates"][0]; _i < _a.length; _i++) {
                                var lineindex = _a[_i];
                                //coords.push(new google.maps.LatLng(lineindex[1], lineindex[0]))
                                //coords.push({ lat: lineindex[1], lng: lineindex[0] });
                                if (Linestring) {
                                    Linestring += "," + lineindex[1] + " " + lineindex[0];
                                }
                                else {
                                    Linestring = lineindex[1] + " " + lineindex[0];
                                }
                            }
                            for (var _b = 0, _c = bboxcoordinates[0]; _b < _c.length; _b++) {
                                var lineindex1 = _c[_b];
                                //coords2.push(new google.maps.LatLng(lineindex[1], lineindex[0]))
                                //coords2.push({ lat: lineindex1[1], lng: lineindex1[0] });
                                if (Linestring1) {
                                    Linestring1 += "," + lineindex1[1] + " " + lineindex1[0];
                                }
                                else {
                                    Linestring1 = lineindex1[1] + " " + lineindex1[0];
                                }
                            }
                            if (Linestring) {
                                Linestring = "LINESTRING(" + Linestring + ")";
                            }
                            if (Linestring1) {
                                Linestring1 = "LINESTRING(" + Linestring1 + ")";
                            }
                            isIntersect12 = _this.UseJstsToTestForIntersection(Linestring, Linestring1);
                        }
                        else if (Shaptype == "MultiPolygon") {
                            isIntersect12 = true;
                        }
                        else {
                            isIntersect12 = true;
                        }
                        if (isIntersect12) {
                            var notes_1 = [];
                            if (jsonData.features[index].Notes)
                                notes_1 = jsonData.features[index].Notes;
                            var feature = {
                                properties: jsonData.features[index].properties,
                                notes: notes_1
                            };
                            features.push(feature);
                            if (jsonData.features[index].Notes)
                                Notes.push(jsonData.features[index].Notes);
                            features.push(jsonData.features[index].properties);
                        }
                    }
                }
                i = ml;
                if (features.length > 0) {
                    for (var x in features) {
                        var data = features[x].properties;
                        var notes = features[x].notes;
                        if (data != undefined) {
                            if (data.FACTYPE == "Refinery") {
                                data.CAPACITY = data.CAPACITY + " " + "(b/d)";
                            }
                            var shape = "";
                            var info = void 0;
                            var DetailPanelProperties = _this.energyLayer[i]["DetailPanelProperties"];
                            if (_this.energyLayer[i]["EnergyLayerStylesByUserModel"]) {
                                if (_this.energyLayer[i].EnergyLayerStylesByUserModel.length > 0) {
                                    DetailPanelProperties = _this.energyLayer[i].EnergyLayerStylesByUserModel[0]["DetailPanelProperties"];
                                    if (!DetailPanelProperties)
                                        DetailPanelProperties = _this.energyLayer[i]["DetailPanelProperties"];
                                }
                            }
                            if (_this.energyLayer[i]["IconType"] == "Line" || _this.energyLayer[i]["IconType"] == "DashLine") {
                                if (_this.energyLayer[i]["IconType"] == "Line" && _this.energyLayer[i]["RepresentationType"] == "Line") {
                                    shape = "Line";
                                }
                                else if (_this.energyLayer[i]["IconType"] == "DashLine" && _this.energyLayer[i]["RepresentationType"] == "Line") {
                                    shape = "DashLine";
                                }
                                // var info = { "layer": layer, "data": data, "layerType": layerType, "filter": filter, "IconType": energyLayer[ml]["IconType"], "color": getHexColorValue(energyLayer[ml]["StrokeColor"]), "Shape": energyLayer[ml]["RepresentationType"], "ShapeURL": IconURL, "InfoBoxProperty": energyLayer[ml]["DetailPanelProperties"] };
                                info = { "layer": layer, "data": data, "layerType": layerType, "filter": filter, "IconType": _this.energyLayer[i]["IconType"], "color": _this.UtilityService.GetHexColorValue(_this.energyLayer[i]["StrokeColor"]), "Shape": shape, "ShapeURL": IconURL, "InfoBoxProperty": DetailPanelProperties, "Notes": notes };
                            }
                            else {
                                info = { "layer": layer, "data": data, "layerType": layerType, "filter": filter, "IconType": _this.energyLayer[i]["IconType"], "color": _this.UtilityService.GetHexColorValue(_this.energyLayer[i]["FillColor"]), "Shape": _this.energyLayer[i]["RepresentationType"], "ShapeURL": IconURL, "InfoBoxProperty": DetailPanelProperties, "Notes": notes };
                            }
                            infoData.push(info);
                        }
                    }
                    if (infoData.length > 0) {
                        _this.DisplayInfoPopup(infoData, EnergyLayerID, energyLayer);
                    }
                }
            });
        }
        else if (!layer && this.energyLayer[ml].DetailPanelProperties.toString().indexOf('BaseUri==') != -1 && this.energyLayer[ml].DetailPanelPropertiesMain.toString().indexOf('BaseUri==') != -1) {
            var map = this.MapServiceService._mapdata.getValue();
            if (map) {
                var zoom = map.getZoom();
                if (zoom < 14)
                    return;
            }
            var cor = {
                latitude: location.latLng.lat(),
                longitude: location.latLng.lng()
            };
            var projdefs = { "4326": L.CRS.EPSG4326, "3857": L.CRS.EPSG3857 };
            var SplitedtheDetail = this.energyLayer[ml].DetailPanelPropertiesMain.split(';');
            var ExternalURL = "";
            var Parameter = "";
            for (var _i = 0, SplitedtheDetail_1 = SplitedtheDetail; _i < SplitedtheDetail_1.length; _i++) {
                var index = SplitedtheDetail_1[_i];
                if (index.indexOf('WFSURL==') >= 0) {
                    ExternalURL = index.replace("WFSURL==", " ");
                }
                else if (index.indexOf('Parameters==') >= 0) {
                    Parameter = index.replace("Parameters==", " ");
                }
            }
            if (Parameter) {
                if (Parameter.indexOf("3857") >= 0) {
                    Bbox = this.UtilityService.GetExternalLayerBboxForInfoBox(this.map, cor.latitude, cor.longitude, location, projdefs["3857"]);
                    ExternalURL = ExternalURL.trim() + "&geometry=" + Bbox;
                    // ExternalURL = ExternalURL.trim().replace("inSR=102100", "inSR=4326").replace("outSR=102100", "outSR=4326").replace("102100", "4326").replace("3857", "4326") + "&geometry=" + Bbox;
                }
                else if (Parameter.indexOf("4326") >= 0) {
                    //Bbox = this.UtilityService.GetExternalLayerBboxForInfoBox(this.map, cor.latitude, cor.longitude, location, projdefs["4326"]);
                    ExternalURL = ExternalURL + "&BBox==" + Bbox;
                }
            }
            else {
                //Bbox = this.UtilityService.GetExternalLayerBboxForInfoBox(this.map, cor.latitude, cor.longitude, location, projdefs["4326"]);
                ExternalURL = ExternalURL + "&BBox==" + Bbox;
            }
            if (ExternalURL) {
                this.httpRequest._GetExternalInfoboxData(ExternalURL.trim()).subscribe(function (Res) {
                    var Data = Res.json();
                    var exfeatures = [];
                    if (Data["features"]) {
                        if (Data.features.length > 0) {
                            for (var index in Data.features) {
                                var coordinates = Data.features[index]["geometry"]["rings"];
                                // let isIntersect = this.checkcheckIntersectionforExternal(coordinates, Bbox, Data.features[index].geometry.type);
                                var isIntersect = true;
                                if (isIntersect == true) {
                                    exfeatures.push(Data.features[index].attributes);
                                }
                            }
                        }
                        if (exfeatures.length > 0) {
                            for (var x in exfeatures) {
                                var featuredata = exfeatures[x];
                                if (featuredata) {
                                    var shape = "";
                                    var info = void 0;
                                    var DetailPanelProperties = "";
                                    for (var _i = 0, _a = Object.keys(Data.fieldAliases); _i < _a.length; _i++) {
                                        var aliyas = _a[_i];
                                        if (DetailPanelProperties) {
                                            DetailPanelProperties += "," + aliyas + "=" + aliyas;
                                        }
                                        else {
                                            DetailPanelProperties = aliyas + "=" + aliyas;
                                        }
                                    }
                                    if (_this.energyLayer[ml]["IconType"] == "Line" || _this.energyLayer[ml]["IconType"] == "DashLine") {
                                        if (_this.energyLayer[ml]["IconType"] == "Line" && _this.energyLayer[ml]["RepresentationType"] == "Line") {
                                            shape = "Line";
                                        }
                                        else if (_this.energyLayer[ml]["IconType"] == "DashLine" && _this.energyLayer[ml]["RepresentationType"] == "Line") {
                                            shape = "DashLine";
                                        }
                                        // var info = { "layer": layer, "data": data, "layerType": layerType, "filter": filter, "IconType": energyLayer[ml]["IconType"], "color": getHexColorValue(energyLayer[ml]["StrokeColor"]), "Shape": energyLayer[ml]["RepresentationType"], "ShapeURL": IconURL, "InfoBoxProperty": energyLayer[ml]["DetailPanelProperties"] };
                                        info = { "layer": layer, "data": featuredata, "layerType": layerType, "filter": filter, "IconType": _this.energyLayer[ml]["IconType"], "color": _this.UtilityService.GetHexColorValue(_this.energyLayer[ml]["StrokeColor"]), "Shape": shape, "ShapeURL": IconURL, "InfoBoxProperty": DetailPanelProperties };
                                    }
                                    else {
                                        info = { "layer": layer, "data": featuredata, "layerType": layerType, "filter": filter, "IconType": _this.energyLayer[ml]["IconType"], "color": _this.UtilityService.GetHexColorValue(_this.energyLayer[ml]["FillColor"]), "Shape": _this.energyLayer[ml]["RepresentationType"], "ShapeURL": IconURL, "InfoBoxProperty": DetailPanelProperties };
                                    }
                                    infoData.push(info);
                                }
                            }
                            if (infoData.length > 0) {
                                _this.DisplayInfoPopup(infoData, EnergyLayerID, energyLayer);
                            }
                        }
                    }
                }, function (error) { console.log(error); });
            }
        }
    };
    MapLayerInfoService.prototype.UseWicketToGoFromGooglePolysToWKT = function (poly1, poly2) {
        var wicket = new Wkt.Wkt();
        wicket.fromObject(poly1);
        var wkt1 = wicket.write();
        wicket.fromObject(poly2);
        var wkt2 = wicket.write();
        return [wkt1, wkt2];
    };
    MapLayerInfoService.prototype.UseJstsToTestForIntersection = function (wkt1, wkt2) {
        // Instantiate JSTS WKTReader and get two JSTS geometry objects
        var wktReader = new jsts.io.WKTReader();
        var geom1 = wktReader.read(wkt1);
        var geom2 = wktReader.read(wkt2);
        if (geom2.intersects(geom1)) {
            //alert('intersection confirmed!');
            return true;
        }
        else {
            // alert('..no intersection.');
            return false;
        }
    };
    MapLayerInfoService.prototype.checkcheckIntersectionforExternal = function (coordinates, bbox, typeName) {
        var result = false;
        try {
            // if (typeName == "MultiLineString") {
            for (var _i = 0, coordinates_1 = coordinates; _i < coordinates_1.length; _i++) {
                var obj = coordinates_1[_i];
                for (var _a = 0, obj_1 = obj; _a < obj_1.length; _a++) {
                    var objc = obj_1[_a];
                    // if (typeName == "MultiLineString") {
                    var x = objc[0];
                    var y = objc[1];
                    result = this.isIntersectingExternal(bbox, x, y);
                    if (result == true) {
                        break;
                    }
                    // }
                    // else {
                    //   result = true;
                    // }
                }
                if (result == true) {
                    break;
                }
            }
            // }
            // else {
            //   result = true;
            // }
            // foreach (let obj in coordinates)
            // {
            //     if (obj is JArray)
            //         result = checkIntersection(obj as JToken, bbox);
            //     else if (obj is JValue)
            //     {
            //         x = Convert.ToDouble(coordinates[0].ToString());
            //         y = Convert.ToDouble(coordinates[1].ToString());
            //         result = isIntersecting(bbox, x, y);
            //     }
            //     if (result == true)
            //     {
            //         break;
            //     }
            // }
        }
        catch (e) {
            console.log(e);
        }
        return result;
    };
    MapLayerInfoService.prototype.checkIntersection = function (coordinates, bbox, typeName) {
        var result = false;
        try {
            if (typeName == "MultiLineString") {
                for (var _i = 0, coordinates_2 = coordinates; _i < coordinates_2.length; _i++) {
                    var obj = coordinates_2[_i];
                    for (var _a = 0, obj_2 = obj; _a < obj_2.length; _a++) {
                        var objc = obj_2[_a];
                        if (typeName == "MultiLineString") {
                            var x = objc[0];
                            var y = objc[1];
                            result = this.isIntersecting(bbox, x, y);
                            if (result == true) {
                                break;
                            }
                        }
                        else {
                            result = true;
                        }
                    }
                    if (result == true) {
                        break;
                    }
                }
            }
            else if (typeName == "MultiPolygon") {
                for (var _b = 0, coordinates_3 = coordinates; _b < coordinates_3.length; _b++) {
                    var obj = coordinates_3[_b];
                    for (var _c = 0, obj_3 = obj; _c < obj_3.length; _c++) {
                        var objc = obj_3[_c];
                        if (typeName == "MultiPolygon") {
                            var x = objc[0];
                            var y = objc[1];
                            result = this.isIntersecting(bbox, x, y);
                            if (result == true) {
                                break;
                            }
                        }
                        else {
                            result = true;
                        }
                    }
                    if (result == true) {
                        break;
                    }
                }
            }
            else {
                result = true;
            }
            // foreach (let obj in coordinates)
            // {
            //     if (obj is JArray)
            //         result = checkIntersection(obj as JToken, bbox);
            //     else if (obj is JValue)
            //     {
            //         x = Convert.ToDouble(coordinates[0].ToString());
            //         y = Convert.ToDouble(coordinates[1].ToString());
            //         result = isIntersecting(bbox, x, y);
            //     }
            //     if (result == true)
            //     {
            //         break;
            //     }
            // }
        }
        catch (e) {
            console.log(e);
        }
        return result;
    };
    MapLayerInfoService.prototype.isIntersectingExternal = function (bbox, x, y) {
        var result = false;
        try {
            var coOrdinates = bbox.split(',');
            if (coOrdinates.length == 4) {
                var minX = parseFloat(coOrdinates[0]).toFixed(2);
                var minY = parseFloat(coOrdinates[1]).toFixed(2);
                var maxX = parseFloat(coOrdinates[2]).toFixed(2);
                var maxY = parseFloat(coOrdinates[3]).toFixed(2);
                if ((minX + "").split(".")[1] >= "50" || (maxX + "").split(".")[1] >= "50") {
                    x = x + 1;
                }
                if ((minY + "").split(".")[1] >= "50" || (maxY + "").split(".")[1] >= "50") {
                    y = y + 1;
                }
                if ((x >= parseInt(minX) && x <= parseInt(maxX)) && (y >= parseInt(minY) && y <= parseInt(maxY)))
                    result = true;
            }
        }
        catch (ex) {
            console.log(ex);
        }
        return result;
    };
    MapLayerInfoService.prototype.isIntersecting = function (bbox, x, y) {
        var result = false;
        try {
            var coOrdinates = bbox.split(',');
            if (coOrdinates.length == 4) {
                var minX = parseFloat(coOrdinates[0]);
                var minY = parseFloat(coOrdinates[1]);
                var maxX = parseFloat(coOrdinates[2]);
                var maxY = parseFloat(coOrdinates[3]);
                if ((x >= minX || x <= maxX) && (y >= minY || y <= maxY))
                    result = true;
            }
        }
        catch (ex) {
            console.log(ex);
        }
        return result;
    };
    MapLayerInfoService.prototype.getBGColor = function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? ('rgba(' + parseInt(result[1], 16) + ', ' + parseInt(result[2], 16) + ', ' + parseInt(result[3], 16) + ', 0.25)') : null;
    };
    MapLayerInfoService.prototype.setInfoBox = function (zoom, isWizard, infoData, energyLayer) {
        var _this = this;
        var mainInfoDiv = $('<div>');
        mainInfoDiv.addClass("maininfodiv");
        infoData = infoData.reverse();
        var Table = [];
        var headerDiv = $('<div>');
        headerDiv.addClass("infoHeader");
        headerDiv.addClass("infoFooter");
        headerDiv.appendTo(mainInfoDiv);
        if (infoData.length > 0) {
            this.SetIcon(infoData, headerDiv);
        }
        if (infoData.length > 0) {
            this.SetPagination(infoData, headerDiv, mainInfoDiv);
        }
        var pin = $('<i class="fa fa-thumb-tack sticky pinH"></i>');
        pin.click(function ($event) {
            _this.StickyBox(event);
        });
        pin.appendTo(headerDiv);
        if (infoData.length > 0) {
            var index = 0;
            for (var x in infoData) {
                var layer = infoData[x].layer;
                var data = infoData[x].data;
                var layerType = 'pipeline';
                this.DeatailsProperty = [];
                this.DeatailsProperty.push(infoData[x].InfoBoxProperty);
                var filter = infoData[x].filter;
                if (layerType == "pipeline") {
                    Table.push(this.makePipelineTableHTML(data, energyLayer, index));
                    index++;
                }
                if (parseInt(x) > 0 && Table[x] != undefined)
                    Table[x].hide();
            }
        }
        if (Table.length > 0) {
            for (var x in Table)
                $(Table[x]).appendTo(mainInfoDiv);
            // $(document.createElement('div')).addClass('pointer bottomLeft').appendTo(mainInfoDiv);
            // $('<canvas id="canvas" class="triangle" width="50" height="50"></canvas>').appendTo(mainInfoDiv);
        }
        // var footerDiv = $('<div>');
        // footerDiv.addClass("infoBottom");
        // footerDiv.addClass("infoFooter");
        // var footerLinkWrap = $('<div>');
        // footerLinkWrap.addClass('info-footer-link-wrapper');
        // var NoteLink = $('<span id="NoteLink' + this.infoBoxCount + '" class="footerLink NoteLink">+Note</span>');
        // NoteLink.appendTo(footerLinkWrap);
        // if (energyLayer && energyLayer.isEnergyLayer == true) {
        //   var FeedbackLink = $('<span id="FeedbackLink' + this.infoBoxCount + '" class="footerLink FeedbackLink">+Feedback</span>');
        //   FeedbackLink.appendTo(footerLinkWrap);
        // }
        // var NotesWrapperDiv = $('<div class="notes-wrapper-block" id="NotesWrap' + this.infoBoxCount + '"></div>')
        // NotesWrapperDiv.appendTo(footerDiv);
        // footerLinkWrap.appendTo(footerDiv);
        // footerDiv.appendTo(mainInfoDiv);
        var color = '';
        var bgRgbColor = null;
        var IconListofParameter = this.getUrlVars(infoData[0].ShapeURL);
        if (energyLayer.IconType == 'Line') {
            // if (energyLayer.EnergyLayerStylesByUserModel && energyLayer.EnergyLayerStylesByUserModel.length > 0) {
            //   color = energyLayer.EnergyLayerStylesByUserModel[0].StrokeColor;
            // }
            //color = energyLayer.StrokeColor.replace('#FF', '#');
            color = IconListofParameter.StrokeColor.replace('FF', '#');
            if (color.indexOf('#') == -1) {
                color = '#' + color.substring(2);
            }
            bgRgbColor = this.getBGColor(color);
        }
        else {
            if (IconListofParameter.FillColor) {
                // if (energyLayer.EnergyLayerStylesByUserModel && energyLayer.EnergyLayerStylesByUserModel.length > 0) {
                //   color = energyLayer.EnergyLayerStylesByUserModel[0].FillColor;
                // }
                //color = energyLayer.FillColor.replace('#FF', '#');
                color = IconListofParameter.FillColor.replace('FF', '#');
                if (color.indexOf('#') == -1) {
                    color = '#' + color.substring(2);
                }
                bgRgbColor = this.getBGColor(color);
            }
        }
        if (bgRgbColor != null) {
            headerDiv.css('background-color', bgRgbColor);
            mainInfoDiv.css('border', '3px solid ' + color);
            mainInfoDiv.css('border-radius', '3px');
        }
        return mainInfoDiv;
    };
    MapLayerInfoService.prototype.getUrlVars = function (URL) {
        var vars = [], hash;
        var hashes = URL.slice(URL.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    };
    MapLayerInfoService.prototype.setInfoBoxForKml = function (zoom, isWizard, infoData) {
        var _this = this;
        var mainInfoDiv = $('<div>');
        mainInfoDiv.addClass("maininfodiv");
        //infoData = infoData.reverse();
        var Table = [];
        var headerDiv = $('<div>');
        headerDiv.addClass("infoHeader");
        headerDiv.addClass("infoFooter");
        headerDiv.appendTo(mainInfoDiv);
        headerDiv.addClass("drag" + this.infoBoxCount);
        // if (infoData.length > 0) {
        //   this.SetIcon(infoData, headerDiv);
        // }
        // if (infoData.length > 0) {
        //   this.SetPagination(infoData, headerDiv, mainInfoDiv)
        // }
        var pin = $('<i class="fa fa-thumb-tack sticky pinH"></i>');
        pin.click(function ($event) {
            _this.StickyBox(event);
        });
        pin.appendTo(headerDiv);
        if (infoData != null && infoData != "") {
            //for (let x in infoData) {
            //var layer = infoData[x].layer;
            var data = infoData;
            //var layerType = 'pipeline';
            //this.DeatailsProperty = [];
            //this.DeatailsProperty.push(infoData[x].InfoBoxProperty);
            //var filter = infoData[x].filter;
            //if (layerType == "pipeline") {
            Table.push(this.setKmlData(data));
            //}
            // if (parseInt(x) > 0 && Table[x] != undefined)
            //   Table[x].hide();
            //}
        }
        if (Table.length > 0) {
            for (var x in Table)
                $(Table[x]).appendTo(mainInfoDiv);
            // $(document.createElement('div')).addClass('pointer bottomLeft').appendTo(mainInfoDiv);
            // $('<canvas id="canvas" class="triangle" width="50" height="50"></canvas>').appendTo(mainInfoDiv);
        }
        // var footerDiv = $('<div>');
        // footerDiv.addClass("infoFooter");
        // footerDiv.addClass("infoBottom");
        // var NoteLink = $('<span id="#NoteLink" class="footerLink NoteLink">Add new Note</span>');
        // var FeedbackLink = $('<span id="FeedbackLink' + this.infoBoxCount + '" class="footerLink FeedbackLink">Feedback</span>');
        // NoteLink.appendTo(footerDiv);
        // FeedbackLink.appendTo(footerDiv);
        // footerDiv.appendTo(mainInfoDiv);
        return mainInfoDiv;
    };
    MapLayerInfoService.prototype.SetIcon = function (infoData, headerDiv) {
        var style = "";
        var wmsGraphics = infoData[0].IconType;
        var Shape = infoData[0].Shape;
        var ShapeURL = infoData[0].ShapeURL;
        var $indicator = $("<div>");
        $indicator.addClass("indicator");
        $indicator.addClass("drag" + this.infoBoxCount);
        if (wmsGraphics != "")
            $indicator.addClass(wmsGraphics);
        // if (Shape == "Point" && wmsGraphics != "circle") {
        var imgHtml = "<img class='InfoboxIconimage' src=" + ShapeURL + " style='margin-left:5px;max-width:15px'>";
        if (ShapeURL.indexOf('http://energymapit.com/en/Handlers/IconImage.ashx') >= 0) {
            var src = ShapeURL;
            var srcWidth = "100";
            var srcOpacity = "1";
            if (src) {
                var splitedval = src.split('?');
                var val = splitedval[1].split('&');
                for (var _i = 0, val_1 = val; _i < val_1.length; _i++) {
                    var iconstyle = val_1[_i];
                    var s = iconstyle.split('=');
                    var key = s[0];
                    var val1 = s[1];
                    if (key == "SizePercent") {
                        srcWidth = val1;
                    }
                    else if (key == "Opacity") {
                        srcOpacity = val1;
                    }
                }
            }
            srcWidth = Math.round(parseInt(srcWidth) * 20 / 100) + "px";
            var opacityPoint = 1;
            if (parseInt(srcOpacity) > 0) {
                opacityPoint = 1 - (parseInt(srcOpacity) / 100);
            }
            srcOpacity = "" + parseFloat(opacityPoint.toFixed(2));
            imgHtml = "<img class='InfoboxIconimage' src=" + ShapeURL + " style='margin-left:5px;width:" + srcWidth + ";opacity:'" + srcOpacity + "'>";
        }
        else {
            imgHtml = "<img class='InfoboxIconimage' src=" + ShapeURL + " style='margin-left:5px;max-width:15px'>";
        }
        $indicator.append(imgHtml);
        style = "";
        headerDiv.append($indicator);
    };
    MapLayerInfoService.prototype.SetPagination = function (infoData, ParentDiv, mainInfoDiv) {
        var _this = this;
        var pagerDiv = $('<div>');
        pagerDiv.addClass("infoPager");
        pagerDiv.addClass("drag" + this.infoBoxCount);
        pagerDiv.appendTo(ParentDiv);
        if (infoData.length > 1) {
            var $span = $("<span>");
            var nextDiv = $("<div>");
            nextDiv.addClass("arrow next");
            var prevDiv = $("<div>");
            prevDiv.addClass("arrow prev");
            prevDiv.appendTo(pagerDiv);
            $span.appendTo(pagerDiv);
            nextDiv.appendTo(pagerDiv);
            pagerDiv.appendTo(ParentDiv);
            this.setInfoPager(1, prevDiv, nextDiv, $span, infoData, mainInfoDiv);
            nextDiv.click(function () {
                var current = parseInt($span.attr("current"));
                if (current < infoData.length) {
                    current++;
                    _this.setInfoPager(current, prevDiv, nextDiv, $span, infoData, mainInfoDiv);
                }
            });
            prevDiv.click(function () {
                var current = parseInt($span.attr("current"));
                if (current > 1) {
                    current--;
                    _this.setInfoPager(current, prevDiv, nextDiv, $span, infoData, mainInfoDiv);
                }
            });
        }
    };
    MapLayerInfoService.prototype.setInfoPager = function (current, prevDiv, nextDiv, $span, infoData, mainInfoDiv) {
        var infoBoxDetail = {
            index: current - 1,
            infoBoxId: mainInfoDiv.attr('id'),
            infoData: infoData
        };
        if (infoBoxDetail.infoBoxId) {
            var infoDataindex = this.ActiveInfoBoxPageInfo.findIndex(function (x) { return x.infoBoxId == infoBoxDetail.infoBoxId; });
            if (infoDataindex !== -1)
                this.ActiveInfoBoxPageInfo.splice(infoDataindex, 1);
            this.ActiveInfoBoxPageInfo.push(infoBoxDetail);
        }
        nextDiv.removeClass("disable");
        prevDiv.removeClass("disable");
        $span.attr("current", current);
        $span.html("Feature " + current + " of " + infoData.length);
        if (current == infoData.length)
            nextDiv.addClass("disable");
        else if (current == 1)
            prevDiv.addClass("disable");
        var infoDiv = mainInfoDiv.children(".infoDiv");
        if (infoDiv.length > 0) {
            for (var x = 0; x < infoDiv.length; x++) {
                if ((x + 1) == current)
                    $(infoDiv[x]).show();
                else
                    $(infoDiv[x]).hide();
            }
        }
    };
    MapLayerInfoService.prototype.setKmlData = function (data) {
        var $infoDiv = $("<div>");
        $infoDiv.addClass('infoDiv p-3');
        var $infoName = $("<div>");
        $infoName.addClass('kmlInfoTitle');
        $infoName.html(data.Name);
        var $infoDescription = $("<div>");
        $infoDescription.addClass('kmlInfoDesc');
        $infoDescription.html(data.Description);
        $infoDiv.append($infoName);
        $infoDiv.append($infoDescription);
        return $infoDiv;
    };
    MapLayerInfoService.prototype.makePipelineTableHTML = function (myArray, energyLayer, index) {
        // wmsGraphics = wmsGraphics.toLowerCase();
        var $infoDiv = $("<div>");
        $infoDiv.addClass('infoDiv');
        var layerType = "";
        layerType = myArray["COMMODITY"];
        if (layerType == "Miscellaneous")
            layerType = myArray["COMMODITY2"];
        var title = myArray["SYSTEM"];
        if (title != undefined && title != "") {
            var $infoTitle = $("<div>");
            $infoTitle.addClass('infoTitle');
            var $title = $("<div>");
            $title.addClass("title");
            $title.html(title);
            $infoTitle.append($title);
        }
        var $infoTable = $("<table>");
        $infoTable.css("width", "100%");
        var latest = [];
        for (var a = 0; a < this.DeatailsProperty.length; a++) {
            var PropertyFirst = this.DeatailsProperty[a].split(',');
            for (var i = 0; i < PropertyFirst.length; i++) {
                var PropertySecond = PropertyFirst[i].split('=');
                var proandval = {
                    prop: PropertySecond[1],
                    displayval: PropertySecond[0]
                };
                latest.push(proandval);
            }
        }
        for (var a in myArray) {
            for (var i = 0; i < latest.length; i++) {
                if (latest[i]["prop"] == a) {
                    $infoTable.append(this.getInfoRowD(latest[i]["displayval"], myArray[a], 2));
                }
            }
        }
        $infoDiv.append($infoTable);
        if (energyLayer && energyLayer.TableName) {
            var footerDiv = $('<div>');
            footerDiv.addClass("infoBottom");
            footerDiv.addClass("infoFooter");
            var footerLinkWrap = $('<div>');
            footerLinkWrap.addClass('info-footer-link-wrapper');
            var NoteLink = $('<span id="NoteLink' + this.infoBoxCount + index + '" class="footerLink NoteLink">+Note</span>');
            NoteLink.appendTo(footerLinkWrap);
            if (energyLayer && energyLayer.isEnergyLayer == true) {
                var FeedbackLink = $('<span id="FeedbackLink' + this.infoBoxCount + '" class="footerLink FeedbackLink">+Feedback</span>');
                FeedbackLink.appendTo(footerLinkWrap);
            }
            var NotesWrapperDiv = $('<div class="notes-wrapper-block" id="NotesWrap' + this.infoBoxCount + index + '"></div>');
            NotesWrapperDiv.appendTo(footerDiv);
            footerLinkWrap.appendTo(footerDiv);
            footerDiv.appendTo($infoDiv);
        }
        return $infoDiv;
    };
    MapLayerInfoService.prototype.getInfoRowD = function (i, x, colspan) {
        var $infoRow = $("<tr>");
        var infoColDiv = $("<td>");
        if (colspan > 0)
            infoColDiv.attr("colspan", colspan);
        infoColDiv.append(this.getInfoCol(i, x));
        $infoRow.append(infoColDiv);
        return $infoRow;
    };
    MapLayerInfoService.prototype.getInfoCol = function (x, val) {
        var infoColDiv = $("<div>");
        infoColDiv.addClass('infocol row');
        // infoColDiv.attr('id',x);
        if (val == "" || val == undefined || parseFloat(val) == 0)
            val = "N/A";
        else if (!isNaN(val)) {
            if (String(val).indexOf('.') > -1)
                val = this.UtilityService.format(val, 2);
        }
        var htmlProrperty = '<span class="col-md-4 prop">' + x.replace("_", " ") + '</span>'; //this.toProperCase()
        var htmlValue = '<span class="col-md-8 val">' + val + '</span>';
        if (x == "Link") {
            htmlValue = '<span class="col-md-8 val"><a target="blank" href=' + val + '>' + val + '</a></span>';
        }
        var htmlContent = htmlProrperty + htmlValue;
        infoColDiv.html(htmlContent);
        return infoColDiv;
    };
    MapLayerInfoService.prototype.FilterInfoBox = function (FilterValueData) {
        if (FilterValueData != null && FilterValueData != "") {
            if (FilterValueData.indexOf(";") !== -1) {
                var Filter = FilterValueData.split(';');
                this.FilterLoopInfobox(Filter);
            }
            else if (FilterValueData.indexOf("#OR#") !== -1) {
                var Filter = FilterValueData.split('#OR#');
                this.FilterLoopInfobox(Filter);
            }
            else {
                this.FilterSigleInfobox(FilterValueData);
            }
        }
        return this.FilterALL;
    };
    MapLayerInfoService.prototype.FilterLoopInfobox = function (Filter) {
        for (var i = 0; i < Filter.length; i++) {
            if (Filter[i].indexOf("=") !== -1 && Filter[i].indexOf("<") == -1 && Filter[i].indexOf(">") == -1) {
                var FilterValue = Filter[i].split('=');
                this.FilterALL.push({ "x": FilterValue[0], "y": FilterValue[1] });
            }
            if (Filter[i].indexOf(">") !== -1 && Filter[i].indexOf("=") == -1) {
                var FilterValue = Filter[i].split('>');
                this.FilterALL.push({ "x": FilterValue[0], "y": FilterValue[1] });
            }
            if (Filter[i].indexOf("<") !== -1 && Filter[i].indexOf("=") == -1) {
                var FilterValue = Filter[i].split('<');
                this.FilterALL.push({ "x": FilterValue[0], "y": FilterValue[1] });
            }
            if (Filter[i].indexOf("<=") !== -1) {
                var FilterValue = Filter[i].split('<=');
                this.FilterALL.push({ "x": FilterValue[0], "y": FilterValue[1] });
            }
            if (Filter[i].indexOf("#EQUAL#") !== -1) {
                var FilterValue = Filter[i].split('#EQUAL#');
                this.FilterALL.push({ "x": FilterValue[0], "y": FilterValue[1] });
            }
            if (Filter[i].indexOf("#LIKE#") !== -1) {
                var FilterValue = Filter[i].split('#LIKE#');
                this.FilterALL.push({ "x": FilterValue[0], "y": FilterValue[1] });
            }
        }
        return this.FilterALL;
    };
    MapLayerInfoService.prototype.FilterSigleInfobox = function (Filter) {
        if (Filter.indexOf("#EQUAL#") !== -1) {
            var FilterValue = Filter.split('#EQUAL#');
            this.FilterALL.push({ "x": FilterValue[0], "y": FilterValue[1] });
        }
        if (Filter.indexOf("=") !== -1 && Filter.indexOf("<") == -1 && Filter.indexOf(">") == -1 && Filter.indexOf("#EQUAL#") == -1) {
            var FilterValue = Filter.split('=');
            this.FilterALL.push({ "x": FilterValue[0], "y": FilterValue[1] });
        }
        if (Filter.indexOf(">") !== -1 && Filter.indexOf("=") == -1 && Filter.indexOf("#EQUAL#") == -1) {
            var FilterValue = Filter.split('>');
            this.FilterALL.push({ "x": FilterValue[0], "y": FilterValue[1] });
        }
        if (Filter.indexOf("<") !== -1 && Filter.indexOf("=") == -1 && Filter.indexOf("#EQUAL#") == -1) {
            var FilterValue = Filter.split('<');
            this.FilterALL.push({ "x": FilterValue[0], "y": FilterValue[1] });
        }
        if (Filter.indexOf("<=") !== -1 && Filter.indexOf("#EQUAL#") == -1) {
            var FilterValue = Filter.split('<=');
            this.FilterALL.push({ "x": FilterValue[0], "y": FilterValue[1] });
        }
        if (Filter.indexOf("#LIKE#") !== -1) {
            var FilterValue = Filter.split('#LIKE#');
            this.FilterALL.push({ "x": FilterValue[0], "y": FilterValue[1] });
        }
        return this.FilterALL;
    };
    MapLayerInfoService.prototype.StickyBox = function (ele) {
        if (ele.target != undefined) {
            if ($(ele.target).hasClass('pinH')) {
                $(ele.target).removeClass('pinH');
                $(ele.target.parentElement.parentElement.parentElement).addClass('pinned');
            }
            else {
                $(ele.target).addClass('pinH');
                $(ele.target.parentElement.parentElement.parentElement).removeClass('pinned');
                setTimeout(function () {
                    ele.target.parentElement.parentElement.parentElement.remove();
                }, 10000);
            }
        }
    };
    MapLayerInfoService.prototype.updatePointer = function (target, offset, infoBoxModal) {
        var pointEndHeight = 50;
        if (target.offsetHeight < 100) {
            pointEndHeight = 20;
        }
        var canvas1;
        var canvasElement = $(target).find("canvas");
        if (canvasElement != null && canvasElement != undefined) {
            canvas1 = canvasElement[0];
        }
        if (canvas1) {
            var locationPointX = parseInt($(canvas1).attr('data-x'));
            var locationPointY = parseInt($(canvas1).attr('data-y'));
            var dataId_1 = parseInt($(canvas1).attr('data-id'));
            var locData = this.locationList.find(function (x) { return dataId_1 == x.id; });
            if (locData) {
                var points = this.latLng2Point(locData.data.latLng);
                locationPointX = points.x;
                locationPointY = points.y + 78;
            }
            // let locationPointX = parseInt($(canvas1).attr('data-x'));
            // let locationPointY = parseInt($(canvas1).attr('data-y'));
            //document.getElementById('movingpoint').textContent = ' [' + event.pageX + ',' + event.pageY + '] [' + ui.offset.left + "," + ui.offset.top;
            // canvas1.style.left = points.x + "px";
            // canvas1.style.top = points.y + "px";
            canvas1.style.left = (locationPointX - offset.left) + "px";
            canvas1.style.top = (locationPointY - offset.top) + "px";
            canvas1.style.width = (Math.abs(locationPointX - offset.left) + 100) + "px";
            canvas1.style.height = (Math.abs(locationPointY - offset.top) + 100) + "px";
            // if (target.offsetHeight < 100) {
            //   canvas1.style.height = (parseInt(canvas1.style.height) - 100) + 'px';
            // }
            var x0 = 0, y0 = 0;
            var x1 = canvas1.width, y1 = canvas1.height - pointEndHeight;
            var x2 = canvas1.width, y2 = canvas1.height;
            if ((locationPointX > (offset.left + 90)) && (locationPointY > (offset.top + 50))) {
                canvas1.style.width = (parseInt(canvas1.style.width) - 150) + "px";
                canvas1.style.height = (parseInt(canvas1.style.height) - 150) + "px";
                canvas1.style.top = '50px';
                canvas1.style.left = '50px';
                x0 = canvas1.width;
                y0 = canvas1.height;
                x1 = 0, y1 = 0;
                x2 = 0, y2 = pointEndHeight;
            }
            else if (locationPointX > (offset.left + 90)) {
                canvas1.style.width = parseInt(canvas1.style.width) - (280 - 90) + 'px';
                canvas1.style.left = '90px';
                x0 = canvas1.width;
                x1 = 0, y1 = canvas1.height;
                x2 = 0, y2 = canvas1.height - pointEndHeight;
            }
            else if (locationPointY > (offset.top + 50)) {
                canvas1.style.height = (parseInt(canvas1.style.height) - 150) + 'px';
                canvas1.style.top = '50px';
                y0 = canvas1.height;
                y1 = 0, x1 = canvas1.width;
                y2 = pointEndHeight, x2 = canvas1.width;
            }
            var w = canvas1.width;
            var h = canvas1.height;
            // render the lines
            var ctx = canvas1.getContext("2d");
            ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
            ctx.globalAlpha = 1; // reset alpha  
            ctx.clearRect(0, 0, w, h);
            ctx.strokeStyle = "black";
            ctx.fillStyle = "white";
            ctx.lineWidth = 1;
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.lineTo(x0, y0); // Fix Point  of Line    
            ctx.lineTo(x1, y1); // Increses two Line Distance 
            ctx.lineTo(x2, y2);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            if (infoBoxModal && infoBoxModal.setOptions)
                infoBoxModal.setOptions({ pixelOffset: new google.maps.Size(offset.left - locationPointX, offset.top - locationPointY) });
        }
    };
    MapLayerInfoService.prototype.RemoveInfoBoxByIds = function (Id) {
        var _this = this;
        var data = this.openedInfoboxes.filter(function (x) { return x.Id == Id; });
        if (data && data.length > 0) {
            data.forEach(function (x) {
                _this.hideInfoBoxmodal(x.Infobox, true);
            });
        }
        for (var i = 0; i < this.openedInfoboxes.length; i++) {
            var item = this.openedInfoboxes[i];
            if (item.Id == Id)
                this.openedInfoboxes.splice(i, 1);
        }
    };
    MapLayerInfoService.prototype.OpenMapLayerFeedback = function (data) {
        var activeModel = this.modalService.open(map_layer_feedback_component_1.MapLayerFeedbackComponent, { size: 'sm', centered: true, keyboard: false, backdrop: 'static', windowClass: 'feedback-modal' });
        activeModel.componentInstance.data = data;
    };
    MapLayerInfoService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [map_service_service_1.MapServiceService,
            Utility_service_1.UtilityService,
            all_http_request_service_1.HttpRequestService,
            auth_service_1.AuthenticationService,
            ng_bootstrap_1.NgbModal])
    ], MapLayerInfoService);
    return MapLayerInfoService;
}());
exports.MapLayerInfoService = MapLayerInfoService;
//# sourceMappingURL=map-layer-info.service.js.map