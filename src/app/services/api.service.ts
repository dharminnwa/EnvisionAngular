import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Http, Response, Request, RequestMethod, RequestOptions, Headers, HttpModule } from '@angular/http';
import { CookieService } from 'ngx-cookie-service';
@Injectable()
export class ApiService {
    private api = environment.apiURL;
    private Nodeapi = environment.NodeapiURL;
    // private AmazonURL = environment.AmazonAPiURL;
    // public readonly LayerAPI = environment.newAPILayerURL;
    // public readonly LayerAPI = 'http://ec2-35-169-178-29.compute-1.amazonaws.com:8080/envision/wfs';

    public readonly LoginURL = `${this.api}/User/LogInUser`;
    public readonly LogOutURL = `${this.api}/User/LogOut`;
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
    public readonly _NodeGetAssetLookupData = `${this.Nodeapi}/HomeDashboard/GetFacilityData`;
    public readonly _NodeGetParcelStates = `${this.Nodeapi}/HomeDashboard/GetParcelStates`;
    public readonly _NodeGetComodityStatename = `${this.Nodeapi}/HomeDashboard/GetStateBasedonComodity`;
    public readonly _NodeGetCommodityBasedonStateandType = `${this.Nodeapi}/HomeDashboard/GetCommodityBasedonStateandType`;
    public readonly _NodeGetFactypeBasedonStateandCommodity = `${this.Nodeapi}/HomeDashboard/GetFactypeBasedonStateandCommodity`;
    public readonly _NodeGetTypeandCommoditybasedonstate = `${this.Nodeapi}/HomeDashboard/GetTypeandCommoditybasedonstate`;
    // start Home Deshboard PipeLine
    public readonly _NodeGetPiplelineandothertabData = `${this.Nodeapi}/HomeDashboard/GetAllPipelineData`;
    public readonly _NodeGetPiplelineDatabasedonfilter = `${this.Nodeapi}/HomeDashboard/GetPiplelineDatabasedonFiltervalue`;
    public readonly _NodeGetPowerPlantDatabasedonfilter = `${this.Nodeapi}/HomeDashboard/GetPowerPlantDatabasedonFilter`;
    public readonly _NodeGetSubstationDatabasedonfilter = `${this.Nodeapi}/HomeDashboard/GetSubstationDatabasedonfilter`;
    public readonly _NodeGetTransmissionDatabasedonfilter = `${this.Nodeapi}/HomeDashboard/GetTransmissionDatabasedonFilter`;

    // end Home Deshboard Pipeline



    public readonly _NodeGetWellStates = `${this.Nodeapi}/HomeDashboard/GetWellsstate`;
    public readonly _NodeGetTransProjects = `${this.Nodeapi}/HomeDashboard/GetTransProjects`;
    public readonly _NodeGetPipelineActivities = `${this.Nodeapi}/HomeDashboard/GetPipelineActivities`;
    /*****Company Profile API Link */
    public readonly _NodeGetCompanyfilterOptionsURL = `${this.Nodeapi}/CompanyProfile/GetAllCompanyOptions`;
    public readonly _NodeGetCompanyNameSuggestiveURL = `${this.Nodeapi}/CompanyProfile/GetSuggestiveCompanyNameResults`;
    public readonly _NodeGetAllCompnayListURL = `${this.Nodeapi}/CompanyProfile/GetAllCompnayList`;
    public readonly _NodeGetCompanySearchResult = `${this.Nodeapi}/CompanyProfile/CompanyDataSearchDataResult`;
    public readonly _NodeGetAllJsonCompnayListURL = `${this.Nodeapi}/CompanyProfile/GetJsonfiledata`;
    public readonly _NodeGetFilterCompnayListURL = `${this.Nodeapi}/CompanyProfile/GetFilterCompnayList`;

