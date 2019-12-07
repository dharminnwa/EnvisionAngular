import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { ApiService } from "./api.service";
import { Observable, BehaviorSubject } from "rxjs";
import { environment } from "../../environments/environment";
import { GeoData } from "../models/geodata";

@Injectable()
export class HttpRequestService {
    public geoRequestSavedData = new BehaviorSubject<GeoData[]>([]);
    constructor(private http: Http,
        private _api: ApiService
    ) { }

    setGeoRequestSavedData(data: GeoData[]) {
        this.geoRequestSavedData.next(data);
    }



    // ----------------------------------------------------------------------------//
    // ************************** START of .NET apis ******************************//
    // ----------------------------------------------------------------------------//

    // Auth Apis
    public Login(UserName: string, Password: string, KeepmeLogin: any, LogInType: string, AutoLogOutTimeInMinutes: any) {
        const endpoint = this._api.LoginURL;
        const LoginUrl = endpoint + "/?UserName=" + encodeURIComponent(UserName) + "&Password=" + encodeURIComponent(Password) + "&IsPersistent=" + KeepmeLogin + "&LogInType=" + LogInType + "&AutoLogOutTimeInMinutes=" + AutoLogOutTimeInMinutes;
        return this.http.get(LoginUrl);
    }

    public Logout(LoginHandlerId: any) {
        const endpoint = this._api.LogOutURL;
        const LogoutUrl = endpoint + "?LoginHandlerId=" + LoginHandlerId;
        return this.http.get(LogoutUrl);
    }

    // Condensed Apis
    _NodeGetPrivateTreeLayer(TreeId: any, UserId: string, LoggedInUserId: string, CustomMapId: number) {
        const endpoint = this._api._NodeGetPrivateLayerTreeViewData;
        const treeUrl = endpoint + '/?LayerId=' + TreeId + "&UserId=" + UserId + "&LoggedInUserId=" + LoggedInUserId + '&CustomMapId=' + CustomMapId;
        return this._api.apiCaller('GET', treeUrl);
    }

    _NodeGetPrivateGroupTreeLayer(TreeId: any, ChildIds: any, UserId: string, LoggedInUserId: string, CustomMapId: number) {
        const endpoint = this._api._NodeGetPrivateGroupLayerTreeViewData;
        const treeUrl = endpoint + '/?LayerId=' + TreeId + "&ChildIds=" + ChildIds.toString() + "&UserId=" + UserId + "&LoggedInUserId=" + LoggedInUserId + '&CustomMapId=' + CustomMapId;
        return this._api.apiCaller('GET', treeUrl);
    }


    _NodeRemoveDataFromDataSet(Id: any) {
        const endpoint = this._api._NodeRemoveLayerFromMyDataLibrary;
        const treeUrl = endpoint + '/?LayerId=' + Id;
        return this._api.apiCaller('GET', treeUrl);
    }

    // Create Layer Apis
    _NodeGetPipelineWizardData(UserId: string) {
        const endpoint = this._api._NodeGetPipelineWizardData + "?UserId=" + UserId;
        return this._api.apiCaller("get", endpoint);
    }

    _NodeGetRailWizardData(UserId: string) {
        const endpoint = this._api._NodeGetRailWizardData + "?UserId=" + UserId;;
        return this._api.apiCaller("get", endpoint);
    }

    _NodeSaveCreatedLayer(DatasetObje) {
        const endpoint = this._api._NodeSaveCreateLayerData;
        return this._api.serverapiCaller("Post", endpoint, DatasetObje);
    }

