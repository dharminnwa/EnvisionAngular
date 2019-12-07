"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var environment_1 = require("../../../../../../environments/environment");
var _ = require("lodash");
var create_layer_component_1 = require("../create-layer.component");
var RailroadComponent = (function (_super) {
    __extends(RailroadComponent, _super);
    function RailroadComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.railRoadLoader = false;
        // constructor(
        //   public bsModalRef: BsModalRef,
        //   private MapServiceService: MapServiceService,
        //   private injector: Injector,
        //   private UtilityService: UtilityService,
        //   private httpRequestService: HttpRequestService,
        //   private authenticationService: AuthenticationService) {
        //   setTimeout(() => this.CondensedComponent = injector.get(CondensedComponent));
        // }
        _this.targetCountry = [];
        _this.sourceCountry = [];
        _this.isSourceListSelectAllRailOwner = false;
        _this.isTargetListSelectAllRailOwner = false;
        _this.targetRailOwner = [];
        _this.sourceRailOwner = [];
        _this.AllRailroadList = {
            country: [],
            OwConnections: []
        };
        _this.ColorByOwner = 'Owner';
        _this.ImageURLPath = environment_1.environment.ImagespreviewPath;
        _this.dataResult = {
            Description: 'Railroad wizard result',
            DataSetID: "200008",
            TreeStatus: 'GroupLayer',
            Tags: 'Railroad wizard result',
            PreviewImage: 'http://mapsearch360.com/images/datasetimage.png',
            IconType: 'Line',
            TableName: 'us_rail',
            TableNameUs: 'us_rail',
            TableNameCa: 'ca_rail',
            TableNameAllCountry: 'all_rail',
            LayerTypeId: '9',
            DBFProperties: 'RAILROAD,owner_code,owner,TR,PASSENGER,MILITARY,FRA_REG,CLASS,MILES',
            DetailPanelProperties: 'Rail=RAILROAD,Owner=owner, Miles=MILES, Class=CLASS',
            DBFPropertiesUs: 'RAILROAD,owner_code,owner,TR,PASSENGER,MILITARY,FRA_REG,CLASS,MILES',
            DetailPanelPropertiesUs: 'Rail=RAILROAD,Owner=owner, Miles=MILES, Class=CLASS',
            DBFPropertiesCa: 'owner,f_code,prov_en,prov_fr,owner_code',
            DetailPanelPropertiesCa: 'Code=f_code,Owner=owner',
            DBFPropertiesAll: 'owner,owner_code,country,OBJECTID',
            DetailPanelPropertiesAll: 'Owner=owner,Owner Code=owner_code,Country=country',
            OwnerFieldName: "owner",
            CountryFieldName: "country",
            DataSetName: "Railroads by "
        };
        return _this;
    }
    RailroadComponent.prototype.ngOnInit = function () {
        this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
        // setTimeout(() => {
        this.RailRoadInit();
        // this.onSearchChangeforRailroadevent();
        // }, 1500);
    };
    RailroadComponent.prototype.RailRoadInit = function () {
        var _this = this;
        var RailraodcreateToolListData = this.MapServiceService.RailRoadCreateLayer.getValue();
        if (RailraodcreateToolListData != null) {
            // setTimeout(() => {
            this.setRailRoadData(RailraodcreateToolListData);
            //this.PipelineLoader = false;
            // }, 300);
        }
        else {
            this.railRoadLoader = true;
            var Userid = this.authenticationService.getLoggedinUserId();
            this.httpRequestService._NodeGetRailWizardData(Userid).subscribe(function (data) {
                if (data.errormsg == "" || data.errormsg == {}) {
                    var Railwizard = data;
                    if (Railwizard.Countries.length > 0) {
                        if (!RailraodcreateToolListData) {
                            _this.MapServiceService.setRailroadcreatetool(Railwizard);
                        }
                        _this.setRailRoadData(Railwizard);
                    }
                    else {
                        alert("Please try again!");
                    }
                }
                else {
                    console.log(data.errormsg);
                }
                _this.railRoadLoader = false;
            }, function (error) {
                console.log(error);
            });
        }
    };
    RailroadComponent.prototype.setRailRoadData = function (Railwizard) {
        var OwenerIndexval = 0;
        for (var r = 0; r < Railwizard.Countries.length; r++) {
            var Railwizardvalue = Railwizard.Countries[r];
            var propCountry = {
                id: "" + r,
                name: Railwizardvalue.Name,
                isChecked: false
            };
            this.sourceCountry.push(propCountry);
            this.AllRailroadList.country.push(propCountry);
            if (Railwizard.Countries[r].OwConnections.length > 0) {
                for (var o = 0; o < Railwizard.Countries[r].OwConnections.length; o++) {
                    var Ownerval = Railwizard.Countries[r].OwConnections[o];
                    if (Ownerval) {
                        var propowner = {
                            ComodityId: "" + r,
                            id: "" + OwenerIndexval,
                            name: Ownerval,
                            isChecked: false
                        };
                        this.AllRailroadList.OwConnections.push(propowner);
                        OwenerIndexval++;
                    }
                }
            }
        }
        this.BindAllRailRoad();
    };
    RailroadComponent.prototype.OnChangeCountryList = function (list) {
        this.targetCountry = list;
        this.SetValuebasedonSelectCountry(this.targetCountry);
    };
    RailroadComponent.prototype.OnChangeOwnerList = function (list) {
        this.targetRailOwner = list;
    };
    RailroadComponent.prototype.SetValuebasedonSelectCountry = function (CountryList) {
        if (CountryList.length > 0) {
            var OwnerListlist = [];
            // this.targetRailOwner = [];
            this.sourceRailOwner = [];
            for (var tc = 0; tc < CountryList.length; tc++) {
                var tcval = CountryList[tc];
                for (var ow = 0; ow < this.AllRailroadList.OwConnections.length; ow++) {
                    var Owval = this.AllRailroadList.OwConnections[ow];
                    if (tcval.id == Owval.ComodityId) {
                        OwnerListlist.push(Owval);
                    }
                }
            }
            this.sourceRailOwner = [];
            OwnerListlist = _.uniqBy(OwnerListlist, "name");
            OwnerListlist = _.sortBy(OwnerListlist, "name");
            this.sourceRailOwner = OwnerListlist;
        }
        else {
            this.BindAllRailRoad();
        }
    };
    RailroadComponent.prototype.BindAllRailRoad = function () {
        var wonitems = _.unionBy(this.AllRailroadList.OwConnections, "name");
        wonitems = _.sortBy(wonitems, "name");
        this.sourceRailOwner = wonitems;
    };
    RailroadComponent.prototype.CreateLayerForRailRoadOwner = function () {
        this.RemoveExistingTempData(this.dataResult.DataSetID);
        var tempObjParent = this.GetParentTempObject(this.ColorByOwner, this.dataResult);
        if (this.ColorByOwner == 'Owner') {
            this.SetChildrenNodesByList(this.targetRailOwner, tempObjParent, this.dataResult.OwnerFieldName, this.dataResult.CountryFieldName, this.targetCountry, this.dataResult, true);
        }
        else {
            this.SetChildrenNodesByList(this.targetCountry, tempObjParent, this.dataResult.CountryFieldName, this.dataResult.OwnerFieldName, this.targetRailOwner, this.dataResult, true);
        }
    };
    RailroadComponent = __decorate([
        core_1.Component({
            selector: 'app-railroad',
            templateUrl: './railroad.component.html',
            styleUrls: ['./railroad.component.scss']
        })
    ], RailroadComponent);
    return RailroadComponent;
}(create_layer_component_1.CreateLayerComponent));
exports.RailroadComponent = RailroadComponent;
//# sourceMappingURL=railroad.component.js.map