    /******Pipeline Activity API Link */
    public readonly _NodeGetPipelineActivityGridDataURL = `${this.Nodeapi}/PipelineActivity/ListofIndustryUpdates`;
    public readonly _NodeGetPipelineActivityAllFilterOption = `${this.Nodeapi}/PipelineActivity/IndustryUpdatesFilterOption`;
    public readonly _NodeGetSuggestivePipelineActivityResults = `${this.Nodeapi}/PipelineActivity/GetSuggestivePipelineActivityResults`;

    /******Transmission API Link */
    public readonly _NodeGetAllTransmissionProjectFilterOptions = `${this.Nodeapi}/TransmissionProject/GetAllProjectDataOptions`;
    public readonly _NodeGetSuggestiveTransmissionProjectDataResults = `${this.Nodeapi}/TransmissionProject/GetSuggestiveProjectDataResults`;
    public readonly _NodeGetTransmissionProjectsData = `${this.Nodeapi}/TransmissionProject/GetProjectsData`;

    /*******Power Plant API Link */
    public readonly _NodeGetAllPowerPlantFilterOptions = `${this.Nodeapi}/PowerPlants/GetAllPowerPlantFilterOptions`;
    public readonly _NodeGetSuggestivePowerplantResults = `${this.Nodeapi}/PowerPlants/GetSuggestivePowerplantResults`;
    public readonly _NodeGetPowerPlantsData = `${this.Nodeapi}/PowerPlants/GetAllPowerPlants`;

    /*******Generating Units API Link */
    public readonly _NodeGetAllGeneratingUnitOptions = `${this.Nodeapi}/GeneratingUnits/GetAllGeneratingUnitOptions`;
    public readonly _NodeGetSuggestiveGeneratingUnitsResults = `${this.Nodeapi}/GeneratingUnits/GetSuggestiveGeneratingUnitsResults`;
    public readonly _NodeGetGeneratingUnits = `${this.Nodeapi}/GeneratingUnits/GetGeneratingUnits`;
    //*************************** End Intelligence Section *********************************/


    /*******************************Node Login User *****************************************/
    public readonly _NodeLoginURL = `${this.Nodeapi}/User/LogInUser`;
    public readonly _NodeLogOutURL = `${this.Nodeapi}/User/LogOut`;
    public readonly _NodeGetLayerTreeViewData = `${this.Nodeapi}/Layer/GetLayerTreeViewData`;
    public readonly _NodeGetUserRoles = `${this.Nodeapi}/User/GetUserRoles`;
    /*******************************End Node Login User **************************************/

    /******************************Private Layer ********************************************/
    //public readonly _NodeGetPrivateLayerTreeViewData = `${this.Nodeapi}/AddData/GetPrivateLayerTreeViewData`;
    public readonly _NodeGetPrivateLayerTreeViewData = `${this.Nodeapi}/AddData/GetPrivateLayerTreeView_node`;
    public readonly _NodeGetPrivateGroupLayerTreeViewData = `${this.Nodeapi}/AddData/GetPrivateGroupLayerTreeView_node`;
    public readonly _NodeGetMyDataLibrary = `${this.Nodeapi}/AddData/MyDataLibrary`;
    public readonly _NodeRemoveLayerFromMyDataLibrary = `${this.Nodeapi}/AddData/RemoveLayerFromMyDataLibrary`;
    public readonly _NodeUpdatemyDataLayer = `${this.Nodeapi}/AddData/UpdateMyDataLayer`;
    public readonly _NodePostFileURL = `${this.Nodeapi}/AddData/UploadFiles`;
    public readonly _NodeGetKmlData = `${this.Nodeapi}/AddData/GetKmlData`;


    /******************************End Private Layer ********************************************/

    public readonly _NodeGetMapsearchLayesCategory = `${this.Nodeapi}/Layer/MapSearchLayerCategory`;
    public readonly _NodeGetMapSearchEnergyLayerLibrary = `${this.Nodeapi}/Layer/MapSearchEnergyLayerLibrary`;