    // Dashboard Apis
    // start Dashboard Facilities 
    _NodeGetAssetLookupData() {
        const endpoint = this._api._NodeGetAssetLookupData;
        return this._api.apiCaller("GET", endpoint);
    }
    _NodeGetComodityStateData(Comodity, Factype) {
        const endpoint = this._api._NodeGetComodityStatename + "?Comodity=" + encodeURIComponent(Comodity) + "&Factype=" + encodeURIComponent(Factype);
        return this._api.apiCaller("GET", endpoint);
    }
    _NodeGetTypeandComoditybasedonStateData(StateName) {
        const endpoint = this._api._NodeGetTypeandCommoditybasedonstate + "?StateName=" + encodeURIComponent(StateName);
        return this._api.apiCaller("GET", endpoint);
    }
    _NodeGetCommoditybasedonStateandTypeData(StateName, Factype) {
        const endpoint = this._api._NodeGetCommodityBasedonStateandType + "?StateName=" + encodeURIComponent(StateName) + "&Factype=" + encodeURIComponent(Factype);
        return this._api.apiCaller("GET", endpoint);
    }
    _NodeGetGetFactypeBasedonStateandCommodity(StateName, Comodity) {
        const endpoint = this._api._NodeGetFactypeBasedonStateandCommodity + "?StateName=" + encodeURIComponent(StateName) + "&Comodity=" + encodeURIComponent(Comodity);
        return this._api.apiCaller("GET", endpoint);
    }
    //End Dashboard Facilities 
    // Start  Dashboard Pipleline 
    _NodeGetPiplelineandothertabData() {
        const endpoint = this._api._NodeGetPiplelineandothertabData;
        return this._api.apiCaller("GET", endpoint);
    }
    _NodeGetPiplelineDatabasedonFiltervalue(Commodity, State, Status) {
        const endpoint = this._api._NodeGetPiplelineDatabasedonfilter + "?Commodity=" + encodeURIComponent(Commodity) + "&State=" + encodeURIComponent(State) + "&Status=" + encodeURIComponent(Status);
        return this._api.apiCaller("GET", endpoint);
    }
    // End Dashboard Pipleline
    // Start Power Plant
    _NodeGetPowerPlantDatabasedonFiltervalue(Fueltype, PrimeMover, State) {
        const endpoint = this._api._NodeGetPowerPlantDatabasedonfilter + "?Fueltype=" + encodeURIComponent(Fueltype) + "&PrimeMover=" + encodeURIComponent(PrimeMover) + "&State=" + encodeURIComponent(State);
        return this._api.apiCaller("GET", endpoint);
    }
    // End Power Plant
    // Start Substation
    _NodeGetSubstationDatabasedonFiltervalue(status, sybtype, State) {
        const endpoint = this._api._NodeGetSubstationDatabasedonfilter + "?status=" + encodeURIComponent(status) + "&sybtype=" + encodeURIComponent(sybtype) + "&State=" + encodeURIComponent(State);
        return this._api.apiCaller("GET", endpoint);
    }
    //end substation
    // Start Transmission Line
    _NodeGetTransmissionDatabasedonFiltervalue(status, Voltage, State) {
        const endpoint = this._api._NodeGetTransmissionDatabasedonfilter + "?status=" + encodeURIComponent(status) + "&Voltage=" + encodeURIComponent(Voltage) + "&State=" + encodeURIComponent(State);
        return this._api.apiCaller("GET", endpoint);
    }
    //End Transmission Line
    _NodeGetParcelStates(UserId) {
        const endpoint = this._api._NodeGetParcelStates + "?UserId=" + UserId;
        return this._api.apiCaller("GET", endpoint);
    }

    _NodeGetWellStates() {
        const endpoint = this._api._NodeGetWellStates;
        return this._api.apiCaller("GET", endpoint);
    }

    _NodeGetTransProjects() {
        const endpoint = this._api._NodeGetTransProjects;
        return this._api.apiCaller("GET", endpoint);
    }

    _NodeGetPipelineActivities() {
        const endpoint = this._api._NodeGetPipelineActivities;
        return this._api.apiCaller("GET", endpoint);
    }

    // File Upload Apis
    PostFile(filesToUpload: any[], userData: any, fileType: string): Observable<any> {
        let url = this._api._NodePostFileURL;
        const formData: FormData = new FormData();
        for (var i = 0; i < filesToUpload.length; i++) {
            formData.append(fileType + '-' + filesToUpload[i].name, filesToUpload[i], filesToUpload[i].name);
        }
        formData.append('UserData', JSON.stringify(userData))
        return this.http.post(url, formData);
    }

    // Global Search Apis    
    _NodeGetglobalSearchEnergylayer(UserId: string, LayerGroup: string, SearchText: string, take: number, skip: number) {
        const endpoint = this._api._NodeGetglobalSearchEnergylayer;
        let URLParameter = '?UserId=' + UserId + '&LayerGroup=' + LayerGroup + '&SearchText=' + encodeURIComponent(SearchText) + '&take=' + take + '&skip=' + skip;
        const GETLayerLibraryURL = endpoint + URLParameter;
        return this._api.serverapiCaller("GET", GETLayerLibraryURL);
    }
    _NodesaveTemporaryLayer(DatasetObje) {
        const endpoint = this._api._NodeSaveTemporaryLayer;
        return this._api.serverapiCaller("Post", endpoint, DatasetObje);
    }
    _NodesaveMapGridFilter(MapGridfilterData) {
        const endpoint = this._api._NodeMapGridFilter;
        return this._api.serverapiCaller("Post", endpoint, MapGridfilterData);
    }
    //*************************** Intelligence Apis ********************************//
    // Company Profile     
    _NodeGetAllCompanyOptions() {
        const endpoint = this._api._NodeGetCompanyfilterOptionsURL;
        //return this._api.apiCaller("GET", endpoint);
        return this._api.serverapiCaller("GET", endpoint);
    }
    _NodeGetSuggestiveCompanyData() {
        const endpoint = this._api._NodeGetCompanyNameSuggestiveURL;
        //return this._api.apiCaller("GET", endpoint);
        return this._api.serverapiCaller("GET", endpoint);
    }

