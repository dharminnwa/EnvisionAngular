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
var http_1 = require("@angular/http");
var api_service_1 = require("./api.service");
var rxjs_1 = require("rxjs");
var geodata_1 = require("../models/geodata");
var HttpRequestService = (function () {
    function HttpRequestService(http, _api) {
        this.http = http;
        this._api = _api;
        this.geoRequestSavedData = new rxjs_1.BehaviorSubject([]);
    }
    HttpRequestService.prototype.setGeoRequestSavedData = function (data) {
        this.geoRequestSavedData.next(data);
    };
    // ----------------------------------------------------------------------------//
    // ************************** START of .NET apis ******************************//
    // ----------------------------------------------------------------------------//
    // Auth Apis
    HttpRequestService.prototype.Login = function (UserName, Password, KeepmeLogin, LogInType, AutoLogOutTimeInMinutes) {
        var endpoint = this._api.LoginURL;
        var LoginUrl = endpoint + "/?UserName=" + encodeURIComponent(UserName) + "&Password=" + encodeURIComponent(Password) + "&IsPersistent=" + KeepmeLogin + "&LogInType=" + LogInType + "&AutoLogOutTimeInMinutes=" + AutoLogOutTimeInMinutes;
        return this.http.get(LoginUrl);
    };
    HttpRequestService.prototype.Logout = function (LoginHandlerId) {
        var endpoint = this._api.LogOutURL;
        var LogoutUrl = endpoint + "?LoginHandlerId=" + LoginHandlerId;
        return this.http.get(LogoutUrl);
    };
    // Condensed Apis
    HttpRequestService.prototype._NodeGetPrivateTreeLayer = function (TreeId, UserId, LoggedInUserId, CustomMapId) {
        var endpoint = this._api._NodeGetPrivateLayerTreeViewData;
        var treeUrl = endpoint + '/?LayerId=' + TreeId + "&UserId=" + UserId + "&LoggedInUserId=" + LoggedInUserId + '&CustomMapId=' + CustomMapId;
        return this._api.apiCaller('GET', treeUrl);
    };
    HttpRequestService.prototype._NodeGetPrivateGroupTreeLayer = function (TreeId, ChildIds, UserId, LoggedInUserId, CustomMapId) {
        var endpoint = this._api._NodeGetPrivateGroupLayerTreeViewData;
        var treeUrl = endpoint + '/?LayerId=' + TreeId + "&ChildIds=" + ChildIds.toString() + "&UserId=" + UserId + "&LoggedInUserId=" + LoggedInUserId + '&CustomMapId=' + CustomMapId;
        return this._api.apiCaller('GET', treeUrl);
    };
    HttpRequestService.prototype._NodeRemoveDataFromDataSet = function (Id) {
        var endpoint = this._api._NodeRemoveLayerFromMyDataLibrary;
        var treeUrl = endpoint + '/?LayerId=' + Id;
        return this._api.apiCaller('GET', treeUrl);
    };
    // Create Layer Apis
    HttpRequestService.prototype._NodeGetPipelineWizardData = function (UserId) {
        var endpoint = this._api._NodeGetPipelineWizardData + "?UserId=" + UserId;
        return this._api.apiCaller("get", endpoint);
    };
    HttpRequestService.prototype._NodeGetRailWizardData = function (UserId) {
        var endpoint = this._api._NodeGetRailWizardData + "?UserId=" + UserId;
        ;
        return this._api.apiCaller("get", endpoint);
    };
    HttpRequestService.prototype._NodeSaveCreatedLayer = function (DatasetObje) {
        var endpoint = this._api._NodeSaveCreateLayerData;
        return this._api.serverapiCaller("Post", endpoint, DatasetObje);
    };
    // Dashboard Apis
    // start Dashboard Facilities 
    HttpRequestService.prototype._NodeGetAssetLookupData = function () {
        var endpoint = this._api._NodeGetAssetLookupData;
        return this._api.apiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetComodityStateData = function (Comodity, Factype) {
        var endpoint = this._api._NodeGetComodityStatename + "?Comodity=" + encodeURIComponent(Comodity) + "&Factype=" + encodeURIComponent(Factype);
        return this._api.apiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetTypeandComoditybasedonStateData = function (StateName) {
        var endpoint = this._api._NodeGetTypeandCommoditybasedonstate + "?StateName=" + encodeURIComponent(StateName);
        return this._api.apiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetCommoditybasedonStateandTypeData = function (StateName, Factype) {
        var endpoint = this._api._NodeGetCommodityBasedonStateandType + "?StateName=" + encodeURIComponent(StateName) + "&Factype=" + encodeURIComponent(Factype);
        return this._api.apiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetGetFactypeBasedonStateandCommodity = function (StateName, Comodity) {
        var endpoint = this._api._NodeGetFactypeBasedonStateandCommodity + "?StateName=" + encodeURIComponent(StateName) + "&Comodity=" + encodeURIComponent(Comodity);
        return this._api.apiCaller("GET", endpoint);
    };
    //End Dashboard Facilities 
    // Start  Dashboard Pipleline 
    HttpRequestService.prototype._NodeGetPiplelineandothertabData = function () {
        var endpoint = this._api._NodeGetPiplelineandothertabData;
        return this._api.apiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetPiplelineDatabasedonFiltervalue = function (Commodity, State, Status) {
        var endpoint = this._api._NodeGetPiplelineDatabasedonfilter + "?Commodity=" + encodeURIComponent(Commodity) + "&State=" + encodeURIComponent(State) + "&Status=" + encodeURIComponent(Status);
        return this._api.apiCaller("GET", endpoint);
    };
    // End Dashboard Pipleline
    // Start Power Plant
    HttpRequestService.prototype._NodeGetPowerPlantDatabasedonFiltervalue = function (Fueltype, PrimeMover, State) {
        var endpoint = this._api._NodeGetPowerPlantDatabasedonfilter + "?Fueltype=" + encodeURIComponent(Fueltype) + "&PrimeMover=" + encodeURIComponent(PrimeMover) + "&State=" + encodeURIComponent(State);
        return this._api.apiCaller("GET", endpoint);
    };
    // End Power Plant
    // Start Substation
    HttpRequestService.prototype._NodeGetSubstationDatabasedonFiltervalue = function (status, sybtype, State) {
        var endpoint = this._api._NodeGetSubstationDatabasedonfilter + "?status=" + encodeURIComponent(status) + "&sybtype=" + encodeURIComponent(sybtype) + "&State=" + encodeURIComponent(State);
        return this._api.apiCaller("GET", endpoint);
    };
    //end substation
    // Start Transmission Line
    HttpRequestService.prototype._NodeGetTransmissionDatabasedonFiltervalue = function (status, Voltage, State) {
        var endpoint = this._api._NodeGetTransmissionDatabasedonfilter + "?status=" + encodeURIComponent(status) + "&Voltage=" + encodeURIComponent(Voltage) + "&State=" + encodeURIComponent(State);
        return this._api.apiCaller("GET", endpoint);
    };
    //End Transmission Line
    HttpRequestService.prototype._NodeGetParcelStates = function (UserId) {
        var endpoint = this._api._NodeGetParcelStates + "?UserId=" + UserId;
        return this._api.apiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetWellStates = function () {
        var endpoint = this._api._NodeGetWellStates;
        return this._api.apiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetTransProjects = function () {
        var endpoint = this._api._NodeGetTransProjects;
        return this._api.apiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetPipelineActivities = function () {
        var endpoint = this._api._NodeGetPipelineActivities;
        return this._api.apiCaller("GET", endpoint);
    };
    // File Upload Apis
    HttpRequestService.prototype.PostFile = function (filesToUpload, userData, fileType) {
        var url = this._api._NodePostFileURL;
        var formData = new FormData();
        for (var i = 0; i < filesToUpload.length; i++) {
            formData.append(fileType + '-' + filesToUpload[i].name, filesToUpload[i], filesToUpload[i].name);
        }
        formData.append('UserData', JSON.stringify(userData));
        return this.http.post(url, formData);
    };
    // Global Search Apis    
    HttpRequestService.prototype._NodeGetglobalSearchEnergylayer = function (UserId, LayerGroup, SearchText, take, skip) {
        var endpoint = this._api._NodeGetglobalSearchEnergylayer;
        var URLParameter = '?UserId=' + UserId + '&LayerGroup=' + LayerGroup + '&SearchText=' + encodeURIComponent(SearchText) + '&take=' + take + '&skip=' + skip;
        var GETLayerLibraryURL = endpoint + URLParameter;
        return this._api.serverapiCaller("GET", GETLayerLibraryURL);
    };
    HttpRequestService.prototype._NodesaveTemporaryLayer = function (DatasetObje) {
        var endpoint = this._api._NodeSaveTemporaryLayer;
        return this._api.serverapiCaller("Post", endpoint, DatasetObje);
    };
    HttpRequestService.prototype._NodesaveMapGridFilter = function (MapGridfilterData) {
        var endpoint = this._api._NodeMapGridFilter;
        return this._api.serverapiCaller("Post", endpoint, MapGridfilterData);
    };
    //*************************** Intelligence Apis ********************************//
    // Company Profile     
    HttpRequestService.prototype._NodeGetAllCompanyOptions = function () {
        var endpoint = this._api._NodeGetCompanyfilterOptionsURL;
        //return this._api.apiCaller("GET", endpoint);
        return this._api.serverapiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetSuggestiveCompanyData = function () {
        var endpoint = this._api._NodeGetCompanyNameSuggestiveURL;
        //return this._api.apiCaller("GET", endpoint);
        return this._api.serverapiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetFilterdCompanyList = function (searchString) {
        var endpoint = this._api._NodeGetFilterCompnayListURL;
        if (searchString) {
            endpoint = endpoint + "?filter=" + encodeURIComponent(searchString);
        }
        return this._api.apiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetAllJsonCompnayList = function () {
        var endpoint = this._api._NodeGetAllJsonCompnayListURL;
        return this._api.serverapiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetAllCompnayList = function (take, skip) {
        var endpoint = this._api._NodeGetAllCompnayListURL + "?take=" + take + "&skip=" + skip;
        return this._api.serverapiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetCompanySearchResult = function (State, Commodity, Enitity, EntityType, BusinessLine) {
        var Data = {
            State: State,
            Commodity: Commodity,
            Enitity: Enitity,
            EntityType: EntityType,
            BusinessLine: BusinessLine
        };
        var endpoint = this._api._NodeGetCompanySearchResult;
        return this._api.apiCaller("Post", endpoint, Data);
    };
    // Pipeline Activity    
    HttpRequestService.prototype._NodeGetPiplelinefilterOptions = function () {
        var endpoint = this._api._NodeGetPipelineActivityAllFilterOption;
        //return this._api.apiCaller("GET", endpoint);
        return this._api.serverapiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetSuggestivePipelineActivityResults = function () {
        var endpoint = this._api._NodeGetSuggestivePipelineActivityResults;
        //return this._api.apiCaller("GET", endpoint);
        return this._api.serverapiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetPipelineActivityGridDataURL = function () {
        var endpoint = this._api._NodeGetPipelineActivityGridDataURL;
        //return this._api.serverapiCaller("GET", endpoint);
        return this._api.serverapiCaller("GET", endpoint);
    };
    // Transmission Project 
    HttpRequestService.prototype._NodeGetAllTransmissionProjectFilterOptions = function () {
        var endpoint = this._api._NodeGetAllTransmissionProjectFilterOptions;
        return this._api.serverapiCaller("GET", endpoint);
    };
    HttpRequestService.prototype.GetSuggestiveTransmissionProjectDataResults = function () {
        var endpoint = this._api._NodeGetSuggestiveTransmissionProjectDataResults;
        return this._api.serverapiCaller("GET", endpoint);
    };
    HttpRequestService.prototype.GetTransmissionProjectsData = function () {
        var endpoint = this._api._NodeGetTransmissionProjectsData;
        return this._api.serverapiCaller("GET", endpoint);
    };
    // Power Plant    
    HttpRequestService.prototype._NodeGetAllPowerPlantFilterOptions = function () {
        var endpoint = this._api._NodeGetAllPowerPlantFilterOptions;
        return this._api.serverapiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetSuggestivePowerplantResults = function () {
        var endpoint = this._api._NodeGetSuggestivePowerplantResults;
        return this._api.serverapiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetPowerPlantsData = function () {
        var endpoint = this._api._NodeGetPowerPlantsData;
        return this._api.serverapiCaller("GET", endpoint);
    };
    // Generating Units
    HttpRequestService.prototype._NodeGetAllGeneratingUnitOptions = function () {
        var endpoint = this._api._NodeGetAllGeneratingUnitOptions;
        return this._api.serverapiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetAllGeneratingUnitList = function (take, skip) {
        var endpoint = this._api._NodeGetGeneratingUnits + "?take=" + take + "&skip=" + skip;
        return this._api.serverapiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetSuggestiveGeneratingUnitsResults = function () {
        var endpoint = this._api._NodeGetSuggestiveGeneratingUnitsResults;
        return this._api.serverapiCaller("GET", endpoint);
    };
    // ************************* Map Layer Info Apis **************************** //
    HttpRequestService.prototype.GetKmlData = function (dataSetId, fileType) {
        var endpoint = this._api._NodeGetKmlData;
        var URLParameter = '?dataSetId=' + dataSetId + '&fileType=' + fileType;
        var GETLayerLibraryURL = endpoint + URLParameter;
        return this._api.serverapiCaller("GET", GETLayerLibraryURL);
    };
    // Layer style by User  
    HttpRequestService.prototype._NodeSaveLayerstylebyUser = function (JsonListofstyle, externaliconURL) {
        var Data = {
            JsonListofstyle: JSON.parse(JsonListofstyle),
            externaliconURL: externaliconURL
        };
        var endpoint = this._api._NodeSaveLayerStyles;
        return this._api.apiCaller("Post", endpoint, Data);
    };
    HttpRequestService.prototype._NodeSavePrivateLayerstylebyUser = function (JsonListofstyle, externaliconURL) {
        var Data = {
            JsonListofstyle: JSON.parse(JsonListofstyle),
            externaliconURL: externaliconURL
        };
        var endpoint = this._api._NodeSavePrivateLayerStyles;
        return this._api.apiCaller("Post", endpoint, Data);
    };
    HttpRequestService.prototype._NodeUpdateMyDataLayer = function (data) {
        var endpoint = this._api._NodeUpdatemyDataLayer;
        return this._api.apiCaller('POST', endpoint, data);
    };
    // **************************** Tools Apis ************************************//
    HttpRequestService.prototype._NodeGetAllBookMark = function (UserID) {
        var endpoint = this._api._NodeGetBookMarks + '/?UserID=' + UserID;
        return this._api.apiCaller('GET', endpoint);
    };
    HttpRequestService.prototype._NodeSaveBookMark = function (UID, Name, Lat, Lng, Zoom) {
        var endpoint = this._api._NodeSaveBookMark;
        var data = {
            UserID: UID,
            Name: Name,
            Latitude: Lat,
            Longitude: Lng,
            ZoomLevel: Zoom,
            BaseMapProviderID: 11
        };
        return this._api.apiCaller('POST', endpoint, data);
    };
    HttpRequestService.prototype._NodeDeleteBookmark = function (bookmarkID) {
        var endpoint = this._api._NodedeleteBookmark + '/?bookmarkID=' + bookmarkID;
        return this._api.apiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetUserMaps = function (UserID) {
        var endpoint = this._api._NodegetUserMaps + '/?UserID=' + UserID;
        return this._api.apiCaller("GET", endpoint);
    };
    // ----------------------------------------------------------------------------//
    // ************************** END of .NET apis ******************************//
    // ----------------------------------------------------------------------------//
    // ----------------------------------------------------------------------------//
    // ************************** START of Node apis ******************************//
    // ----------------------------------------------------------------------------//
    // Auth Apis
    HttpRequestService.prototype._NodeLogin = function (UserName, Password, KeepmeLogin, LogInType, AutoLogOutTimeInMinutes) {
        var endpoint = this._api._NodeLoginURL;
        var Data = {
            UserName: UserName,
            Password: Password,
            KeepmeLogin: KeepmeLogin,
            LogInType: LogInType,
            AutoLogOutTimeInMinutes: AutoLogOutTimeInMinutes
        };
        return this._api.postUserLogin(endpoint, Data);
    };
    HttpRequestService.prototype._NodeLogout = function (LoginHandlerId, UserID) {
        var endpoint = this._api._NodeLogOutURL;
        var Data = {
            LoginHandlerId: LoginHandlerId,
            UserID: UserID
        };
        return this._api.apiCaller("Post", endpoint, Data);
    };
    // User Roles
    HttpRequestService.prototype._NodeGetUserRoles = function (UserID) {
        var endpoint = this._api._NodeGetUserRoles;
        var Data = {
            UserID: UserID
        };
        return this._api.apiCaller("Post", endpoint, Data);
    };
    // Condensed Apis
    HttpRequestService.prototype._NodeGetTreeLayer = function (TreeId, Userid, customMapId, isSiteSelectionTools) {
        if (customMapId === void 0) { customMapId = 0; }
        if (isSiteSelectionTools === void 0) { isSiteSelectionTools = false; }
        var Data = {
            Layers: TreeId,
            UserId: Userid
        };
        if (customMapId > 0)
            Data["CustomMapId"] = customMapId;
        if (isSiteSelectionTools)
            Data["IsSiteSelectionTools"] = isSiteSelectionTools;
        var endpoint = this._api._NodeGetLayerTreeViewData;
        ;
        return this._api.apiCaller("Post", endpoint, Data);
    };
    HttpRequestService.prototype._NodeGetExternalIcon = function (UserId) {
        var Data = {
            UserId: UserId
        };
        var endpoint = this._api._NodeGetExternalIconData;
        ;
        return this._api.apiCaller("POST", endpoint, Data);
    };
    // Map Layer Info Apis
    HttpRequestService.prototype._NodeGetInfoboxData = function (TableName, Bbox, CQL_FILTER, UserId, energyLayerId) {
        var Data = {
            TableName: TableName,
            Bbox: Bbox,
            CQL_FILTER: CQL_FILTER,
            UserId: UserId,
            energyLayerId: energyLayerId
        };
        var endpoint = this._api._NodeGeoserverGetInfoboxData;
        return this._api.apiCaller("Post", endpoint, Data);
    };
    HttpRequestService.prototype._GetExternalInfoboxData = function (URL) {
        return this._api.serverapiCaller("GET", URL);
    };
    // ****************************** Map Apis ********************************** //
    HttpRequestService.prototype._NodeGetMyDataLibrary = function (UserId) {
        var endpoint = this._api._NodeGetMyDataLibrary;
        var URLParameter = '?UserId=' + UserId;
        var GETLayerLibraryURL = endpoint + URLParameter;
        return this._api.apiCaller('GET', GETLayerLibraryURL);
    };
    HttpRequestService.prototype._NodeGetPrivateLayerData = function (privateLayer, startIndex, maxFeatures, CQL_FILTER, sortBy, bbox, UserId) {
        var Data = {
            privateLayer: privateLayer,
            startIndex: startIndex,
            maxFeatures: maxFeatures,
            CQL_FILTER: CQL_FILTER,
            sortBy: sortBy,
            bbox: bbox,
            UserId: UserId
        };
        var endpoint = this._api._NodeGeoserverGetPrivateLayerData;
        return this._api.apiCaller("Post", endpoint, Data);
    };
    HttpRequestService.prototype._NodeGetFeaturetype = function (energyLayer, startIndex, maxFeatures, CQL_FILTER, sortBy, bbox, UserId) {
        var Data = {
            energyLayer: energyLayer,
            startIndex: startIndex,
            maxFeatures: maxFeatures,
            CQL_FILTER: CQL_FILTER,
            sortBy: sortBy,
            bbox: bbox,
            UserId: UserId
        };
        var endpoint = this._api._NodeGeoserverGetLayerFeaturetype;
        return this._api.apiCaller("Post", endpoint, Data);
    };
    HttpRequestService.prototype._NodeGeoserverSetImageLayerData = function (SLD_BODY, CQL_FILTER, UserId) {
        var data = {
            SldBody: SLD_BODY,
            CqlFilter: CQL_FILTER,
            UserID: UserId
        };
        var endpoint = this._api._NodeGeoserverSetImageLayerData;
        return this._api.apiCaller("Post", endpoint, data);
    };
    HttpRequestService.prototype._NodeDeleteGeoImageProp = function (id) {
        var endpoint = this._api._NodeDeleteGeoImageProp + "?UserId=" + id;
        return this._api.apiCaller('GET', endpoint);
    };
    HttpRequestService.prototype._NodeGetDatabasedonPropertyname = function (energyLayer, startIndex, maxFeatures, CQL_FILTER, sortBy, bbox, propertyName, UserId) {
        var Data = {
            energyLayer: energyLayer,
            startIndex: startIndex,
            maxFeatures: maxFeatures,
            CQL_FILTER: CQL_FILTER,
            sortBy: sortBy,
            bbox: bbox,
            propertyName: propertyName,
            UserId: UserId
        };
        var endpoint = this._api._NodeGeoserverDatabasedonPropertyname;
        return this._api.apiCaller("Post", endpoint, Data);
    };
    HttpRequestService.prototype._NodeGetExportFeatureData = function (energyLayer, CQL_FILTER, propertyName, UserID, Username) {
        var Data = {
            energyLayer: energyLayer,
            CQL_FILTER: CQL_FILTER,
            propertyName: propertyName,
            UserID: UserID,
            Username: Username
        };
        var endpoint = this._api._NodeGeoserverExportFeatureData;
        return this._api.apiCaller("Post", endpoint, Data);
    };
    HttpRequestService.prototype._NodegetLayerData = function (energyLayer, startIndex, maxFeatures, CQL_FILTER, sortBy, bbox, UserID) {
        var _this = this;
        var endpoint = this._api._NodeGeoserverGetGeoDataNew;
        var allStoredData = this.geoRequestSavedData.getValue();
        var findData = allStoredData.find(function (x) { return ((x.cql_filter == CQL_FILTER) && (x.energyLayerID == energyLayer.EnergyLayerID) && (x.tableName == energyLayer.TableName) && (x.bbox == bbox) && (x.sortBy == sortBy) && (x.startIndex == startIndex) && (x.maxFeatures == maxFeatures)); });
        if (findData && findData.tableName) {
            if (findData.data) {
                return Promise.resolve(findData.data);
            }
            else {
                return new Promise(function (resolve) { return setTimeout(resolve, 1500); }).then(function (data) {
                    if (findData.data) {
                        return Promise.resolve(findData.data);
                    }
                    else {
                        for (var i = allStoredData.length - 1; i >= 0; --i) {
                            if ((allStoredData[i].cql_filter == CQL_FILTER) && (allStoredData[i].energyLayerID == energyLayer.EnergyLayerID) && (allStoredData[i].tableName == energyLayer.TableName) && (allStoredData[i].bbox == bbox) && (allStoredData[i].sortBy == sortBy) && (allStoredData[i].startIndex == startIndex) && (allStoredData[i].maxFeatures == maxFeatures)) {
                                allStoredData.splice(i, 1);
                            }
                        }
                        return _this._NodegetLayerData(energyLayer, startIndex, maxFeatures, CQL_FILTER, sortBy, bbox, UserID);
                    }
                });
            }
        }
        else {
            var geoData = new geodata_1.GeoData();
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
            };
            return this.GetLayerDataRequest(endpoint, Data, CQL_FILTER, energyLayer, bbox, sortBy, startIndex, maxFeatures).then(function (data) { return Promise.resolve(data); }).catch(function (error) { return Promise.reject(error); });
            ;
        }
    };
    HttpRequestService.prototype._NodeGetParcelsCount = function (requestBodies) {
        var endpoint = this._api._NodeGeoserverGetParcelsLayersDataCountForSiteSelection;
        return this._api.apiCaller("Post", endpoint, requestBodies);
    };
    HttpRequestService.prototype.GetLayerDataRequest = function (endpoint, Data, CQL_FILTER, energyLayer, bbox, sortBy, startIndex, maxFeatures) {
        var _this = this;
        return this._api.apiCaller("Post", endpoint, Data).toPromise().then(function (result) {
            var allData = _this.geoRequestSavedData.getValue();
            var existingData = allData.find(function (x) { return ((x.cql_filter == CQL_FILTER) && (x.energyLayerID == energyLayer.EnergyLayerID) && (x.tableName == energyLayer.TableName) && (x.bbox == bbox) && (x.sortBy == sortBy) && (x.startIndex == startIndex) && (x.maxFeatures == maxFeatures)); });
            if (existingData)
                existingData.data = result;
            else {
                var geoData = new geodata_1.GeoData();
                geoData.bbox = bbox;
                geoData.cql_filter = CQL_FILTER;
                geoData.energyLayerID = energyLayer.EnergyLayerID;
                geoData.maxFeatures = maxFeatures;
                geoData.sortBy = sortBy;
                geoData.startIndex = startIndex;
                geoData.tableName = energyLayer.TableName;
                geoData.data = result;
                allData.push(geoData);
                _this.setGeoRequestSavedData(allData);
            }
            _this.setGeoRequestSavedData(allData);
            return result;
        }).catch(function (ex) {
            return Promise.reject(ex);
        });
    };
    HttpRequestService.prototype._NodeGetLayerCategoey = function (UserId, LayerGroup, CategoryIdForFilter) {
        var endpoint = this._api._NodeGetMapsearchLayesCategory;
        var Data = {
            UserId: UserId,
            LayerGroup: LayerGroup,
            CategoryIdForFilter: CategoryIdForFilter
        };
        return this._api.apiCaller("Post", endpoint, Data);
    };
    HttpRequestService.prototype._NodeGetEnergyLayerLibrary = function (UserId, LayerGroup, CategoryIdForFilter, take, skip) {
        var endpoint = this._api._NodeGetMapSearchEnergyLayerLibrary;
        var Data = {
            UserID: UserId,
            LayerGroup: LayerGroup,
            CategoryIdForFilter: CategoryIdForFilter,
            take: take,
            skip: skip
        };
        return this._api.apiCaller("Post", endpoint, Data);
    };
    HttpRequestService.prototype._NodeSaveCustomSymbols = function (JsonExternalIcons) {
        var endpoint = this._api._NodeSaveCustomSymbols;
        return this._api.apiCaller('Post', endpoint, JsonExternalIcons);
    };
    HttpRequestService.prototype._NodeDeleteExternalSysmbols = function (UserId, filename, ID) {
        var endpoint = this._api._NodeDeleteExternalSysmbols;
        var DeleteExternalSysmbols = endpoint + "?UserId=" + UserId + "&filename=" + filename + "&IconID=" + ID;
        return this._api.apiCaller('GET', DeleteExternalSysmbols);
    };
    // Base Map Apis
    HttpRequestService.prototype._NodeGetBaseMapTypes = function (UserId) {
        var endpoint = this._api._NodegetBaseMap + "?UserId=" + UserId;
        return this._api.apiCaller('GET', endpoint);
    };
    HttpRequestService.prototype._NodeInsertBaseMapLogs = function (BaseMapData, CurrentMapSettings, UserId) {
        var data = {
            BaseMapData: BaseMapData,
            Mapsetting: CurrentMapSettings,
            UserId: UserId
        };
        var endpoint = this._api._NodeInsertBaseMapLogs;
        return this._api.apiCaller('POST', endpoint, data);
    };
    HttpRequestService.prototype._NodeSendLayerFeedback = function (feedbackData) {
        var endpoint = this._api._NodeSendFeedbackData;
        return this._api.apiCaller('POST', endpoint, feedbackData);
    };
    /**** My Profile  */
    HttpRequestService.prototype._NodeSaveMapsettings = function (UserId, BaseMapProviderID) {
        var endpoint = this._api._NodeSaveMapSetting + "?UserId=" + UserId + "&BaseMapProviderID=" + BaseMapProviderID;
        return this._api.apiCaller('GET', endpoint, endpoint);
    };
    HttpRequestService.prototype._NodeGetUserDetails = function (UserId) {
        var endpoint = this._api._NodeGetUserDetails + "?UserId=" + UserId;
        return this._api.apiCaller('GET', endpoint);
    };
    HttpRequestService.prototype._NodeChangePassword = function (oldtext, newtext, UserId) {
        var data = {
            oldtext: btoa(oldtext),
            newtext: btoa(newtext),
            UserId: UserId
        };
        var endpoint = this._api._NodeMyProfileChangePassword;
        return this._api.apiCaller('POst', endpoint, data);
    };
    /************ MyMap ************/
    HttpRequestService.prototype._NodeSaveMyMap = function (customMap, energyLayers, privateLayers, defaultCheckedLayers, layerGridFilters, EnergyLayersStylebyuser) {
        if (EnergyLayersStylebyuser === void 0) { EnergyLayersStylebyuser = []; }
        var data = {
            CustomMaps: customMap,
            EnergyLayers: energyLayers,
            DataSets: privateLayers,
            DefaultCheckedLayers: defaultCheckedLayers,
            LayerGridFilters: layerGridFilters,
            EnergyLayersStylebyuser: EnergyLayersStylebyuser
        };
        var endpoint = this._api._NodeSaveMyMap;
        return this._api.apiCaller('Post', endpoint, data);
    };
    HttpRequestService.prototype._NodeCheckMapName = function (mapName) {
        var endpoint = this._api._NodeCheckMapName + "?MapName=" + mapName;
        return this._api.apiCaller('GET', endpoint);
    };
    HttpRequestService.prototype._NodeUpdateMyMap = function (mapId, customMap, energyLayers, privateLayers, defaultCheckedLayers, layerGridFilters) {
        var mapData = {
            CustomMaps: customMap,
            EnergyLayers: energyLayers,
            DataSets: privateLayers,
            DefaultCheckedLayers: defaultCheckedLayers,
            LayerGridFilters: layerGridFilters
        };
        var data = {
            CustomMapId: mapId,
            MapData: mapData
        };
        var endpoint = this._api._NodeUpdateMyMap;
        return this._api.apiCaller('Post', endpoint, data);
    };
    HttpRequestService.prototype._NodeGetMapData = function (mapId) {
        var endpoint = this._api._NodeGetMapData + "?CustomMapId=" + mapId;
        return this._api.apiCaller('GET', endpoint);
    };
    HttpRequestService.prototype._NodeGetGUIDOfDataSets = function (dataSetIds) {
        var endpoint = this._api._NodeGetGUIDByDataSets + "?DataSetIds=" + dataSetIds.toString();
        return this._api.apiCaller('GET', endpoint);
    };
    HttpRequestService.prototype._NodeDeleteMyMap = function (mapId) {
        var endpoint = this._api._NodeDeleteMyMap + "?CustomMapId=" + mapId;
        return this._api.apiCaller('GET', endpoint);
    };
    HttpRequestService.prototype._NodeGetListOfCompnayUserList = function (UserId, MapId) {
        var endpoint = this._api._NodeGetListOfCompnayUserList + "?UserId=" + UserId + "&MapId=" + MapId;
        return this._api.apiCaller('GET', endpoint);
    };
    HttpRequestService.prototype._NodeSaveSharedMymap = function (SaveData) {
        var endpoint = this._api._NodeSaveSharedMymap;
        return this._api.apiCaller('Post', endpoint, SaveData);
    };
    HttpRequestService.prototype._NodeInsertMyMapLogs = function (MyMapData, UserId, userName) {
        var data = {
            MyMapData: MyMapData,
            UserId: UserId,
            UserName: userName
        };
        var endpoint = this._api._NodeInsertMyMapLogs;
        return this._api.apiCaller('POST', endpoint, data);
    };
    /************ Infobox Notes ************/
    HttpRequestService.prototype._NodeSaveInfoboxNotes = function (data) {
        var endpoint = this._api._NodeSaveInfoboxNotes;
        return this._api.apiCaller('Post', endpoint, data);
    };
    HttpRequestService.prototype._NodeUpdateInfoboxNotes = function (data) {
        var endpoint = this._api._NodeUpdateInfoboxNotes;
        return this._api.apiCaller('Post', endpoint, data);
    };
    HttpRequestService.prototype._NodeDeleteInfoboxNotes = function (id) {
        var endpoint = this._api._NodeDeleteInfoboxNotes;
        return this._api.apiCaller('Post', endpoint, id);
    };
    HttpRequestService.prototype._NodeGetInfoboxNotesforLayer = function (item) {
        var endpoint = this._api._NodeGetInfoboxNotesforLayer;
        return this._api.apiCaller('Post', endpoint, item);
    };
    /************ Parcel Buffer Tool APis ************/
    HttpRequestService.prototype.GetLocationFromLatLng = function (data) {
        var endpoint = this._api._NodeGetStatesFromLatLng;
        return this._api.apiCaller('Post', endpoint, data);
    };
    HttpRequestService.prototype.GetLocationFromLineString = function (data) {
        var endpoint = this._api._NodeGetStatesFromLineString;
        return this._api.apiCaller('Post', endpoint, data);
    };
    /************ Shared Data APis ************/
    HttpRequestService.prototype._NodeGetSharedData = function (userId) {
        var endpoint = this._api._NodeGetSharedData + "?UserId=" + userId;
        return this._api.apiCaller('get', endpoint);
    };
    /************ Draw Tools APis ************/
    HttpRequestService.prototype._NodeSaveDrawTools = function (data) {
        var endpoint = this._api._NodeSaveDrawTools;
        return this._api.apiCaller('Post', endpoint, data);
    };
    HttpRequestService.prototype._NodeUpdateDrawTools = function (data) {
        var endpoint = this._api._NodeUpdateDrawTools;
        return this._api.apiCaller('Post', endpoint, data);
    };
    HttpRequestService.prototype._NodeGetDrawTools = function (userId) {
        var endpoint = this._api._NodeGetDrawTools + "?UserId=" + userId;
        return this._api.apiCaller('get', endpoint);
    };
    HttpRequestService.prototype._NodeGetSharedDrawTools = function (userId, customerId) {
        var endpoint = this._api._NodeGetSharedDrawTools + "?UserId=" + userId + "&CustomerId=" + customerId;
        return this._api.apiCaller('get', endpoint);
    };
    HttpRequestService.prototype._NodeGetDrawToolsItems = function (layerId) {
        var endpoint = this._api._NodeGetDrawToolsItems + "?LayerId=" + layerId;
        return this._api.apiCaller('get', endpoint);
    };
    HttpRequestService.prototype._NodeDeleteDrawTools = function (layerId) {
        var endpoint = this._api._NodeDeleteDrawTool + "?LayerId=" + layerId;
        return this._api.apiCaller('get', endpoint);
    };
    HttpRequestService.prototype._NodeDeleteSharedDrawTools = function (data) {
        var endpoint = this._api._NodeDeleteSharedDrawTool;
        return this._api.apiCaller('Post', endpoint, data);
    };
    HttpRequestService.prototype._NodeDeleteDrawToolsItem = function (itemId) {
        var endpoint = this._api._NodeDeleteDrawToolItem + "?DrawItemId=" + itemId;
        return this._api.apiCaller('get', endpoint);
    };
    /************ Site selection APis ************/
    HttpRequestService.prototype._NodeGetSiteSelectionProperties = function (tableName) {
        var endpoint = this._api._NodeGetSiteSelectionProperties + "?TableName=" + tableName;
        return this._api.apiCaller("GET", endpoint);
    };
    HttpRequestService.prototype._NodeGetEnergyLayersIDS = function (tableNames) {
        var data = {
            TableNames: tableNames
        };
        var endpoint = this._api._NodeGetEnergyLayersIDS;
        return this._api.apiCaller('Post', endpoint, data);
    };
    HttpRequestService.prototype._NodeInsertSiteSelectionLogs = function (siteSelectionFilterData, UserId) {
        var data = {
            SiteSelectionFilterData: siteSelectionFilterData,
            UserId: UserId
        };
        var endpoint = this._api._NodeInsertSiteSelectionLogs;
        return this._api.apiCaller('POST', endpoint, data);
    };
    HttpRequestService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http,
            api_service_1.ApiService])
    ], HttpRequestService);
    return HttpRequestService;
}());
exports.HttpRequestService = HttpRequestService;
//# sourceMappingURL=all-http-request.service.js.map