    //*************************** Geoserver URL*************************/
    public readonly _NodeGeoserverLayerData = `${this.Nodeapi}/GeoServer/GetGeoData`;
    public readonly _NodeGeoserverExportFeatureData = `${this.Nodeapi}/GeoServer/GetExportFeatureData`;
    public readonly _NodeGeoserverDatabasedonPropertyname = `${this.Nodeapi}/GeoServer/GetDatabasedonPropertyname`;
    public readonly _NodeGeoserverGetLayerFeaturetype = `${this.Nodeapi}/GeoServer/GetLayerFeaturetype`;
    public readonly _NodeGeoserverGetInfoboxData = `${this.Nodeapi}/GeoServer/GetInfoboxData`;
    public readonly _NodeGeoserverGetmap = `${this.Nodeapi}/Geoserver/GetGeomap?`;
    public readonly _NodeGeoserverGetBasemap = `${this.Nodeapi}/Geoserver/GetBasemap?`;
    public readonly _NodeGeoserverGetPrivateLayerData = `${this.Nodeapi}/GeoServer/GetPrivateLayerData`;

    //*************************** Geoserver New URL*************************/
    public readonly _NodeGeoserverGetGeoMapPost = `${this.Nodeapi}/GeoServerNew/GetGeoMapPost`;
    public readonly _NodeGeoserverSetImageLayerData = `${this.Nodeapi}/GeoServerNew/SetImageLayerData`;
    public readonly _NodeGeoserverGetGeoMapNew = `${this.Nodeapi}/GeoServerNew/GetGeoMapNew`;
    public readonly _NodeGeoserverGetGeoDataNew = `${this.Nodeapi}/GeoServerNew/GetGeoDataNew`;
    public readonly _NodeGeoserverGetParcelsLayersDataCountForSiteSelection = `${this.Nodeapi}/GeoServerNew/GetParcelsLayersDataCountForSiteSelection`;
    public readonly _NodeGeoserverGetHazardImage = `${this.Nodeapi}/GeoServerNew/GetHazardImage`;
    public readonly _NodeGeoserverGetTotalCountListOfLayers = `${this.Nodeapi}/GeoServerNew/GetTotalCountListOfLayers`;



    public readonly _NodeDeleteGeoImageProp = `${this.Nodeapi}/GeoServerNew/DeleteGeoImageProp`;
    //***************************Layer style by User *************************/
    public readonly _NodeSaveLayerStyles = `${this.Nodeapi}/LayerStyle/SaveLayerStyles`;
    public readonly _NodeSaveCustomSymbols = `${this.Nodeapi}/LayerStyle/SaveCustomSymbols`;
    public readonly _NodeGetExternalIconData = `${this.Nodeapi}/LayerStyle/GetExternalIcon`;
    public readonly _NodeDeleteExternalSysmbols = `${this.Nodeapi}/LayerStyle/DeleteExternalSysmbols`;
    public readonly _NodeSavePrivateLayerStyles = `${this.Nodeapi}/LayerStyle/SavePrivateLayerStyles`;
    //*************************** BaseMap Style *************************/
    public readonly _NodegetBaseMap = `${this.Nodeapi}/Layer/GetBaseMapData_New`;
    public readonly _NodeInsertBaseMapLogs = `${this.Nodeapi}/Layer/InsertBaseMapLogs`;

    //*************************** Create Layer tool *************************/
    public readonly _NodeGetPipelineWizardData = `${this.Nodeapi}/CreateLayer/GetPipelineWizardData`;
    public readonly _NodeGetRailWizardData = `${this.Nodeapi}/CreateLayer/GetRailWizardData`;
    public readonly _NodeSaveCreateLayerData = `${this.Nodeapi}/CreateLayer/SaveLayer`;