    _NodeGetFilterdCompanyList(searchString) {
        let endpoint = this._api._NodeGetFilterCompnayListURL;
        if (searchString) {
            endpoint = endpoint + "?filter=" + encodeURIComponent(searchString);
        }
        return this._api.apiCaller("GET", endpoint);
    }

    _NodeGetAllJsonCompnayList() {
        let endpoint = this._api._NodeGetAllJsonCompnayListURL;
        return this._api.serverapiCaller("GET", endpoint);
    }
    _NodeGetAllCompnayList(take, skip) {
        let endpoint = this._api._NodeGetAllCompnayListURL + "?take=" + take + "&skip=" + skip;
        return this._api.serverapiCaller("GET", endpoint)
    }
    _NodeGetCompanySearchResult(State, Commodity, Enitity, EntityType, BusinessLine) {
        var Data = {
            State: State,
            Commodity: Commodity,
            Enitity: Enitity,
            EntityType: EntityType,
            BusinessLine: BusinessLine
        }
        let endpoint = this._api._NodeGetCompanySearchResult;
        return this._api.apiCaller("Post", endpoint, Data);
    }

    // Pipeline Activity    
    _NodeGetPiplelinefilterOptions() {
        const endpoint = this._api._NodeGetPipelineActivityAllFilterOption;
        //return this._api.apiCaller("GET", endpoint);
        return this._api.serverapiCaller("GET", endpoint);
    }
    _NodeGetSuggestivePipelineActivityResults() {
        const endpoint = this._api._NodeGetSuggestivePipelineActivityResults;
        //return this._api.apiCaller("GET", endpoint);
        return this._api.serverapiCaller("GET", endpoint);
    }
    _NodeGetPipelineActivityGridDataURL() {
        let endpoint = this._api._NodeGetPipelineActivityGridDataURL;
        //return this._api.serverapiCaller("GET", endpoint);
        return this._api.serverapiCaller("GET", endpoint);
    }

    // Transmission Project 
    _NodeGetAllTransmissionProjectFilterOptions() {
        const endpoint = this._api._NodeGetAllTransmissionProjectFilterOptions;
        return this._api.serverapiCaller("GET", endpoint);
    }

    GetSuggestiveTransmissionProjectDataResults() {
        const endpoint = this._api._NodeGetSuggestiveTransmissionProjectDataResults;
        return this._api.serverapiCaller("GET", endpoint);
    }

    GetTransmissionProjectsData() {
        const endpoint = this._api._NodeGetTransmissionProjectsData;
        return this._api.serverapiCaller("GET", endpoint);
    }

    // Power Plant    
    _NodeGetAllPowerPlantFilterOptions() {
        const endpoint = this._api._NodeGetAllPowerPlantFilterOptions;
        return this._api.serverapiCaller("GET", endpoint);
    }

    _NodeGetSuggestivePowerplantResults() {
        const endpoint = this._api._NodeGetSuggestivePowerplantResults;
        return this._api.serverapiCaller("GET", endpoint);
    }

    _NodeGetPowerPlantsData() {
        const endpoint = this._api._NodeGetPowerPlantsData;
        return this._api.serverapiCaller("GET", endpoint);

    }

    // Generating Units
    _NodeGetAllGeneratingUnitOptions() {
        const endpoint = this._api._NodeGetAllGeneratingUnitOptions;
        return this._api.serverapiCaller("GET", endpoint);
    }

    _NodeGetAllGeneratingUnitList(take, skip) {
        let endpoint = this._api._NodeGetGeneratingUnits + "?take=" + take + "&skip=" + skip;
        return this._api.serverapiCaller("GET", endpoint);
    }

    _NodeGetSuggestiveGeneratingUnitsResults() {
        const endpoint = this._api._NodeGetSuggestiveGeneratingUnitsResults;
        return this._api.serverapiCaller("GET", endpoint);
    }

    // ************************* Map Layer Info Apis **************************** //
    GetKmlData(dataSetId: number, fileType: string) {
        const endpoint = this._api._NodeGetKmlData;
        let URLParameter = '?dataSetId=' + dataSetId + '&fileType=' + fileType
        const GETLayerLibraryURL = endpoint + URLParameter;
        return this._api.serverapiCaller("GET", GETLayerLibraryURL);
    }

