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
var http_1 = require("@angular/common/http");
var Observable_1 = require("rxjs/Observable");
var http_2 = require("@angular/common/http");
var http_3 = require("@angular/http");
var ngx_cookie_service_1 = require("ngx-cookie-service");
var ApiService = (function () {
    ////***************************End Node Js API Link ************************************/
    function ApiService(http, HttpClient, CookieService) {
        this.http = http;
        this.HttpClient = HttpClient;
        this.CookieService = CookieService;
        this.api = environment_1.environment.apiURL;
        this.Nodeapi = environment_1.environment.NodeapiURL;
        // private AmazonURL = environment.AmazonAPiURL;
        // public readonly LayerAPI = environment.newAPILayerURL;
        // public readonly LayerAPI = 'http://ec2-35-169-178-29.compute-1.amazonaws.com:8080/envision/wfs';
        this.LoginURL = this.api + "/User/LogInUser";
        this.LogOutURL = this.api + "/User/LogOut";
        //  public readonly GetLayerTreeViewData = `${this.api}/Layer/GetLayerTreeViewData`;
        // public readonly GetMapsearchLayesCategory = `${this.api}/Layer/MapSearchLayerCategory`;
        //public readonly GetMapSearchEnergyLayerLibrary = `${this.api}/Layer/MapSearchEnergyLayerLibrary`;
        // public readonly getInfoBoxData = `${this.api}/Layer/getInfoBoxData`;
        // public readonly getBaseMap = `${this.api}/Layer/GetBaseMapData`;
        // Company Profile API Link
        //public readonly GetCompanyfilterOptionsURL = `${this.AmazonURL}/CompanyProfile/GetAllCompanyOptions`;
        //public readonly GetCompanyNameSuggestiveURL = `${this.AmazonURL}/CompanyProfile/GetSuggestiveCompanyNameResults`;
        // public readonly GetAllCompnayListURL = `${this.AmazonURL}/CompanyProfile/GetAllCompnayList`;
        //public readonly GetCompanySearchResult = `${this.AmazonURL}/CompanyProfile/CompanyDataSearchDataResult`;
        // Pipeline Activity Project API Link
        //public readonly GetPipelineActivityAllFilterOption = `${this.AmazonURL}/CompanyProfile/IndustryUpdatesFilterOption`;
        //public readonly GetSuggestivePipelineActivityResults = `${this.AmazonURL}/CompanyProfile/GetSuggestivePipelineActivityResults`;
        //public readonly GetPipelineActivityGridDataURL = `${this.AmazonURL}/CompanyProfile/ListofIndustryUpdates`;
        // Generating Units API Link
        //public readonly GetAllGeneratingUnitOptions = `${this.AmazonURL}/CompanyProfile/GetAllGeneratingUnitOptions`;
        //    public readonly GetSuggestiveGeneratingUnitsResults = `${this.AmazonURL}/CompanyProfile/GetSuggestiveGeneratingUnitsResults`;
        //public readonly GetGeneratingUnits = `${this.AmazonURL}/CompanyProfile/GetGeneratingUnits`;
        //Transmission API Link
        //public readonly GetAllTransmissionProjectFilterOptions = `${this.AmazonURL}/CompanyProfile/GetAllProjectDataOptions`;
        //public readonly GetSuggestiveTransmissionProjectDataResults = `${this.AmazonURL}/CompanyProfile/GetSuggestiveProjectDataResults`;
        //public readonly GetTransmissionProjectsData = `${this.AmazonURL}/CompanyProfile/GetProjectsData`;
        //Power Plant API Link
        //public readonly GetAllPowerPlantFilterOptions = `${this.AmazonURL}/CompanyProfile/GetAllPowerPlantsOptions`;
        //public readonly GetSuggestivePowerplantResults = `${this.AmazonURL}/CompanyProfile/GetSuggestivePowerplantResults`;
        //public readonly GetPowerPlantsData = `${this.AmazonURL}/CompanyProfile/GetPowerPlants`;
        //Home Page Data API Link
        // public readonly GetAssetLookupData = `${this.api}/Dashboard/GetAssetLookupData`;
        //public readonly GetParcelStates = `${this.api}/Dashboard/GetParcelStates`;
        //    public readonly GetWellStates = `${this.api}/Dashboard/GetWellStates`;
        //public readonly GetTransProjects = `${this.api}/Dashboard/GetTransProjects`;
        //public readonly GetPipelineActivities = `${this.api}/Dashboard/GetPipelineActivities`;
        // Tools API Link
        // public readonly getBookMarks = `${this.api}/Tool/GetAllBookMarksByUser`;
        // public readonly saveBookMark = `${this.api}/Tool/SaveBookMark`;
        //public readonly deleteBookmark = `${this.api}/Tool/DeleteBookmark`;
        //public readonly getUserMaps = `${this.api}/Tool/GetMapsByUserID`;
        // public readonly GetmapImage = `${this.api}/Tool/ConvertHtmlToImage`;
        //Private Layer
        //public readonly PostFileURL = `${this.api}/AddData/UploadFiles`;
        //public readonly GetMyDataLibrary = `${this.api}/Layer/MyDataLibrary`;
        //public readonly GetPrivateLayerTreeViewData = `${this.api}/AddData/GetPrivateLayerTreeViewData`;
        //public readonly RemoveLayerFromMyDataLibrary = `${this.api}/AddData/RemoveLayerFromMyDataLibrary`;
        //public readonly GetKmlData = `${this.api}/AddData/GetKmlData`;
        /// Layer style by User 
        // public readonly SaveLayerStyles = `${this.api}/Layer/SaveLayerStyles`;
        // public readonly SavePrivateLayerStyles = `${this.api}/Layer/SavePrivateLayerStyles`;
        // public readonly SaveCustomSymbols = `${this.api}/Layer/SaveCustomSymbols`;
        // public readonly DeleteExternalSysmbols = `${this.api}/Layer/DeleteExternalSysmbols`;
        //Create Layer tool
        // public readonly GetPipelineWizardData = `${this.api}/CreateLayerTool/GetPipelineWizardData`;
        // public readonly GetRailWizardData = `${this.api}/CreateLayerTool/GetRailWizardData`;
        //Global Search API
        //public readonly GetglobalSearchEnergylayer = `${this.api}/GlobalSearch/GetglobalSearchEnergylayer`;
        //public readonly SaveTemporaryLayer = `${this.api}/GlobalSearch/SaveTemporaryLayer`;
        ///****************************Start Node Js API Link *****************************************/
        //***************************** Start Intelligence Section***************************************/
        //*****Home Page Data API Link */
        //public readonly _NodeGetAssetLookupData = `${this.Nodeapi}/HomeDashboard/GetAssetLookupData`;
        this._NodeGetAssetLookupData = this.Nodeapi + "/HomeDashboard/GetFacilityData";
        this._NodeGetParcelStates = this.Nodeapi + "/HomeDashboard/GetParcelStates";
        this._NodeGetComodityStatename = this.Nodeapi + "/HomeDashboard/GetStateBasedonComodity";
        this._NodeGetCommodityBasedonStateandType = this.Nodeapi + "/HomeDashboard/GetCommodityBasedonStateandType";
        this._NodeGetFactypeBasedonStateandCommodity = this.Nodeapi + "/HomeDashboard/GetFactypeBasedonStateandCommodity";
        this._NodeGetTypeandCommoditybasedonstate = this.Nodeapi + "/HomeDashboard/GetTypeandCommoditybasedonstate";
        // start Home Deshboard PipeLine
        this._NodeGetPiplelineandothertabData = this.Nodeapi + "/HomeDashboard/GetAllPipelineData";
        this._NodeGetPiplelineDatabasedonfilter = this.Nodeapi + "/HomeDashboard/GetPiplelineDatabasedonFiltervalue";
        this._NodeGetPowerPlantDatabasedonfilter = this.Nodeapi + "/HomeDashboard/GetPowerPlantDatabasedonFilter";
        this._NodeGetSubstationDatabasedonfilter = this.Nodeapi + "/HomeDashboard/GetSubstationDatabasedonfilter";
        this._NodeGetTransmissionDatabasedonfilter = this.Nodeapi + "/HomeDashboard/GetTransmissionDatabasedonFilter";
        // end Home Deshboard Pipeline
        this._NodeGetWellStates = this.Nodeapi + "/HomeDashboard/GetWellsstate";
        this._NodeGetTransProjects = this.Nodeapi + "/HomeDashboard/GetTransProjects";
        this._NodeGetPipelineActivities = this.Nodeapi + "/HomeDashboard/GetPipelineActivities";
        /*****Company Profile API Link */
        this._NodeGetCompanyfilterOptionsURL = this.Nodeapi + "/CompanyProfile/GetAllCompanyOptions";
        this._NodeGetCompanyNameSuggestiveURL = this.Nodeapi + "/CompanyProfile/GetSuggestiveCompanyNameResults";
        this._NodeGetAllCompnayListURL = this.Nodeapi + "/CompanyProfile/GetAllCompnayList";
        this._NodeGetCompanySearchResult = this.Nodeapi + "/CompanyProfile/CompanyDataSearchDataResult";
        this._NodeGetAllJsonCompnayListURL = this.Nodeapi + "/CompanyProfile/GetJsonfiledata";
        this._NodeGetFilterCompnayListURL = this.Nodeapi + "/CompanyProfile/GetFilterCompnayList";
        /******Pipeline Activity API Link */
        this._NodeGetPipelineActivityGridDataURL = this.Nodeapi + "/PipelineActivity/ListofIndustryUpdates";
        this._NodeGetPipelineActivityAllFilterOption = this.Nodeapi + "/PipelineActivity/IndustryUpdatesFilterOption";
        this._NodeGetSuggestivePipelineActivityResults = this.Nodeapi + "/PipelineActivity/GetSuggestivePipelineActivityResults";
        /******Transmission API Link */
        this._NodeGetAllTransmissionProjectFilterOptions = this.Nodeapi + "/TransmissionProject/GetAllProjectDataOptions";
        this._NodeGetSuggestiveTransmissionProjectDataResults = this.Nodeapi + "/TransmissionProject/GetSuggestiveProjectDataResults";
        this._NodeGetTransmissionProjectsData = this.Nodeapi + "/TransmissionProject/GetProjectsData";
        /*******Power Plant API Link */
        this._NodeGetAllPowerPlantFilterOptions = this.Nodeapi + "/PowerPlants/GetAllPowerPlantFilterOptions";
        this._NodeGetSuggestivePowerplantResults = this.Nodeapi + "/PowerPlants/GetSuggestivePowerplantResults";
        this._NodeGetPowerPlantsData = this.Nodeapi + "/PowerPlants/GetAllPowerPlants";
        /*******Generating Units API Link */
        this._NodeGetAllGeneratingUnitOptions = this.Nodeapi + "/GeneratingUnits/GetAllGeneratingUnitOptions";
        this._NodeGetSuggestiveGeneratingUnitsResults = this.Nodeapi + "/GeneratingUnits/GetSuggestiveGeneratingUnitsResults";
        this._NodeGetGeneratingUnits = this.Nodeapi + "/GeneratingUnits/GetGeneratingUnits";
        //*************************** End Intelligence Section *********************************/
        /*******************************Node Login User *****************************************/
        this._NodeLoginURL = this.Nodeapi + "/User/LogInUser";
        this._NodeLogOutURL = this.Nodeapi + "/User/LogOut";
        this._NodeGetLayerTreeViewData = this.Nodeapi + "/Layer/GetLayerTreeViewData";
        this._NodeGetUserRoles = this.Nodeapi + "/User/GetUserRoles";
        /*******************************End Node Login User **************************************/
        /******************************Private Layer ********************************************/
        //public readonly _NodeGetPrivateLayerTreeViewData = `${this.Nodeapi}/AddData/GetPrivateLayerTreeViewData`;
        this._NodeGetPrivateLayerTreeViewData = this.Nodeapi + "/AddData/GetPrivateLayerTreeView_node";
        this._NodeGetPrivateGroupLayerTreeViewData = this.Nodeapi + "/AddData/GetPrivateGroupLayerTreeView_node";
        this._NodeGetMyDataLibrary = this.Nodeapi + "/AddData/MyDataLibrary";
        this._NodeRemoveLayerFromMyDataLibrary = this.Nodeapi + "/AddData/RemoveLayerFromMyDataLibrary";
        this._NodeUpdatemyDataLayer = this.Nodeapi + "/AddData/UpdateMyDataLayer";
        this._NodePostFileURL = this.Nodeapi + "/AddData/UploadFiles";
        this._NodeGetKmlData = this.Nodeapi + "/AddData/GetKmlData";
        /******************************End Private Layer ********************************************/
        this._NodeGetMapsearchLayesCategory = this.Nodeapi + "/Layer/MapSearchLayerCategory";
        this._NodeGetMapSearchEnergyLayerLibrary = this.Nodeapi + "/Layer/MapSearchEnergyLayerLibrary";
        //*************************** Geoserver URL*************************/
        this._NodeGeoserverLayerData = this.Nodeapi + "/GeoServer/GetGeoData";
        this._NodeGeoserverExportFeatureData = this.Nodeapi + "/GeoServer/GetExportFeatureData";
        this._NodeGeoserverDatabasedonPropertyname = this.Nodeapi + "/GeoServer/GetDatabasedonPropertyname";
        this._NodeGeoserverGetLayerFeaturetype = this.Nodeapi + "/GeoServer/GetLayerFeaturetype";
        this._NodeGeoserverGetInfoboxData = this.Nodeapi + "/GeoServer/GetInfoboxData";
        this._NodeGeoserverGetmap = this.Nodeapi + "/Geoserver/GetGeomap?";
        this._NodeGeoserverGetBasemap = this.Nodeapi + "/Geoserver/GetBasemap?";
        this._NodeGeoserverGetPrivateLayerData = this.Nodeapi + "/GeoServer/GetPrivateLayerData";
        //*************************** Geoserver New URL*************************/
        this._NodeGeoserverGetGeoMapPost = this.Nodeapi + "/GeoServerNew/GetGeoMapPost";
        this._NodeGeoserverSetImageLayerData = this.Nodeapi + "/GeoServerNew/SetImageLayerData";
        this._NodeGeoserverGetGeoMapNew = this.Nodeapi + "/GeoServerNew/GetGeoMapNew";
        this._NodeGeoserverGetGeoDataNew = this.Nodeapi + "/GeoServerNew/GetGeoDataNew";
        this._NodeGeoserverGetParcelsLayersDataCountForSiteSelection = this.Nodeapi + "/GeoServerNew/GetParcelsLayersDataCountForSiteSelection";
        this._NodeGeoserverGetHazardImage = this.Nodeapi + "/GeoServerNew/GetHazardImage";
        this._NodeDeleteGeoImageProp = this.Nodeapi + "/GeoServerNew/DeleteGeoImageProp";
        //***************************Layer style by User *************************/
        this._NodeSaveLayerStyles = this.Nodeapi + "/LayerStyle/SaveLayerStyles";
        this._NodeSaveCustomSymbols = this.Nodeapi + "/LayerStyle/SaveCustomSymbols";
        this._NodeGetExternalIconData = this.Nodeapi + "/LayerStyle/GetExternalIcon";
        this._NodeDeleteExternalSysmbols = this.Nodeapi + "/LayerStyle/DeleteExternalSysmbols";
        this._NodeSavePrivateLayerStyles = this.Nodeapi + "/LayerStyle/SavePrivateLayerStyles";
        //*************************** BaseMap Style *************************/
        this._NodegetBaseMap = this.Nodeapi + "/Layer/GetBaseMapData_New";
        this._NodeInsertBaseMapLogs = this.Nodeapi + "/Layer/InsertBaseMapLogs";
        //*************************** Create Layer tool *************************/
        this._NodeGetPipelineWizardData = this.Nodeapi + "/CreateLayer/GetPipelineWizardData";
        this._NodeGetRailWizardData = this.Nodeapi + "/CreateLayer/GetRailWizardData";
        this._NodeSaveCreateLayerData = this.Nodeapi + "/CreateLayer/SaveLayer";
        //*************************** Tools Apis *************************/
        this._NodeGetBookMarks = this.Nodeapi + "/Tool/GetAllBookMarksByUser";
        this._NodeSaveBookMark = this.Nodeapi + "/Tool/SaveBookMark";
        this._NodedeleteBookmark = this.Nodeapi + "/Tool/DeleteBookmark";
        this._NodegetUserMaps = this.Nodeapi + "/Tool/GetMapsByUserID";
        //*********Global Search API */
        this._NodeGetglobalSearchEnergylayer = this.Nodeapi + "/GlobalSearch/GetglobalSearchEnergylayer";
        this._NodeSaveTemporaryLayer = this.Nodeapi + "/GlobalSearch/SaveDatasetsValues";
        //*************************** Layer Feedback Apis *************************/
        this._NodeSendFeedbackData = this.Nodeapi + "/FeedBack/SendFeedback";
        //*********Site Selection API */
        this._NodeGetSiteSelectionProperties = this.Nodeapi + "/SiteSelection/GetPropertyTypes";
        this._NodeGetEnergyLayersIDS = this.Nodeapi + "/SiteSelection/GetEnergyLayersIDS";
        this._NodeInsertSiteSelectionLogs = this.Nodeapi + "/SiteSelection/InsertSiteSelectionLogs";
        //***** My Profile */
        this._NodeSaveMapSetting = this.Nodeapi + "/Layer/SaveMapsetting";
        this._NodeGetUserDetails = this.Nodeapi + "/Layer/GetUserDetails";
        this._NodeMyProfileChangePassword = this.Nodeapi + "/User/ChangePassowrd";
        //************************ MyMap ************************/
        this._NodeSaveMyMap = this.Nodeapi + "/MyMap/SaveMyMap";
        this._NodeCheckMapName = this.Nodeapi + "/MyMap/CheckMapName";
        this._NodeUpdateMyMap = this.Nodeapi + "/MyMap/UpdateMyMap";
        this._NodeGetMapData = this.Nodeapi + "/MyMap/GetMyMapById";
        this._NodeGetGUIDByDataSets = this.Nodeapi + "/MyMap/GetGUIDByDataSets";
        this._NodeMapGridFilter = this.Nodeapi + "/MyMap/SaveLayerGridFilters";
        this._NodeDeleteMyMap = this.Nodeapi + "/MyMap/DeleteMyMap";
        this._NodeGetListOfCompnayUserList = this.Nodeapi + "/MyMap/GetListOfCompnayUserList";
        this._NodeSaveSharedMymap = this.Nodeapi + "/MyMap/SaveSharedmymap";
        this._NodeInsertMyMapLogs = this.Nodeapi + "/MyMap/InsertMyMapLogs";
        //************************ InfoboxNotes ************************/
        this._NodeSaveInfoboxNotes = this.Nodeapi + "/Notes/SaveNotes";
        this._NodeUpdateInfoboxNotes = this.Nodeapi + "/Notes/UpdateNotes";
        this._NodeDeleteInfoboxNotes = this.Nodeapi + "/Notes/DeleteNotes";
        this._NodeGetInfoboxNotesforLayer = this.Nodeapi + "/Notes/GetNotesForEnergyLayer";
        //************************ ParcelDataBufferTool ************************/
        this._NodeGetStatesFromLatLng = this.Nodeapi + "/ParcelData/GetState";
        this._NodeGetStatesFromLineString = this.Nodeapi + "/ParcelData/GetStateFromLineString";
        //************************ SharedData ********************************/
        this._NodeGetSharedData = this.Nodeapi + "/SharedData/GetSharedData";
        //************************ DrawTools ********************************/
        this._NodeSaveDrawTools = this.Nodeapi + "/DrawTools/SaveEditableLayer";
        this._NodeUpdateDrawTools = this.Nodeapi + "/DrawTools/UpdateEditableLayer";
        this._NodeGetDrawTools = this.Nodeapi + "/DrawTools/GetDrawTool";
        this._NodeGetSharedDrawTools = this.Nodeapi + "/DrawTools/GetSharedLayers";
        this._NodeGetDrawToolsItems = this.Nodeapi + "/DrawTools/GetDrawToolItems";
        this._NodeDeleteDrawTool = this.Nodeapi + "/DrawTools/DeleteDrawToolLayer";
        this._NodeDeleteSharedDrawTool = this.Nodeapi + "/DrawTools/DeleteSharedDrawToolItem";
        this._NodeDeleteDrawToolItem = this.Nodeapi + "/DrawTools/DeleteDrawToolItem";
    }
    ApiService.prototype.SetJsonHeadersWithTokan = function () {
        var Tokan = this.GetAuthTokan();
        if (Tokan) {
            var httpOptions = {
                headers: new http_1.HttpHeaders({
                    'Content-Type': 'application/json',
                })
            };
            return httpOptions;
        }
        else {
            var httpOptions = {
                headers: new http_1.HttpHeaders({
                    'Content-Type': 'application/json',
                })
            };
            return httpOptions;
        }
    };
    ApiService.prototype.GetAuthTokan = function () {
        var Tokan = '';
        if (this.CookieService.check("HTMLENvisionToken")) {
            Tokan = this.CookieService.get('HTMLENvisionToken');
        }
        return Tokan;
    };
    ApiService.prototype.SetJsonHeaderswithorganization = function (organization) {
        var options = {
            headers: new http_1.HttpHeaders({
                'Content-Type': 'application/json'
            }),
            params: { 'organization': organization }
        };
        return options;
    };
    /**
    * @name extractData
    * @function extracts the data from the response
    * @returns response
    * @param response from the server
    */
    ApiService.prototype.extractData = function (res) {
        var body = res;
        return body || {};
    };
    /**
     * @name handleError
     * @function handles the error from the server
     * @returns error message
     * @param error from server
     */
    ApiService.prototype.handleError = function (error) {
        var errMsg = (error.msg) ? error.msg :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        return Observable_1.Observable.throw(error.error);
    };
    ApiService.prototype.SetJsonheadersOptions = function () {
        var httpOptions = {
            headers: new http_1.HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        return httpOptions;
    };
    ApiService.prototype.SetJsonheadersWithBody = function (body) {
        var options = {
            headers: new http_1.HttpHeaders({
                'Content-Type': 'application/json'
            }),
            body: body
        };
        return options;
    };
    ApiService.prototype.apiCaller = function (type, url, data) {
        var uri = url;
        if (type === 'get' || type === 'GET') {
            return this.get(uri);
        }
        else {
            return this.post(uri, data);
        }
    };
    ApiService.prototype.serverapiCaller = function (type, url, data) {
        var uri = url;
        if (type === 'get' || type === 'GET') {
            return this.serverget(uri);
        }
        else {
            return this.serverpost(uri, data);
        }
    };
    ApiService.prototype.serverpost = function (url, data) {
        return this.http.post(url, data);
    };
    ApiService.prototype.serverget = function (url) {
        return this.http.get(url);
    };
    ApiService.prototype.post = function (url, data) {
        return this.HttpClient.post(url, data, this.SetJsonheadersOptions());
    };
    ApiService.prototype.postTest = function (url, data) {
        var httpOptions = {
            headers: new http_1.HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        return this.HttpClient.post(url, data, httpOptions);
    };
    ApiService.prototype.postImage = function (url, data) {
        return this.HttpClient.post(url, data, { responseType: 'blob' });
    };
    ApiService.prototype.get = function (url) {
        return this.HttpClient.get(url, this.SetJsonheadersOptions());
    };
    ApiService.prototype.postUserLogin = function (url, data) {
        var options = {
            headers: new http_1.HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.HttpClient.post(url, data, options);
    };
    ApiService.prototype.SetHeadersWithCrosOrigin = function () {
        var headers = new http_1.HttpHeaders();
        headers.append('Access-Control-Allow-Origin', '*');
        return headers;
    };
    ApiService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_3.Http,
            http_2.HttpClient,
            ngx_cookie_service_1.CookieService])
    ], ApiService);
    return ApiService;
}());
exports.ApiService = ApiService;
//# sourceMappingURL=api.service.js.map