    //*************************** Tools Apis *************************/
    public readonly _NodeGetBookMarks = `${this.Nodeapi}/Tool/GetAllBookMarksByUser`;
    public readonly _NodeSaveBookMark = `${this.Nodeapi}/Tool/SaveBookMark`;
    public readonly _NodedeleteBookmark = `${this.Nodeapi}/Tool/DeleteBookmark`;
    public readonly _NodegetUserMaps = `${this.Nodeapi}/Tool/GetMapsByUserID`;

    //*********Global Search API */
    public readonly _NodeGetglobalSearchEnergylayer = `${this.Nodeapi}/GlobalSearch/GetglobalSearchEnergylayer`;
    public readonly _NodeSaveTemporaryLayer = `${this.Nodeapi}/GlobalSearch/SaveDatasetsValues`;

    //*************************** Layer Feedback Apis *************************/
    public readonly _NodeSendFeedbackData = `${this.Nodeapi}/FeedBack/SendFeedback`;


    //*********Site Selection API */
    public readonly _NodeGetSiteSelectionProperties = `${this.Nodeapi}/SiteSelection/GetPropertyTypes`;
    public readonly _NodeGetEnergyLayersIDS = `${this.Nodeapi}/SiteSelection/GetEnergyLayersIDS`;
    public readonly _NodeInsertSiteSelectionLogs = `${this.Nodeapi}/SiteSelection/InsertSiteSelectionLogs`;

    //***** My Profile */
    public readonly _NodeSaveMapSetting = `${this.Nodeapi}/Layer/SaveMapsetting`;
    public readonly _NodeGetUserDetails = `${this.Nodeapi}/Layer/GetUserDetails`;
    public readonly _NodeMyProfileChangePassword = `${this.Nodeapi}/User/ChangePassowrd`;

    //************************ MyMap ************************/
    public readonly _NodeSaveMyMap = `${this.Nodeapi}/MyMap/SaveMyMap`;
    public readonly _NodeCheckMapName = `${this.Nodeapi}/MyMap/CheckMapName`;
    public readonly _NodeUpdateMyMap = `${this.Nodeapi}/MyMap/UpdateMyMap`;
    public readonly _NodeGetMapData = `${this.Nodeapi}/MyMap/GetMyMapById`;
    public readonly _NodeGetGUIDByDataSets = `${this.Nodeapi}/MyMap/GetGUIDByDataSets`;
    public readonly _NodeMapGridFilter = `${this.Nodeapi}/MyMap/SaveLayerGridFilters`;
    public readonly _NodeDeleteMyMap = `${this.Nodeapi}/MyMap/DeleteMyMap`;
    public readonly _NodeGetListOfCompnayUserList = `${this.Nodeapi}/MyMap/GetListOfCompnayUserList`;
    public readonly _NodeSaveSharedMymap = `${this.Nodeapi}/MyMap/SaveSharedmymap`;
    public readonly _NodeInsertMyMapLogs = `${this.Nodeapi}/MyMap/InsertMyMapLogs`;
    public readonly _NodeInsertMyMapChangedLogs = `${this.Nodeapi}/MyMap/InsertMyMapChangedLogs`;
    //************************ InfoboxNotes ************************/
    public readonly _NodeSaveInfoboxNotes = `${this.Nodeapi}/Notes/SaveNotes`;
    public readonly _NodeUpdateInfoboxNotes = `${this.Nodeapi}/Notes/UpdateNotes`;
    public readonly _NodeDeleteInfoboxNotes = `${this.Nodeapi}/Notes/DeleteNotes`;
    public readonly _NodeGetInfoboxNotesforLayer = `${this.Nodeapi}/Notes/GetNotesForEnergyLayer`;

    //************************ ParcelDataBufferTool ************************/
    public readonly _NodeGetStatesFromLatLng = `${this.Nodeapi}/ParcelData/GetState`;
    public readonly _NodeGetStatesFromLineString = `${this.Nodeapi}/ParcelData/GetStateFromLineString`;