    // Layer style by User  
    _NodeSaveLayerstylebyUser(JsonListofstyle: string, externaliconURL: string) {
        var Data = {
            JsonListofstyle: JSON.parse(JsonListofstyle),
            externaliconURL: externaliconURL
        }
        const endpoint = this._api._NodeSaveLayerStyles;
        return this._api.apiCaller("Post", endpoint, Data);
    }
    _NodeSavePrivateLayerstylebyUser(JsonListofstyle: string, externaliconURL: string) {
        let Data = {
            JsonListofstyle: JSON.parse(JsonListofstyle),
            externaliconURL: externaliconURL
        }
        const endpoint = this._api._NodeSavePrivateLayerStyles;
        return this._api.apiCaller("Post", endpoint, Data);
    }
    _NodeUpdateMyDataLayer(data) {
        const endpoint = this._api._NodeUpdatemyDataLayer;
        return this._api.apiCaller('POST', endpoint, data);
    }

    // **************************** Tools Apis ************************************//
    _NodeGetAllBookMark(UserID: any) {
        const endpoint = this._api._NodeGetBookMarks + '/?UserID=' + UserID;
        return this._api.apiCaller('GET', endpoint);
    }

    _NodeSaveBookMark(UID: any, Name: any, Lat: any, Lng: any, Zoom: any) {
        const endpoint = this._api._NodeSaveBookMark;
        let data = {
            UserID: UID,
            Name: Name,
            Latitude: Lat,
            Longitude: Lng,
            ZoomLevel: Zoom,
            BaseMapProviderID: 11
        }
        return this._api.apiCaller('POST', endpoint, data);
    }

    _NodeDeleteBookmark(bookmarkID: any) {
        const endpoint = this._api._NodedeleteBookmark + '/?bookmarkID=' + bookmarkID;
        return this._api.apiCaller("GET", endpoint);
    }

    _NodeGetUserMaps(UserID: any) {
        const endpoint = this._api._NodegetUserMaps + '/?UserID=' + UserID;
        return this._api.apiCaller("GET", endpoint);
    }
    // ----------------------------------------------------------------------------//
    // ************************** END of .NET apis ******************************//
    // ----------------------------------------------------------------------------//

    // ----------------------------------------------------------------------------//
    // ************************** START of Node apis ******************************//
    // ----------------------------------------------------------------------------//

    // Auth Apis
    public _NodeLogin(UserName: string, Password: string, KeepmeLogin: any, LogInType: string, AutoLogOutTimeInMinutes: any) {
        const endpoint = this._api._NodeLoginURL;
        var Data = {
            UserName: UserName,
            Password: Password,
            KeepmeLogin: KeepmeLogin,
            LogInType: LogInType,
            AutoLogOutTimeInMinutes: AutoLogOutTimeInMinutes
        }
        return this._api.postUserLogin(endpoint, Data);
    }

    public _NodeLogout(LoginHandlerId: any, UserID: any) {
        const endpoint = this._api._NodeLogOutURL;
        var Data = {
            LoginHandlerId: LoginHandlerId,
            UserID: UserID
        }
        return this._api.apiCaller("Post", endpoint, Data);
    }

    // User Roles
    public _NodeGetUserRoles(UserID: any) {
        const endpoint = this._api._NodeGetUserRoles + "?UserID=" + UserID;
        return this._api.apiCaller("GET", endpoint);
    }

    // Condensed Apis
    _NodeGetTreeLayer(TreeId: any, Userid: any, customMapId: number = 0, isSiteSelectionTools: boolean = false) {
        // let Data = {
        //     Layers: TreeId,
        //     UserId: Userid
        // }
        // if (customMapId > 0)
        //     Data["CustomMapId"] = customMapId;
        // if (isSiteSelectionTools)
        //     Data["IsSiteSelectionTools"] = isSiteSelectionTools;
        // const endpoint = this._api._NodeGetLayerTreeViewData;;
        // return this._api.apiCaller("Post", endpoint, Data);        
        var URL = this._api._NodeGetLayerTreeViewData + "?Layers=" + TreeId + "&UserId=" + Userid;
        if (customMapId > 0)
            URL = URL + "&CustomMapId=" + customMapId;
        if (isSiteSelectionTools)
            URL = URL + "&IsSiteSelectionTools=" + isSiteSelectionTools;

        const endpoint = URL;
        return this._api.apiCaller("GET", endpoint);
    }
    _NodeGetExternalIcon(UserId: string) {
        // var Data = {
        //     UserId: UserId
        // }
        const endpoint = this._api._NodeGetExternalIconData + "?UserId=" + UserId;
        return this._api.apiCaller("GET", endpoint);
    }
    // Map Layer Info Apis
    _NodeGetInfoboxData(TableName: any, Bbox: any, CQL_FILTER: any, UserId, energyLayerId) {
        var Data = {
            TableName: TableName,
            Bbox: Bbox,
            CQL_FILTER: CQL_FILTER,
            UserId: UserId,
            energyLayerId: energyLayerId
        }
        const endpoint = this._api._NodeGeoserverGetInfoboxData;
        return this._api.apiCaller("Post", endpoint, Data);
    }
    _GetExternalInfoboxData(URL) {
        return this._api.apiCaller("GET", URL);
    }

