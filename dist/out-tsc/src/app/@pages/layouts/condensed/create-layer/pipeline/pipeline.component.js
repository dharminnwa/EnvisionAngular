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
var PipelineComponent = (function (_super) {
    __extends(PipelineComponent, _super);
    function PipelineComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // CondensedComponent: CondensedComponent;
        // constructor(public bsModalRef: BsModalRef,
        //   public UtilityService: UtilityService,
        //   public MapServiceService: MapServiceService,
        //   public injector: Injector,
        //   public authServices: AuthenticationService,
        //   public httpRequestService: HttpRequestService
        // ) { 
        //   super(bsModalRef,UtilityService,MapServiceService,injector,authServices,httpRequestService); 
        // }
        _this.targetCommodities = [];
        _this.sourceCommodities = [];
        _this.targetOwner = [];
        _this.sourceOwner = [];
        _this.ColorByOwner = 'Owner';
        _this.ColorByOperator = 'Operator';
        _this.ColorBySystem = 'System';
        _this.targetOperator = [];
        _this.sourceOperator = [];
        _this.targetSystem = [];
        _this.sourceSystem = [];
        _this.AllPipelinecomodityList = {
            Commodities: [],
            OpConnections: [],
            OwConnections: [],
            SysConnections: [],
        };
        _this.PipelineLoader = true;
        _this.ActivePipelineTab = "Owner";
        _this.tempLayerDataPropList = [];
        _this.dataResult = {
            Description: 'Pipelines wizard result',
            DataSetID: "200008",
            TreeStatus: 'GroupLayer',
            Tags: 'Pipelines wizard result',
            PreviewImage: 'http://mapsearch360.com/images/datasetimage.png',
            IconType: 'Line',
            TableName: 'import_xpipelines_2015_11_30',
            LayerTypeId: '9',
            DBFProperties: 'MSID,OWNER,NUMOWNERS,LEASED,OPERATOR,COMMODITY,COMMODITY2,PRIMBATCH1,SECBATCH1,PRIMBATCH2,SECBATCH2,LINETYPE,SYSTEM,DIAMETER,MDIAMETER,STATUS,CORRIDOR,SEGMENTNUM,TX_T4,TX_P5,UPDATED,UPDATED_SP,METACODE,LASTOWNER,LASTOPER,MILEAGE,COUNTRY,STATE_NAME,COUNTY,RELEASE_DT,SYSTYPE',
            DetailPanelProperties: 'Owner=OWNER,Operator=OPERATOR,Commodity=COMMODITY,Commodity2=COMMODITY2,Line Type=LINETYPE,System=SYSTEM,Diameter=DIAMETER,Status=STATUS,Mileage=MILEAGE,Country=COUNTRY,State=STATE_NAME,County=COUNTY',
            OwnerFieldName: "OWNER",
            CommodityFieldName: "COMMODITY",
            OperatorFieldName: "OPERATOR",
            SystemFieldName: "SYSTEM",
            DataSetName: "Pipelines by "
        };
        _this.ImageURLPath = environment_1.environment.ImagespreviewPath;
        return _this;
    }
    PipelineComponent.prototype.ngOnInit = function () {
        var _this = this;
        try {
            this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
            var PipelinecreateToolListData_1 = this.MapServiceService.PipelineCreateLayer.getValue();
            if (PipelinecreateToolListData_1 != null) {
                // setTimeout(() => {
                this.setPipleLineresData(PipelinecreateToolListData_1);
                this.PipelineLoader = false;
                // }, 500);
            }
            else {
                var UserId = this.authServices.getLoggedinUserId();
                this.httpRequestService._NodeGetPipelineWizardData(UserId).subscribe(function (data) {
                    if (data.errormsg == "" || data.errormsg == {}) {
                        var PipleLineres = data;
                        if (PipleLineres.Commodities.length > 0) {
                            if (!PipelinecreateToolListData_1) {
                                _this.MapServiceService.setPipelinecreatetool(PipleLineres);
                            }
                            _this.setPipleLineresData(PipleLineres);
                            _this.PipelineLoader = false;
                        }
                        else {
                            alert("Please try again!..");
                        }
                    }
                    else {
                        console.log(data.errormsg);
                    }
                }, function (error) {
                    console.log(error);
                });
            }
        }
        catch (e) {
            console.log(e);
        }
        // setTimeout(() => {
        //   this.onSearchChangeevent();
        // }, 1000);
    };
    PipelineComponent.prototype.setPipleLineresData = function (PipleLineres) {
        var OwenerIndexval = 0;
        var OperatorIndexval = 0;
        var systemindexval = 0;
        for (var i = 0; i < PipleLineres.Commodities.length; i++) {
            var Commodityval = PipleLineres.Commodities[i];
            var propcomodity = {
                id: "" + i,
                name: Commodityval.Name,
                isChecked: false
            };
            this.sourceCommodities.push(propcomodity);
            this.AllPipelinecomodityList.Commodities.push(propcomodity);
            if (PipleLineres.Commodities[i].OwConnections.length > 0) {
                for (var o = 0; o < PipleLineres.Commodities[i].OwConnections.length; o++) {
                    var Ownerval = PipleLineres.Commodities[i].OwConnections[o];
                    var propowner = {
                        ComodityId: "" + i,
                        id: "" + OwenerIndexval,
                        name: Ownerval,
                        isChecked: false
                    };
                    // this.sourceOwner.push(propowner);
                    this.AllPipelinecomodityList.OwConnections.push(propowner);
                    OwenerIndexval++;
                }
            }
            if (PipleLineres.Commodities[i].OpConnections.length > 0) {
                for (var op = 0; op < PipleLineres.Commodities[i].OpConnections.length; op++) {
                    var Operatorval = PipleLineres.Commodities[i].OpConnections[op];
                    var proOperator = {
                        ComodityId: "" + i,
                        id: "" + OperatorIndexval,
                        name: Operatorval,
                        isChecked: false
                    };
                    //this.sourceOperator.push(proOperator);
                    this.AllPipelinecomodityList.OpConnections.push(proOperator);
                    OperatorIndexval++;
                }
            }
            if (PipleLineres.Commodities[i].SysConnections.length > 0) {
                for (var s = 0; s < PipleLineres.Commodities[i].SysConnections.length; s++) {
                    var Systemval = PipleLineres.Commodities[i].SysConnections[s];
                    var proSystem = {
                        ComodityId: "" + i,
                        id: "" + systemindexval,
                        name: Systemval,
                        isChecked: false
                    };
                    //this.sourceSystem.push(proSystem);
                    this.AllPipelinecomodityList.SysConnections.push(proSystem);
                    systemindexval++;
                }
            }
        }
        this.BindAllPicklist();
    };
    PipelineComponent.prototype.setPipelineActiveTab = function (Activetab) {
        this.ActivePipelineTab = Activetab;
    };
    PipelineComponent.prototype.BindAllPicklist = function () {
        this.sourceOwner = [];
        this.sourceOperator = [];
        this.sourceSystem = [];
        var wonitems = this.AllPipelinecomodityList.OwConnections.map(function (i) {
            return i;
        });
        wonitems = _.sortBy(wonitems, "name");
        wonitems = _.uniqBy(wonitems, "name");
        this.sourceOwner = wonitems;
        var opitems = this.AllPipelinecomodityList.OpConnections.map(function (i) {
            return i;
        });
        opitems = _.sortBy(opitems, "name");
        opitems = _.uniqBy(opitems, "name");
        this.sourceOperator = opitems;
        var sysitems = this.AllPipelinecomodityList.SysConnections.map(function (i) {
            return i;
        });
        sysitems = _.sortBy(sysitems, "name");
        sysitems = _.uniqBy(sysitems, "name");
        this.sourceSystem = sysitems;
        // this.sourceSystem.push(sysitems);
    };
    PipelineComponent.prototype.SortByKey = function (array, key) {
        return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    };
    PipelineComponent.prototype.OnChangeCommoditiesList = function (list) {
        this.targetCommodities = list;
        this.SetValuebasedonSelectComodity(this.targetCommodities);
    };
    PipelineComponent.prototype.OnChangeSystemList = function (list) {
        this.targetSystem = list;
    };
    PipelineComponent.prototype.OnChangeOperatorList = function (list) {
        this.targetOperator = list;
    };
    PipelineComponent.prototype.OnChangeOwnersList = function (list) {
        this.targetOwner = list;
    };
    PipelineComponent.prototype.SetValuebasedonSelectComodity = function (CommoditiesList) {
        if (CommoditiesList.length > 0) {
            var OwnerListlist = [];
            var Operatorlist = [];
            var Systemlist = [];
            // this.targetOwner = [];
            // this.targetOperator = [];
            // this.targetSystem = [];
            for (var tc = 0; tc < CommoditiesList.length; tc++) {
                var tcval = CommoditiesList[tc];
                for (var ow = 0; ow < this.AllPipelinecomodityList.OwConnections.length; ow++) {
                    var Owval = this.AllPipelinecomodityList.OwConnections[ow];
                    if (tcval.id == Owval.ComodityId) {
                        OwnerListlist.push(Owval);
                    }
                }
                for (var op = 0; op < this.AllPipelinecomodityList.OpConnections.length; op++) {
                    var Opval = this.AllPipelinecomodityList.OpConnections[op];
                    if (tcval.id == Opval.ComodityId) {
                        Operatorlist.push(Opval);
                    }
                }
                for (var sy = 0; sy < this.AllPipelinecomodityList.SysConnections.length; sy++) {
                    var syval = this.AllPipelinecomodityList.SysConnections[sy];
                    if (tcval.id == syval.ComodityId) {
                        Systemlist.push(syval);
                    }
                }
            }
            this.sourceOwner = [];
            this.sourceOperator = [];
            this.sourceSystem = [];
            var size = 850;
            var wonitems = OwnerListlist.map(function (i) {
                return i;
            });
            wonitems = _.uniqBy(wonitems, "name");
            this.sourceOwner = wonitems;
            var opitems = Operatorlist.map(function (i) {
                return i;
            });
            opitems = _.uniqBy(opitems, "name");
            this.sourceOperator = opitems;
            var sysitems = Systemlist.map(function (i) {
                return i;
            });
            sysitems = _.uniqBy(sysitems, "name");
            this.sourceSystem = sysitems;
        }
        else {
            this.BindAllPicklist();
        }
    };
    PipelineComponent.prototype.CreateLayerForPipelineOwner = function () {
        this.RemoveExistingTempData(this.dataResult.DataSetID);
        var tempObjParent = this.GetParentTempObject(this.ColorByOwner, this.dataResult);
        if (this.ColorByOwner == 'Owner') {
            this.SetChildrenNodesByList(this.targetOwner, tempObjParent, this.dataResult.OwnerFieldName, this.dataResult.CommodityFieldName, this.targetCommodities, this.dataResult);
        }
        else {
            this.SetChildrenNodesByList(this.targetCommodities, tempObjParent, this.dataResult.CommodityFieldName, this.dataResult.OwnerFieldName, this.targetOwner, this.dataResult);
        }
    };
    PipelineComponent.prototype.CreateLayerForPipelineOperator = function () {
        this.RemoveExistingTempData(this.dataResult.DataSetID);
        var tempObjParent = this.GetParentTempObject(this.ColorByOperator, this.dataResult);
        if (this.ColorByOperator == 'Operator') {
            this.SetChildrenNodesByList(this.targetOperator, tempObjParent, this.dataResult.OperatorFieldName, this.dataResult.CommodityFieldName, this.targetCommodities, this.dataResult);
        }
        else {
            this.SetChildrenNodesByList(this.targetCommodities, tempObjParent, this.dataResult.CommodityFieldName, this.dataResult.OperatorFieldName, this.targetOperator, this.dataResult);
        }
    };
    PipelineComponent.prototype.CreateLayerForPipelineSystem = function () {
        this.RemoveExistingTempData(this.dataResult.DataSetID);
        var tempObjParent = this.GetParentTempObject(this.ColorBySystem, this.dataResult);
        if (this.ColorBySystem == 'System') {
            this.SetChildrenNodesByList(this.targetSystem, tempObjParent, this.dataResult.SystemFieldName, this.dataResult.CommodityFieldName, this.targetCommodities, this.dataResult);
        }
        else {
            this.SetChildrenNodesByList(this.targetCommodities, tempObjParent, this.dataResult.CommodityFieldName, this.dataResult.SystemFieldName, this.targetSystem, this.dataResult);
        }
    };
    PipelineComponent = __decorate([
        core_1.Component({
            selector: 'app-pipeline',
            templateUrl: './pipeline.component.html',
            styleUrls: ['./pipeline.component.scss']
        })
    ], PipelineComponent);
    return PipelineComponent;
}(create_layer_component_1.CreateLayerComponent));
exports.PipelineComponent = PipelineComponent;
//# sourceMappingURL=pipeline.component.js.map