    //************************ SharedData ********************************/
    public readonly _NodeGetSharedData = `${this.Nodeapi}/SharedData/GetSharedData`;

    //************************ DrawTools ********************************/
    public readonly _NodeSaveDrawTools = `${this.Nodeapi}/DrawTools/SaveEditableLayer`;
    public readonly _NodeUpdateDrawTools = `${this.Nodeapi}/DrawTools/UpdateEditableLayer`;
    public readonly _NodeGetDrawTools = `${this.Nodeapi}/DrawTools/GetDrawTool`;
    public readonly _NodeGetSharedDrawTools = `${this.Nodeapi}/DrawTools/GetSharedLayers`;
    public readonly _NodeGetDrawToolsItems = `${this.Nodeapi}/DrawTools/GetDrawToolItems`;
    public readonly _NodeDeleteDrawTool = `${this.Nodeapi}/DrawTools/DeleteDrawToolLayer`;
    public readonly _NodeDeleteSharedDrawTool = `${this.Nodeapi}/DrawTools/DeleteSharedDrawToolItem`;
    public readonly _NodeDeleteDrawToolItem = `${this.Nodeapi}/DrawTools/DeleteDrawToolItem`;

    ////***************************End Node Js API Link ************************************/


    constructor(private http: Http,
        private HttpClient: HttpClient,
        private CookieService: CookieService
    ) { }


    private SetJsonHeadersWithTokan() {
        let Tokan = this.GetAuthTokan();
        if (Tokan) {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                })
            };
            return httpOptions;
        }
        else {
            const httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                })
            };
            return httpOptions;
        }


    }
    public GetAuthTokan() {
        let Tokan = '';
        if (this.CookieService.check("HTMLENvisionToken")) {
            Tokan = this.CookieService.get('HTMLENvisionToken')
        }
        return Tokan;
    }
    private SetJsonHeaderswithorganization(organization: any) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            params: { 'organization': organization }
        };
        return options;
    }
    /**
    * @name extractData
    * @function extracts the data from the response
    * @returns response
    * @param response from the server 
    */

    public extractData(res: Response) {
        const body = res;
        return body || {};
    }

    /**
     * @name handleError
     * @function handles the error from the server
     * @returns error message
     * @param error from server 
     */

    private handleError(error: any) {
        const errMsg = (error.msg) ? error.msg :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        return Observable.throw(error.error);
    }
    private SetJsonheadersOptions() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        return httpOptions;

    }

    private SetJsonheadersWithBody(body: any) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            body: body
        };
        return options;
    }
    public apiCaller(type: string, url: string, data?: any): any {
        let uri = url;
        if (type === 'get' || type === 'GET') {
            return this.get(uri);
        } else {
            return this.post(uri, data);
        }
    }
    public serverapiCaller(type: string, url: string, data?: any): any {
        let uri = url;
        if (type === 'get' || type === 'GET') {
            return this.serverget(uri);
        } else {
            return this.serverpost(uri, data);
        }
    }
    private serverpost(url: string, data: any): any {
        return this.http.post(url, data);
    }
    private serverget(url: string): any {
        return this.http.get(url);
    }
    private post(url: string, data: any): any {
        return this.HttpClient.post(url, data, this.SetJsonheadersOptions());
    }
    public postTest(url: string, data: any): any {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
            })
        };
        return this.HttpClient.post(url, data, httpOptions);
    }
    public postImage(url: string, data: any): any {
        return this.HttpClient.post(url, data, { responseType: 'blob' });
    }
    private get(url: string): any {
        return this.HttpClient.get(url);
    }
    public postUserLogin(url: string, data: any): any {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };
        return this.HttpClient.post(url, data, options);
    }
    private SetHeadersWithCrosOrigin(): HttpHeaders {
        const headers = new HttpHeaders();
        headers.append('Access-Control-Allow-Origin', '*');
        return headers;
    }

}