    // ****************************** Map Apis ********************************** //
    _NodeGetMyDataLibrary(UserId: any) {
        const endpoint = this._api._NodeGetMyDataLibrary;
        let URLParameter = '?UserId=' + UserId
        const GETLayerLibraryURL = endpoint + URLParameter;
        return this._api.apiCaller('GET', GETLayerLibraryURL);
    }

    _NodeGetPrivateLayerData(privateLayer: any, startIndex: any, maxFeatures: any, CQL_FILTER: any, sortBy: any, bbox: any, UserId: string) {
        var Data = {
            privateLayer: privateLayer,
            startIndex: startIndex,
            maxFeatures: maxFeatures,
            CQL_FILTER: CQL_FILTER,
            sortBy: sortBy,
            bbox: bbox,
            UserId: UserId
        }
        const endpoint = this._api._NodeGeoserverGetPrivateLayerData;
        return this._api.apiCaller("Post", endpoint, Data);
    }

    _NodeGetFeaturetype(energyLayer: any, startIndex: any, maxFeatures: any, CQL_FILTER: any, sortBy: any, bbox: any, UserId: string) {
        var Data = {
            energyLayer: energyLayer,
            startIndex: startIndex,
            maxFeatures: maxFeatures,
            CQL_FILTER: CQL_FILTER,
            sortBy: sortBy,
            bbox: bbox,
            UserId: UserId
        }

        const endpoint = this._api._NodeGeoserverGetLayerFeaturetype;
        return this._api.apiCaller("Post", endpoint, Data);
    }

    _NodeGeoserverSetImageLayerData(SLD_BODY: string, CQL_FILTER: string, UserId: string, zoomData?: string) {
        var data = {
            SldBody: encodeURIComponent(SLD_BODY),
            CqlFilter: CQL_FILTER,
            UserID: UserId
        }
        if (zoomData)
            data['ZoomData'] = zoomData;
        const endpoint = this._api._NodeGeoserverSetImageLayerData;
        return this._api.apiCaller("Post", endpoint, data);
    }

    public _NodeDeleteGeoImageProp(id) {
        const endpoint = this._api._NodeDeleteGeoImageProp + "?UserId=" + id;
        return this._api.apiCaller('GET', endpoint);
    }

    _NodeGetDatabasedonPropertyname(energyLayer: any, startIndex: any, maxFeatures: any, CQL_FILTER: any, sortBy: any, bbox: any, propertyName: any, UserId: string) {
        var Data = {
            energyLayer: energyLayer,
            startIndex: startIndex,
            maxFeatures: maxFeatures,
            CQL_FILTER: CQL_FILTER,
            sortBy: sortBy,
            bbox: bbox,
            propertyName: propertyName,
            UserId: UserId
        }
        const endpoint = this._api._NodeGeoserverDatabasedonPropertyname;
        return this._api.apiCaller("Post", endpoint, Data);
    }

    _NodeGetExportFeatureData(energyLayer: any, CQL_FILTER: any, propertyName: any, UserID: string, Username: string) {
        var Data = {
            energyLayer: energyLayer,
            CQL_FILTER: CQL_FILTER,
            propertyName: propertyName,
            UserID: UserID,
            Username: Username
        }
        const endpoint = this._api._NodeGeoserverExportFeatureData;

        return this._api.apiCaller("Post", endpoint, Data);
    }

    _NodegetLayerData(energyLayer: any, startIndex: any, maxFeatures: any, CQL_FILTER: any, sortBy: any, bbox: any, UserID: string): Promise<any> {
        const endpoint = this._api._NodeGeoserverGetGeoDataNew;
        var allStoredData: GeoData[] = this.geoRequestSavedData.getValue();
        var findData = allStoredData.find(x => ((x.cql_filter == CQL_FILTER) && (x.energyLayerID == energyLayer.EnergyLayerID) && (x.tableName == energyLayer.TableName) && (x.bbox == bbox) && (x.sortBy == sortBy) && (x.startIndex == startIndex) && (x.maxFeatures == maxFeatures)));
        if (findData && findData.tableName) {
            if (findData.data) {
                return Promise.resolve(findData.data);
            } else {
                return new Promise((resolve) => setTimeout(resolve, 1500)).then(data => {
                    if (findData.data) {
                        return Promise.resolve(findData.data);
                    }
                    else {
                        for (var i = allStoredData.length - 1; i >= 0; --i) {
                            if ((allStoredData[i].cql_filter == CQL_FILTER) && (allStoredData[i].energyLayerID == energyLayer.EnergyLayerID) && (allStoredData[i].tableName == energyLayer.TableName) && (allStoredData[i].bbox == bbox) && (allStoredData[i].sortBy == sortBy) && (allStoredData[i].startIndex == startIndex) && (allStoredData[i].maxFeatures == maxFeatures)) {
                                allStoredData.splice(i, 1);
                            }
                        }
                        return this._NodegetLayerData(energyLayer, startIndex, maxFeatures, CQL_FILTER, sortBy, bbox, UserID);
                    }
                });
            }
        }
        else {
            let geoData = new GeoData();
            geoData.bbox = bbox;
            geoData.cql_filter = CQL_FILTER;
            geoData.energyLayerID = energyLayer.EnergyLayerID;
            geoData.maxFeatures = maxFeatures;
            geoData.sortBy = sortBy;
            geoData.startIndex = startIndex;
            geoData.tableName = energyLayer.TableName;
            allStoredData.push(geoData);
            this.setGeoRequestSavedData(allStoredData);
            var Data = {
                energyLayer: energyLayer,
                startIndex: startIndex,
                maxFeatures: maxFeatures,
                CQL_FILTER: CQL_FILTER,
                sortBy: sortBy,
                bbox: bbox,
                UserId: UserID
            }
            return this.GetLayerDataRequest(endpoint, Data, CQL_FILTER, energyLayer, bbox, sortBy, startIndex, maxFeatures).then(data => { return Promise.resolve(data) }).catch(error => { return Promise.reject(error) });;

        }

    }

    _NodeGetParcelsCount(requestBodies: any[]) {
        const endpoint = this._api._NodeGeoserverGetParcelsLayersDataCountForSiteSelection;
        return this._api.apiCaller("Post", endpoint, requestBodies);
    }

    _NodeGeoserverGetTotalCountListOfLayers(layerList: any[]) {
        let data = {
            LayerList: layerList
        };
        const endpoint = this._api._NodeGeoserverGetTotalCountListOfLayers;
        return this._api.apiCaller("Post", endpoint, data);
    }

    GetLayerDataRequest(endpoint, Data, CQL_FILTER, energyLayer, bbox, sortBy, startIndex, maxFeatures): Promise<any> {
        return this._api.apiCaller("Post", endpoint, Data).toPromise().then(result => {
            let allData = this.geoRequestSavedData.getValue();
            let existingData = allData.find(x => ((x.cql_filter == CQL_FILTER) && (x.energyLayerID == energyLayer.EnergyLayerID) && (x.tableName == energyLayer.TableName) && (x.bbox == bbox) && (x.sortBy == sortBy) && (x.startIndex == startIndex) && (x.maxFeatures == maxFeatures)));
            if (existingData)
                existingData.data = result;
            else {
                let geoData = new GeoData();
                geoData.bbox = bbox;
                geoData.cql_filter = CQL_FILTER;
                geoData.energyLayerID = energyLayer.EnergyLayerID;
                geoData.maxFeatures = maxFeatures;
                geoData.sortBy = sortBy;
                geoData.startIndex = startIndex;
                geoData.tableName = energyLayer.TableName;
                geoData.data = result;
                allData.push(geoData);
                this.setGeoRequestSavedData(allData);
            }
            this.setGeoRequestSavedData(allData);
            return result;
        }).catch(ex => {
            return Promise.reject(ex);
        });
    }

    _NodeGetLayerCategory(UserId: any, LayerGroup: any, CategoryIdForFilter: any) {
        var endpoint = this._api._NodeGetMapsearchLayesCategory + "?UserId=" + UserId + "&LayerGroup=" + LayerGroup + "&CategoryIdForFilter=" + CategoryIdForFilter;
        return this._api.apiCaller("GET", endpoint);
    }

    _NodeGetEnergyLayerLibrary(UserId: any, LayerGroup: any, CategoryIdForFilter: any, take: number, skip: number) {
        const endpoint = this._api._NodeGetMapSearchEnergyLayerLibrary;
        // var Data = {
        //     UserID: UserId,
        //     LayerGroup: LayerGroup,
        //     CategoryIdForFilter: CategoryIdForFilter,
        //     take: take,
        //     skip: skip
        // }
        var URL = endpoint + "?UserID=" + UserId + "&LayerGroup=" + LayerGroup + "&CategoryIdForFilter=" + CategoryIdForFilter + "&take=" + take + "&skip=" + skip;
        return this._api.apiCaller("GET", URL);
    }

    _NodeSaveCustomSymbols(JsonExternalIcons) {
        const endpoint = this._api._NodeSaveCustomSymbols;
        return this._api.apiCaller('Post', endpoint, JsonExternalIcons);
    }

    _NodeDeleteExternalSysmbols(UserId: string, filename: string, ID: string) {
        const endpoint = this._api._NodeDeleteExternalSysmbols;
        const DeleteExternalSysmbols = endpoint + "?UserId=" + UserId + "&filename=" + filename + "&IconID=" + ID;
        return this._api.apiCaller('GET', DeleteExternalSysmbols);
    }

    // Base Map Apis
    public _NodeGetBaseMapTypes(UserId) {
        const endpoint = this._api._NodegetBaseMap + "?UserId=" + UserId;
        return this._api.apiCaller('GET', endpoint);
    }

    public _NodeInsertBaseMapLogs(BaseMapData, CurrentMapSettings, UserId) {
        let data = {
            BaseMapData: BaseMapData,
            Mapsetting: CurrentMapSettings,
            UserId: UserId
        }
        const endpoint = this._api._NodeInsertBaseMapLogs;
        return this._api.apiCaller('POST', endpoint, data);
    }

    public _NodeSendLayerFeedback(feedbackData) {
        const endpoint = this._api._NodeSendFeedbackData;
        return this._api.apiCaller('POST', endpoint, feedbackData);
    }

    /**** My Profile  */
    public _NodeSaveMapsettings(UserId, BaseMapProviderID) {
        const endpoint = this._api._NodeSaveMapSetting + "?UserId=" + UserId + "&BaseMapProviderID=" + BaseMapProviderID;
        return this._api.apiCaller('GET', endpoint, endpoint);
    }
    public _NodeGetUserDetails(UserId) {
        const endpoint = this._api._NodeGetUserDetails + "?UserId=" + UserId;
        return this._api.apiCaller('GET', endpoint);
    }
    public _NodeChangePassword(oldtext, newtext, UserId) {
        var data = {
            oldtext: btoa(oldtext),
            newtext: btoa(newtext),
            UserId: UserId
        }
        const endpoint = this._api._NodeMyProfileChangePassword;
        return this._api.apiCaller('POst', endpoint, data);
    }

    /************ MyMap ************/
    public _NodeSaveMyMap(customMap, energyLayers, privateLayers, defaultCheckedLayers, layerGridFilters, EnergyLayersStylebyuser = []) {
        var data = {
            CustomMaps: customMap,
            EnergyLayers: energyLayers,
            DataSets: privateLayers,
            DefaultCheckedLayers: defaultCheckedLayers,
            LayerGridFilters: layerGridFilters,
            EnergyLayersStylebyuser: EnergyLayersStylebyuser
        }
        const endpoint = this._api._NodeSaveMyMap;
        return this._api.apiCaller('Post', endpoint, data);
    }

    public _NodeCheckMapName(mapName) {
        const endpoint = this._api._NodeCheckMapName + "?MapName=" + mapName;
        return this._api.apiCaller('GET', endpoint);
    }

    public _NodeUpdateMyMap(mapId, customMap, energyLayers, privateLayers, defaultCheckedLayers, layerGridFilters) {        
        var mapData = {
            CustomMaps: customMap,
            EnergyLayers: energyLayers,
            DataSets: privateLayers,
            DefaultCheckedLayers: defaultCheckedLayers,
            LayerGridFilters: layerGridFilters
        }
        var data = {
            CustomMapId: mapId,
            MapData: mapData
        }
        const endpoint = this._api._NodeUpdateMyMap;
        return this._api.apiCaller('Post', endpoint, data);
    }

    public _NodeGetMapData(mapId) {
        const endpoint = this._api._NodeGetMapData + "?CustomMapId=" + mapId;
        return this._api.apiCaller('GET', endpoint);
    }

    public _NodeGetGUIDOfDataSets(dataSetIds) {
        const endpoint = this._api._NodeGetGUIDByDataSets + "?DataSetIds=" + dataSetIds.toString();
        return this._api.apiCaller('GET', endpoint);
    }

    public _NodeDeleteMyMap(mapId) {
        const endpoint = this._api._NodeDeleteMyMap + "?CustomMapId=" + mapId;
        return this._api.apiCaller('GET', endpoint);
    }

    public _NodeGetListOfCompnayUserList(UserId, MapId) {
        const endpoint = this._api._NodeGetListOfCompnayUserList + "?UserId=" + UserId + "&MapId=" + MapId;
        return this._api.apiCaller('GET', endpoint);

    }

    public _NodeSaveSharedMymap(SaveData) {
        const endpoint = this._api._NodeSaveSharedMymap;
        return this._api.apiCaller('Post', endpoint, SaveData);
    }

    public _NodeInsertMyMapLogs(MyMapData: any, UserId: any, userName: any) {
        let data = {
            MyMapData: MyMapData,
            UserId: UserId,
            UserName: userName
        }
        const endpoint = this._api._NodeInsertMyMapLogs;
        return this._api.apiCaller('POST', endpoint, data);
    }


    public _NodeInsertMyMapChangedLogs(MyMapData: any, UserId: any) {
        let data = {
            MyMapData: MyMapData,
            UserId: UserId
        }
        const endpoint = this._api._NodeInsertMyMapChangedLogs;
        return this._api.apiCaller('POST', endpoint, data);
    }

    /************ Infobox Notes ************/
    public _NodeSaveInfoboxNotes(data) {
        const endpoint = this._api._NodeSaveInfoboxNotes;
        return this._api.apiCaller('Post', endpoint, data);
    }

    public _NodeUpdateInfoboxNotes(data) {
        const endpoint = this._api._NodeUpdateInfoboxNotes;
        return this._api.apiCaller('Post', endpoint, data);
    }

    public _NodeDeleteInfoboxNotes(id) {
        const endpoint = this._api._NodeDeleteInfoboxNotes;
        return this._api.apiCaller('Post', endpoint, id);
    }

    public _NodeGetInfoboxNotesforLayer(item) {
        // const endpoint = this._api._NodeGetInfoboxNotesforLayer;
        // return this._api.apiCaller('Post', endpoint, item);
        const endpoint = this._api._NodeGetInfoboxNotesforLayer + "?userId=" + item.userId + "&energylayerId=" + item.energylayerId;
        return this._api.apiCaller('GET', endpoint);
    }

    /************ Parcel Buffer Tool APis ************/
    public GetLocationFromLatLng(data) {
        const endpoint = this._api._NodeGetStatesFromLatLng;
        return this._api.apiCaller('Post', endpoint, data);
    }

    public GetLocationFromLineString(data) {
        const endpoint = this._api._NodeGetStatesFromLineString;
        return this._api.apiCaller('Post', endpoint, data);
    }

    /************ Shared Data APis ************/
    public _NodeGetSharedData(userId) {
        const endpoint = this._api._NodeGetSharedData + "?UserId=" + userId;
        return this._api.apiCaller('get', endpoint);
    }

    /************ Draw Tools APis ************/
    public _NodeSaveDrawTools(data) {
        const endpoint = this._api._NodeSaveDrawTools;
        return this._api.apiCaller('Post', endpoint, data);
    }

    public _NodeUpdateDrawTools(data) {
        const endpoint = this._api._NodeUpdateDrawTools;
        return this._api.apiCaller('Post', endpoint, data);
    }

    public _NodeGetDrawTools(userId) {
        const endpoint = this._api._NodeGetDrawTools + "?UserId=" + userId;
        return this._api.apiCaller('get', endpoint);
    }

    public _NodeGetSharedDrawTools(userId, customerId) {
        const endpoint = this._api._NodeGetSharedDrawTools + "?UserId=" + userId + "&CustomerId=" + customerId;
        return this._api.apiCaller('get', endpoint);
    }

    public _NodeGetDrawToolsItems(layerId) {
        const endpoint = this._api._NodeGetDrawToolsItems + "?LayerId=" + layerId;
        return this._api.apiCaller('get', endpoint);
    }

    public _NodeDeleteDrawTools(layerId) {
        const endpoint = this._api._NodeDeleteDrawTool + "?LayerId=" + layerId;
        return this._api.apiCaller('get', endpoint);
    }

    public _NodeDeleteSharedDrawTools(data) {
        const endpoint = this._api._NodeDeleteSharedDrawTool;
        return this._api.apiCaller('Post', endpoint, data);
    }

    public _NodeDeleteDrawToolsItem(itemId) {
        const endpoint = this._api._NodeDeleteDrawToolItem + "?DrawItemId=" + itemId;
        return this._api.apiCaller('get', endpoint);
    }

    /************ Site selection APis ************/
    _NodeGetSiteSelectionProperties(tableName) {
        const endpoint = this._api._NodeGetSiteSelectionProperties + "?TableName=" + tableName;
        return this._api.apiCaller("GET", endpoint);
    }

    _NodeGetEnergyLayersIDS(tableNames) {
        var data = {
            TableNames: tableNames
        }
        const endpoint = this._api._NodeGetEnergyLayersIDS;
        return this._api.apiCaller('Post', endpoint, data);
    }

    public _NodeInsertSiteSelectionLogs(siteSelectionFilterData: any, UserId: any) {
        let data = {
            SiteSelectionFilterData: siteSelectionFilterData,
            UserId: UserId
        }
        const endpoint = this._api._NodeInsertSiteSelectionLogs;
        return this._api.apiCaller('POST', endpoint, data);
    }

    // ----------------------------------------------------------------------------//
    // ************************** END of Node apis ******************************//
    // ----------------------------------------------------------------------------//
}