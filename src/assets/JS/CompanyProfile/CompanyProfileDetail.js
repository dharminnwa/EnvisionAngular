﻿var Type;
var Url;
var Data;
var ContentType;
var DataType;
var ProcessData;
var Recentcompanies = $("<li>");
var divHeight = 3000;
var interval = null;
var geocoderProfile;
var mapB;
var infowindowProfile;
var markerProfile;
var lat;
var lng;
var txt_lat;
var txt_long;
var flag = 0;
var suggestionInterval = null;
var EntitiesArray = [{ "Fac Own": "Facility Owner", "Fac Opr": "Facility Operator", "Sys Own": "System Owner", "Sys Opr": "System Operator", "PL Own": "Pipeline Owner", "PL Opr": "Pipeline Operator", "Trans Own": "Transmission Owner" }];
var jsonSuggestionData = null;
var fullCompanyList = null;
var RequestFrom;
var CompanyProfileTestData;
var CompanyProfile_TestTabClicked = false;
var mapCI = {};
var mapPA = {};
var mapTP = {};
// var AmazonAPiURL = 'https://avp8hf6otb.execute-api.us-east-1.amazonaws.com/Prod';
var AmazonAPiURL = 'https://nqzkggqnbb.execute-api.us-east-1.amazonaws.com/Prod';
AmazonAPiURL = "https://node.envisionmaps.net";
$(window).load(function () {
    $(".tabs.tabs-inline.tabs-left > li > a").click(function (e) {
        e.preventDefault();
        goToByScroll($(this).attr("id"));
    });
    // Run code
    var qs = getQueryStrings();
    var id = 0;
    if (qs) {
        id = qs["t"];
    }
    if (id) {
        showCompanyDataModalTest(id)
        //resizePrjPopupHeightTest();
    }
    else {
        // CompanyProfileViewGirdTest_clearDetail();
        //showCompanyDataModalTest(0)
        hidePageLoadingTest();
    }
    resizePrjPopupHeightTest();
});

function getQueryStrings() {
    var assoc = {};
    var decode = function (s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
    var queryString = location.search.substring(1);
    var keyValues = queryString.split('&');

    for (var i in keyValues) {
        var key = keyValues[i].split('=');
        if (key.length > 1) {
            assoc[decode(key[0])] = decode(key[1]);
        }
    }

    return assoc;
}

function showPageLoadingTest() { $("#mainProjDataloader").show(); }

function hidePageLoadingTest() { $("#mainProjDataloader").hide(); }

function resizePrjPopupHeightTest() {
    var popupHeight = parseInt($(".modalProjectData ").css('height').replace("px"));
    var header = parseInt($("#headerContent").css('height').replace("px"));
    if (popupHeight > 0 && header > 0) {
        var bodyMaxHeight = popupHeight - 50;
        if (bodyMaxHeight < 150) {
            bodyMaxHeight = 150;
        }
        var diff = bodyMaxHeight - header;
        if (diff < 100) {
            diff = 100;
        }
        $(".ProjectDataContent").css('max-height', diff);
        $(".ProjectDataContent").css('overflow', "auto");
        $("#modal-bodyProjects").css('max-height', bodyMaxHeight);

        var ActualBodyHeight = $("#modal-bodyProjects").height()
        if (ActualBodyHeight < bodyMaxHeight) {
            $("#modal-ProjectjData").css('height', ActualBodyHeight + 50);
        }
    }
}
// Company Profile Page Code Start
function showCompanyDataModalTest(CompanyID) {

    CompanyID = parseInt(CompanyID);
    showPageLoadingTest();
    $.ajax({
        // url: AmazonAPiURL+'/api/CompanyProfile/GetProjectDataById',
        url: AmazonAPiURL + "/api/CompanyProfile/GetResult",
        type: 'GET',
        data: { id: CompanyID, type: "CompanyProfile" }, //Data sent to server        
        success: function (data) {//On Successfull service call            
            try {                
                CompanyProfileViewGirdTest_clearDetail();
                var Company = JSON.parse(data.GetTempCompanyProfileByIdResult);
                var companyProfile = JSON.parse(Company.CompanyProfile == "null" ? "[]" : Company.CompanyProfile);
                var companyContact = JSON.parse(Company.CompanyContact == "null" ? "[]" : Company.CompanyContact);
                var companyOwner = JSON.parse(Company.CompanyOwner == "null" ? "[]" : Company.CompanyOwner);
                var companyOperator = JSON.parse(Company.CompanySubsidry == "null" ? "[]" : Company.CompanySubsidry);
                var companyFacOwner = JSON.parse(Company.CompanyFacOwner == "null" ? "[]" : Company.CompanyFacOwner);
                var companyFacOperator = JSON.parse(Company.CompanyFacOperator == "null" ? "[]" : Company.CompanyFacOperator);
                var companySysOwner = JSON.parse(Company.CompanySysOwner == "null" ? "[]" : Company.CompanySysOwner);
                var companySysOperator = JSON.parse(Company.CompanySysOperator == "null" ? "[]" : Company.CompanySysOperator);
                var companyPowerOwner = JSON.parse(Company.CompanyPowerOwner == "null" ? "[]" : Company.CompanyPowerOwner);
                var companyPowerOperator = JSON.parse(Company.CompanyPowerOperator == "null" ? "[]" : Company.CompanyPowerOperator);
                var companyTransOwner = JSON.parse(Company.CompanyTransOwner == "null" ? "[]" : Company.CompanyTransOwner);
                var companyTransOperated = JSON.parse(Company.CompanyTransOperated == "null" ? "[]" : Company.CompanyTransOperated);
                var companyIndsOwner = JSON.parse(Company.CompanyIndsOwner == "null" ? "[]" : Company.CompanyIndsOwner);
                var companyDocuments = JSON.parse(Company.CompanyDocuments == "null" ? "[]" : Company.CompanyDocuments);

                //Company Information
                // var sessionCompName = companyProfile["CompanyName"];
                // var companyID = companyProfile["CompanyID"];

                CompanyProfileViewTest_setCompanyInformation(companyProfile);
                // Owner/Subsidiary
                var OwnerTr = "companyOwnerAccordion";
                var OperatorTr = "companyOperatorAccordion";
                if (companyOwner != null && companyOwner.length > 0) {
                    for (var i = 0; i < companyOwner.length; i++) {
                        $('#companyOwnerAccordion').append(CompanyProfileViewTest_getHtmlFromObjectCompanyOwner(companyOwner[i], OwnerTr, "compOwner"));
                    }
                    $("#CompanyOwnerSection").css("display", "block");
                    $("#companycompownertab").css("display", "block");
                    $("#li_CompanyOwenerandSubsidiariesSection").css("display", "block");
                }
                if (companyOperator != null && companyOperator.length > 0) {
                    for (var i = 0; i < companyOperator.length; i++) {
                        $('#companyOperatorAccordion').append(CompanyProfileViewTest_getHtmlFromObjectCompanyOwner(companyOperator[i], OperatorTr, "compOperator"));
                    }
                    $("#CompanySubsidiariesSection").css("display", "block");
                    $("#companycompownertab").css("display", "block");
                    $("#li_CompanyOwenerandSubsidiariesSection").css("display", "block");
                }
                companyOwner = null;
                companyOperator = null;

                //Facilities
                var FacOwnerTR = "facilityOwnerAccordion";
                if (companyFacOwner != null && companyFacOwner.length > 0) {
                    for (var i = 0; i < companyFacOwner.length; i++) {
                        $('#facilityOwnerAccordion').append(CompanyProfileViewTest_getHtmlFromObjectFacOwner(companyFacOwner[i], FacOwnerTR, "facOwner"));
                    }
                    $("#FacilitiesOwnedSection").css("display", "block");
                    $("#companyfacownertab").css("display", "block");
                    $("#li_Facilities").css("display", "block");
                }
                var FacOperatorTr = "facilityOperatorAccordion";
                if (companyFacOperator != null && companyFacOperator.length > 0) {
                    for (var i = 0; i < companyFacOperator.length; i++) {
                        $('#facilityOperatorAccordion').append(CompanyProfileViewTest_getHtmlFromObjectFacOwner(companyFacOperator[i], FacOperatorTr, "facOperator"));
                    }
                    $("#FacilitiesOperatorSection").css("display", "block");
                    $("#companyfacownertab").css("display", "block");
                    $("#li_Facilities").css("display", "block");
                }
                companyFacOwner = null;
                companyFacOperator = null;

                //Pipeline Systems
                var SysOwnerTr = "systemOwnerAccordion";
                if (companySysOwner != null && companySysOwner.length > 0) {
                    for (var i = 0; i < companySysOwner.length; i++) {
                        $('#systemOwnerAccordion').append(getHtmlFromObjectSysOwner(companySysOwner[i], SysOwnerTr, "sysOwner"));

                    }
                    $("#PipelineSystemsOwnedSection").css("display", "block");
                    $("#companysysownertab").css("display", "block");
                    $("#li_PipelineSystems").css("display", "block");
                }
                var SysOperatorTr = "systemOperatorAccordion";
                if (companySysOperator != null && companySysOperator.length > 0) {
                    for (var i = 0; i < companySysOperator.length; i++) {
                        $('#systemOperatorAccordion').append(getHtmlFromObjectSysOwner(companySysOperator[i], SysOperatorTr, "sysOperator"));
                    }
                    $("#PipelineSystemsOperatedSection").css("display", "block");
                    $("#companysysownertab").css("display", "block");
                    $("#li_PipelineSystems").css("display", "block");
                }
                companySysOwner = null;
                companySysOperator = null;

                //Power Plants
                var PowerOwnerTr = "powerOwnerAccordion";
                if (companyPowerOwner != null && companyPowerOwner.length > 0) {
                    for (var i = 0; i < companyPowerOwner.length; i++) {
                        $('#powerOwnerAccordion').append(getHtmlFromObjectPowerOwner(companyPowerOwner[i], PowerOwnerTr, "powOwner"));
                    }
                    $("#PowerPlantsOwnedSection").css("display", "block");
                    $("#companypowerownertab").css("display", "block");
                    $("#li_PowerPlants").css("display", "block");
                }

                var PowerOperTr = "powerOperatorAccordion";
                if (companyPowerOperator != null && companyPowerOperator.length > 0) {
                    for (var i = 0; i < companyPowerOperator.length; i++) {
                        $('#powerOperatorAccordion').append(getHtmlFromObjectPowerOwner(companyPowerOperator[i], PowerOperTr, "powOperator"));
                    }
                    $("#PowerPlantsOperatedSection").css("display", "block");
                    $("#companypowerownertab").css("display", "block");
                    $("#li_PowerPlants").css("display", "block");
                }
                companyPowerOwner = null;
                companyPowerOperator = null;

                //Transmission Projects
                var TransOnwerTr = "transmissionAccordion";
                if (companyTransOwner != null && companyTransOwner.length > 0) {
                    for (var i = 0; i < companyTransOwner.length; i++) {
                        $('#transmissionAccordion').append(getHtmlFromObjectTransmission(companyTransOwner[i], TransOnwerTr, "transmission"));
                    }
                    $("#TransmissionProjectsOwnedSection").css("display", "block");
                    $("#companytransmissiontab").css("display", "block");
                    $("#li_TransmissionProjects").css("display", "block");
                }
                companyTransOwner = null;

                var TransOnwerTr = "transmissionOperatorAccordion";
                if (companyTransOperated != null && companyTransOperated.length > 0) {
                    for (var i = 0; i < companyTransOperated.length; i++) {
                        $('#transmissionOperatorAccordion').append(getHtmlFromobjectTransmissionOperated(companyTransOperated[i], TransOnwerTr, "transmissionOperated"));
                    }
                    $("#TransmissionProjectsOperatedSection").css("display", "block");
                    $("#companytransmissiontab").css("display", "block");
                    $("#li_TransmissionProjects").css("display", "block");
                }
                companyTransOperated = null;

                //Industry Updates
                var IndsOwnerTr = "industryAccordion";
                if (companyIndsOwner != null && companyIndsOwner.length > 0) {
                    for (var i = 0; i < companyIndsOwner.length; i++) {
                        $('#industryAccordion').append(getHtmlFromObjectIndustry(companyIndsOwner[i], IndsOwnerTr, "industry"));
                    }
                    $("#companyindustrytab").css("display", "block");
                    $("#li_IndustryUpdates").css("display", "block");
                }
                companyIndsOwner = null;

                // Document
                var CompanyDocsTr = "documentAccordion";
                if (companyDocuments != null && companyDocuments.length > 0) {
                    for (x in companyDocuments) {
                        $('#documentAccordion').append(getHtmlFromObjectDocument(companyDocuments[x], CompanyDocsTr, "documents"));
                    }
                    $("#companyDocumentTab").css("display", "block");
                    $("#li_Documents").css("display", "block");
                }
                companyDocuments = null;

                // Contact
                if (companyContact != null && companyContact.length > 0) {
                    for (var i = 0; i < companyContact.length; i++) {
                        $('#contactsAccordion').append(getHtmlFromObjectContact(companyContact[i]));
                    }
                    $("#companycontacttab").css("display", "block");
                    $("#li_Contacts").css("display", "block");
                }
                companyContact = null;

                //$.ajax({
                //    type: "POST",
                //    url:  "/CompanyProfile/StroeRecentCompany",
                //    cache: true,
                //    data: { 'id': companyID, 'name': sessionCompName },
                //    async: false,
                //    success: function (data) {
                //    },
                //});
                $("#1link").click();
                $("#companymaintab").animate({ scrollTop: parseFloat(0) }, 'slow');

                // var data = JSON.parse(response);
                var html = '';//'<div id="headerContent"></div>'

                html = html + '<div id="main" style="margin-left: 0px;"><div class="row-fluid">' +
                    '<div class="span12"><div class="box box-bordered box-color">' +
                    '<div id="favoriteModal" class="modal favoriteMainDiv hide fade"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">× </button><h4 id="myModalLabel" style="color: #16ABA9;">Favorite Companies</h4>' +
                    '</div><div id="favModelBody" class="modal-body"></div><div class="modal-footer"><button class="btn btnClose" data-dismiss="modal" aria-hidden="true">Close</button></div></div>' +
                    '<div class="box-content nopadding " id="companyprofilebox">' +
                    '<div class="tabs-container"><ul class="tabs tabs-inline tabs-left"><li class="active" style=" float: left; "><a href="#mainTab" id="1link" data-toggle="tab">Main</a></li>' +
                    '<li style=" float: left; " ><a href="#" id="2link" data-toggle="tab">Owner/Subsidiary</a></li><li style=" float: left; "><a href="#" id="3link" data-toggle="tab">Facility</a></li><li style=" float: left; "><a href="#" id="4link" data-toggle="tab">Systems</a></li>' +
                    '<li style=" float: left; "><a href="#" id="5link" data-toggle="tab">Power Plants</a></li><li style=" float: left; "><a href="#" id="6link" data-toggle="tab">Transmission Projects</a></li>' +
                    '<li style=" float: left; "><a href="#" id="7link" data-toggle="tab">Industry Updates</a></li><li style=" float: left; "><a href="#" id="8link" data-toggle="tab">Contacts</a></li>' +
                    '<li style=" float: left; "><a href="#" id="9link" data-toggle="tab">Documents</a></li></ul></div>' +
                    '<div class="tab-content padding tab-content-inline" id="box"><div class="tab-pane active" id="mainTab" style="overflow-y: auto !important;"><div class="accordion" id="accordion3">' +
                    '<div class="accordion-group"><div class="accordion-heading" style="height: 36px; background-color: #f6f6f6 !important;"><span style="float: left;"><a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion3" href="#collapseOne2">Company Profile</a>' +
                    '</span><span style="float: right;"></span></div><div style="clear: both"></div>' +
                    '<div id="collapseOne2" class="accordion-body collapse in"><div class="accordion-inner" id="companymaintab" style="overflow-y: auto !important;"><div id="container"><h3><span id="companyName"></span></h3>' +
                    '<table><thead><tr><th width="300" style="text-align: left;">Physical Address</th><th width="300" style="text-align: left;">Mailing Address</th><th width="300" style="text-align: left;">Contact Information</th></tr>' +
                    '<tr><td id="tdPhysicalAddress" valign="top"><span id="phyAdd1" style="clear: both; float: left;"></span><span id="phyAdd2" style="clear: both; float: left;"></span><span id="phyCity" style="clear: both; float: left;"></span><span id="phyState" style="clear: both; float: left;"></span>' +
                    '<span id="phyZip" style="clear: both; float: left;"></span><span id="phyCountry" style="clear: both; float: left;"></span></td>' +
                    '<td id="tdMailingAddress" valign="top"><span id="mailAdd1" style="clear: both; float: left;"></span><span id="mailAdd2" style="clear: both; float: left;"></span><span id="mailCity" style="clear: both; float: left;"></span><span id="mailState" style="clear: both; float: left;"></span><span id="mailZip" style="clear: both; float: left;"></span><span id="mailCountry" style="clear: both; float: left;"></span></td>' +
                    '<td valign="top">Contact Name : <span id="contactname"></span><br />Phone : <span id="phone"></span><br />Fax : <span id="fax"></span><br />Email : <span id="email"></span><br />Web : <a id="companyWebUrl" href="#" target="_blank"><span id="web"></span></a><br /></td></tr></thead></table>' +
                    '<table><thead><tr><th style="text-align: left;">Company Details</th></tr><tr><td class="TdAlign">Business Lines</td><td>:&nbsp;&nbsp;<span id="businessLine"></span></td></tr><tr><td class="TdAlign">Commodities</td><td>:&nbsp;&nbsp;<span id="commodities"></span></td></tr>' +
                    '<tr><td class="TdAlign">Entities</td><td>:&nbsp;&nbsp;<span id="entities"></span></td></tr><tr><td class="TdAlign">Entity Type</td><td>:&nbsp;&nbsp;<span id="entityType"></span></td></tr></thead></table></div>' +
                    '<div id="companycompownertab"><h4>Owner/Subsidiary</h4><h6>Company Owner :</h6><table width="100%" cellpadding="0" cellspacing="0" class="table table-hover table-nomargin" id="ownerTable"><thead><tr><th width="39%">Company Name</th><th>Percentage</th></tr></thead></table>' +
                    '<div class="row-fluid"><div class="span12"><div id="companyOwnerAccordion" class="accordion accordion-widget"></div></div></div><h6>Subsidiaries :</h6>' +
                    '<table width="100%" cellpadding="0" cellspacing="0" class="table table-hover table-nomargin" id="operatorTable"><thead><tr><th width="39%">Name</th><th>Percentage</th></tr></thead></table>' +
                    '<div class="row-fluid"><div class="span12"><div id="companyOperatorAccordion" class="accordion accordion-widget"></div></div></div></div>' +
                    '<div id="companyfacownertab"><h4>Facilities</h4><h6>Owned :</h6><table width="100%" cellpadding="0" cellspacing="0" class="table table-hover table-nomargin" id="facilityOwner"><thead style="background-color: black"><tr><th width="39%">Name</th><th>Percentage</th><th width="30%">Facility Type</th></tr></thead></table>' +
                    '<div class="row-fluid"><div class="span12"><div id="facilityOwnerAccordion" class="accordion accordion-widget"></div><div id="map_canvas_plus"></div></div></div>' +
                    '<h6>Operated :</h6><table class="table table-hover table-nomargin" id="facilityOperator"><thead><tr><th width="39%">Name</th><th></th><th width="30%">Facility Type</th></tr></thead></table>' +
                    '<div class="row-fluid"><div class="span12"><div id="facilityOperatorAccordion" class="accordion accordion-widget"></div></div></div></div>' +
                    '<div id="companysysownertab"><h4>Systems</h4><h6>Owned :</h6><table class="table table-hover table-nomargin" id="systemOwner"><thead><tr><th width="40%">Name</th><th width="30%">Percentage</th><th width="30%">Commodity</th></tr></thead></table>' +
                    '<div class="row-fluid"><div class="span12"><div id="systemOwnerAccordion" class="accordion accordion-widget"></div></div></div>' +
                    '<h6>Operated :</h6><table class="table table-hover table-nomargin" id="systemOperator"><thead><tr><th width="40%">Name</th><th width="30%"></th><th width="30%">Commodity</th></tr></thead></table>' +
                    '<div class="row-fluid"><div class="span12"><div id="systemOperatorAccordion" class="accordion accordion-widget"></div></div></div></div>' +
                    '<div id="companypowerownertab"><h4>Power Plants</h4><h6>Owned :</h6><table class="table table-hover table-nomargin" id="powerOwner"><thead><tr><th width="39%">Name</th><th>Percentage</th></tr></thead></table>' +
                    '<div class="row-fluid"><div class="span12"><div id="powerOwnerAccordion" class="accordion accordion-widget"></div><div id="map_canvas_plus"></div></div></div>' +
                    '<h6>Operated :</h6><table class="table table-hover table-nomargin" id="powerOperator"><thead><tr><th>Name</th></tr></thead></table>' +
                    '<div class="row-fluid"><div class="span12"><div id="powerOperatorAccordion" class="accordion accordion-widget"></div></div></div></div>' +
                    '<div id="companytransmissiontab"><h4>Transmission Projects</h4><table class="table table-hover table-nomargin" id="transOwner"><thead><tr><th width="430">Name</th></tr></thead></table>' +
                    '<div class="row-fluid"><div class="span12"><div id="transmissionAccordion" class="accordion accordion-widget"></div></div></div></div>' +
                    '<div id="companyindustrytab"><h4>Industry Updates</h4><table class="table table-hover table-nomargin" id="idustryOwner"><thead><tr><th>Name</th></tr></thead></table>' +
                    '<div class="row-fluid"><div class="span12"><div id="industryAccordion" class="accordion accordion-widget"></div></div></div></div>' +
                    '<div id="companycontacttab"><h4>Contacts</h4><table width="100%" cellpadding="0" cellspacing="0" class="table table-hover table-nomargin" id="contactTable"><thead><tr><th width="30%">Name</th><th width="35%">Department</th><th width="30%">Title</th></tr></thead></table>' +
                    '<div class="row-fluid"><div class="span12"><div id="contactsAccordion" class="accordion accordion-widget"></div></div></div></div>' +
                    '<div id="companyDocumentTab"><h4>Documents</h4><table class="table table-hover table-nomargin" id="companyDocs"><thead><tr><th>Name</th></tr></thead></table>' +
                    '<div class="row-fluid"><div class="span12"><div id="documentAccordion" class="accordion accordion-widget"></div></div></div></div></div></div></div></div></div></div>' +
                    '</div>' +
                    '</div></div>' +
                    '</div></div>'
                //$("#modal-CompanyData").css('height', '');
                ////$("#modal-CompanyData").css('width', '90%');
                ////$("#modal-CompanyData").css('left', '5%');
                //$("#modal-CompanyData").css('top', '4%');
                //$("#modal-CompanyData").on('show', function () {
                //    $(this).addClass("modalProjectData");
                //    resizePrjPopupHeightTest();

                //});
                ////$("#modal-bodyCompany").css('overflow', 'auto');
                ////$("#modal-bodyCompany").css('max-height', '100%');
                //$("#modal-CompanyData").on('shown.bs.modal', function () {
                //    $(this).addClass("modalProjectData");
                //    // resizePrjPopupHeightTest();
                //})
                //$("#modal-CompanyData").on('hidden.bs.modal', function () {
                //    //$(this).removeClass("modalProjectData");
                //})

                //// $("#modal-bodyCompany").html(html);
                //$("#modal-CompanyData").modal('show');
                //setTimeout(function () { $("#modal-CompanyData").scrollTop(0) }, 250);
                //hidePageLoadingTest();
                // $("#mainLoader").hide();
                //$("#txtSearch").val("");
                hidePageLoadingTest();
            }
            catch (err) {
                hidePageLoadingTest();
            }
        },
        error: function (data) {
            hidePageLoadingTest();
            alert('Fail');
        },
        abort: function (data) {
            hidePageLoadingTest();
        },
        notmodified: function (data) {
            hidePageLoadingTest();
        },
        timeout: function (data) {
            hidePageLoadingTest();
        },
        parsererror: function (data) {
            hidePageLoadingTest();
        }
    });
}
function resizeProjectNameWindows() {
    $(window).resize(function () {
        $('#modal-ProjectNameData').height($(window).height() - 100);
        var headerheight = $('#modal-CompanyData').height();
        headerheight = headerheight - 60;
        $('#modal-bodyProjectNameData').css('max-height', headerheight);
    });

    $(window).trigger('resize');
}
function CompanyProfileViewTest_setWindowHeights() {
    var h = $(window).height() - $("#box").offset().top;
    var home = $(window).height();
    var substract = parseInt(h) - 45;
    var sum = parseInt(home) * 0.90;
    $("#box").height('auto');

    var companymaintab = $("#box").height();

    $("#companymaintab").height('auto');
    //  $("#companycontacttab").height(companymaintab - 60);
    //  $("#companytransmissiontab").height(companymaintab - 60);
    //  $("#companyindustrytab").height(companymaintab - 60);
    // $("#companycompownertab").height(companymaintab - 95);
    // $("#companycompopertab").height(companymaintab - 95);
    // $("#companyfacownertab").height(companymaintab - 95);
    // $("#companyfacopertab").height(companymaintab - 95);
    //  $("#companysysownertab").height(companymaintab - 95);
    //$("#companysysopertab").height(companymaintab - 95);
    //  $("#companypowerownertab").height(companymaintab - 95);
    //  $("#companypoweroperatortab").height(companymaintab - 95);
}

function resizePrjPopupHeightTest() {
    $(window).resize(function () {
        $('#modal-CompanyData').height($(window).height() - 100);
        var headerheight = $('#modal-CompanyData').height();
        headerheight = headerheight - 0;
        $('#modal-bodyCompany').css('max-height', headerheight);
    });

    $(window).trigger('resize');

    //var popupHeight = parseInt($(".modalProjectData ").css('height').replace("px"));
    //var header = parseInt($("#modal-CompanyData").css('height').replace("px"));
    //if (popupHeight > 0 && header > 0) {
    //    var bodyMaxHeight = popupHeight - 50;
    //    if (bodyMaxHeight < 150) {
    //        bodyMaxHeight = 150;
    //    }
    //    var diff = bodyMaxHeight - header;
    //    if (diff < 100) {
    //        diff = 100;
    //    }
    //    //$(".ProjectDataContent").css('max-height', diff);
    //    //$(".ProjectDataContent").css('overflow', "auto");
    //    //$("#modal-bodyProjects").css('max-height', bodyMaxHeight);

    //    var ActualBodyHeight = $("#modal-bodyCompany").height()
    //    if (ActualBodyHeight < bodyMaxHeight) {
    //        //$("#modal-CompanyData").css('height', ActualBodyHeight + 50);
    //    }
    //}
}

function CompanyProfileViewGirdTest_clearDetail() {

    $("#contactname").html("");
    $("#phone").html("");
    $("#fax").html("");
    $("#email").html("");
    $("#web").html("");
    $("#companyName").html("");

    $("#businessLine").html("");
    $("#commodities").html("");
    $("#entities").html("");
    $("#entityType").html("");

    $('#companyNameMain').html("");
    $('#phyAdd1').html("");
    $('#phyAdd2').html("");
    $('#phyCity').html("");
    $('#phyState').html("");
    $('#phyZip').html("");
    $('#phyCountry').html("");

    $('#mailAdd1').html("");
    $('#mailAdd2').html("");
    $('#mailCity').html("");
    $('#mailState').html("");
    $('#mailZip').html("");
    $('#mailCountry').html("");

    $('#contactTable tbody').html("");
    $('#ownerTable tbody').html("");
    $('#operatorTable tbody').html("");
    $('#facilityOwner tbody').html("");
    $('#facilityOperator tbody').html("");
    $('#systemOwner tbody').html("");
    $('#systemOperator tbody').html("");
    $('#powerOwner tbody').html("");
    $('#powerOperator tbody').html("");
    $('#transOwner tbody').html("");
    $('#transOperator tbody').html("");
    $('#idustryOwner tbody').html("");

    $('#companyOwnerAccordion').html("");
    $('#companyOperatorAccordion').html("");
    $('#contactsAccordion').html("");
    $('#facilityOwnerAccordion').html("");
    $('#facilityOperatorAccordion').html("");
    $('#systemOwnerAccordion').html("");
    $('#systemOperatorAccordion').html("");
    $('#powerOwnerAccordion').html("");
    $('#powerOperatorAccordion').html("");
    $('#transmissionAccordion').html("");
    $('#transmissionOperatorAccordion').html("");
    $('#industryAccordion').html("");
    $('#documentAccordion').html("");
}

function getHtmlFromObjectContact(companyContact) {

    var ContactID = companyContact.ContactID == null ? "" : companyContact.ContactID;
    var coName = companyContact.ContactName == null ? "" : companyContact.ContactName;
    var Department = companyContact.Department == null ? "" : companyContact.Department;
    var Title = companyContact.Title == null ? "" : companyContact.Title;

    var Contactdiv = '<div class="accordion-group" style="border:1.5px solid #EEEEEE !important;">' +
        '<div class="accordion-heading">' +
        '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
        '<tr>' +
        '<td width="30%">' +
        '<a href="#con' + ContactID + '" onclick="SearchContact(' + ContactID + ',this);" data-parent="#contactsAccordion" data-toggle="collapse" class="accordion-toggle collapsed" style="padding: 0px 0px 0px 0px !important; color: #368EE0!important; font-size: 13px !important; background: white !important;">' + coName + '</a>' +
        '</td>' +
        '<td width="35%">' + Department + '</td>' +
        '<td width="30%">' + Title + '</td>' +
        '</tr>' +
        '</table>' +
        '</div>' +
        '<div class="accordion-body collapse" id="con' + ContactID + '" style="height: 0px;">' +
        '<div class="accordion-inner" style="border-top: 1px solid #E5E5E5 !important;">' +
        '<h3><span id="contactName' + ContactID + '"></span></h3>' +
        '<table>' +
        '<thead>' +
        '<tr>' +
        '<th width="300" id="detailsheader' + ContactID + '" style="text-align: left;"></th>' +
        '<th width="300" id="physicalheader' + ContactID + '" style="text-align: left;"></th>' +
        '<th width="300" id="mailheader' + ContactID + '" style="text-align: left;"></th>' +
        '</tr>' +
        ' <tr>' +
        '<td id="contactDetails' + ContactID + '" valign="top"></td>' +
        '<td id="contactPhysicalAddress' + ContactID + '" valign="top"></td>' +
        '<td id="contactMailingAddress' + ContactID + '" valign="top"></td>' +
        '</tr>' +
        '</thead>' +
        '</table>' +
        '<table>' +
        '<thead>' +
        '<tr>' +
        '<th id="contactInfoheader' + ContactID + '" width="300" style="text-align: left;"></th>' +
        '</tr>' +
        '<tr>' +
        '<td id="contactInformation' + ContactID + '" valign="top"></td>' +
        '</tr>' +
        '</thead>' +
        '</table>' +
        '</div>' +
        '</div>' +
        '</div>';
    return $(Contactdiv);

}

function SearchContact(ContactID, currentanchor) {

    if (ContactID != '' && ContactID !== undefined) {
        if ($(currentanchor).hasClass("collapsed")) {
            $("#mainLoader").show();
            $.ajax({
                type: "GET",
                url: AmazonAPiURL + "/api/CompanyProfile/GetResult",
                //url: "/CompanyProfile/GetResult",
                data: { id: ContactID, type: "Contact" },
                //dataType: "json",
                cache: true,
                success: function (data) {
                    try {

                        //var jsondata = JSON.parse(JSON.stringify(data));
                        //  var jsondata = JSON.parse(data);
                        var Contact = JSON.parse(data.GetCompanyProfileContactByIdResult);
                        //console.log(Contact);
                        $('#contactDetails' + ContactID).html("");
                        $('#contactPhysicalAddress' + ContactID).html("");
                        $('#contactMailingAddress' + ContactID).html("");
                        $("#contactInformation" + ContactID).html("");

                        //Contact Details
                        var mr = Contact.Mr_Ms;
                        var fname = Contact.FirstName;
                        var lname = Contact.LastName;
                        var title = Contact.Title;
                        var dept = Contact.Department;
                        var ContactName = "";

                        var contactDetails = $("#contactDetails" + ContactID);
                        //contactDetails.append("<span><b>Details</b></span><br/>")
                        $("#detailsheader" + ContactID).html("Details");
                        if (mr != null && mr != "") {
                            contactDetails.append("<span>" + mr + " " + "</span>");
                            ContactName = mr;
                        }
                        if (fname != null && fname != "") {
                            contactDetails.append("<span>" + fname + " " + "</span>");
                            if (ContactName != "") {
                                ContactName = ContactName + " " + fname;
                            }
                            else {
                                ContactName = fname;
                            }
                        }
                        if (lname != null && lname != "") {
                            contactDetails.append("<span>" + lname + "</span><br />");
                            if (ContactName != "") {
                                ContactName = ContactName + " " + lname;
                            }
                            else {
                                ContactName = lname;
                            }
                        }
                        if (title != null && title != "")
                            contactDetails.append("<span>" + title + "</span><br />");
                        if (dept != null && dept != "")
                            contactDetails.append("<span>" + dept + "</span>");

                        $("#contactName" + ContactID).html(ContactName);
                        //Physical Information
                        var phyadd1 = Contact.PhyAddress;
                        var phyadd2 = Contact.PhysicalAddress2;
                        var phycountry = Contact.PhyCountry;
                        var phystate = Contact.PhyState;
                        var phycity = Contact.PhyCity;
                        var phyzip = Contact.PhyZip;

                        var contactPhysicalAddress = $("#contactPhysicalAddress" + ContactID);
                        $("#physicalheader" + ContactID).html("Physical Address");
                        if (phyadd1 != null && phyadd1 != "")
                            contactPhysicalAddress.append("<span>" + phyadd1 + "</span><br />");
                        if (phyadd2 != null && phyadd2 != "")
                            contactPhysicalAddress.append("<span>" + phyadd2 + "</span><br />");
                        if (phycountry != null && phycountry != "")
                            contactPhysicalAddress.append("<span>" + phycountry + "</span><br />");
                        if (phycity != null && phycity != "")
                            contactPhysicalAddress.append("<span>" + phycity + "</span><br />");
                        if (phystate != null && phystate != "")
                            contactPhysicalAddress.append("<span>" + phystate + "</span><br />");
                        if (phyzip != null && phyzip != "")
                            contactPhysicalAddress.append("<span>" + phyzip + "</span>");

                        //Mailing Information
                        var mailadd1 = Contact.MailingAddress;
                        var mailadd2 = Contact.MailingAddress2;
                        var mailcountry = Contact.MailingCountry;
                        var mailstate = Contact.MailingState;
                        var mailcity = Contact.MailingCity;
                        var mailzip = Contact.MailingZip;

                        var contactMailingAddress = $("#contactMailingAddress" + ContactID);
                        $("#mailheader" + ContactID).html("Mailing Address");
                        if (mailadd1 != null && mailadd1 != "")
                            contactMailingAddress.append("<span>" + mailadd1 + "</span><br />");
                        if (mailadd2 != null && mailadd2 != "")
                            contactMailingAddress.append("<span>" + mailadd2 + "</span><br />");
                        if (mailcountry != null && mailcountry != "")
                            contactMailingAddress.append("<span>" + mailcountry + "</span><br />");
                        if (mailcity != null && mailcity != "")
                            contactMailingAddress.append("<span>" + mailcity + "</span><br />");
                        if (mailstate != null && mailstate != "")
                            contactMailingAddress.append("<span>" + mailstate + "</span><br />");
                        if (mailzip != null && mailzip != "")
                            contactMailingAddress.append("<span>" + mailzip + "</span>");

                        //Contact Information
                        var phone = Contact.Phone;
                        var fax = Contact.Fax;
                        var email = Contact.Email;
                        var web = Contact.Web;
                        var twitter = Contact.Twitter;
                        var linkedin = Contact.LinkedIn;
                        var emergence = Contact.EmergencePhone;

                        var contactInformation = $("#contactInformation" + ContactID);
                        $("#contactInfoheader" + ContactID).html("Contact Information");
                        if (phone != null && phone != "")
                            contactInformation.append("<span>" + phone + "</span><br />");
                        if (fax != null && fax != "")
                            contactInformation.append("<span>" + fax + "</span><br />");
                        if (email != null && email != "")
                            contactInformation.append("<span>" + email + "</span><br />");
                        if (web != null && web != "")
                            contactInformation.append("<span><a target='_blank' href='http://" + web + "'>" + web + "</a></span><br />");
                        if (twitter != null && twitter != "")
                            contactInformation.append("<span>" + twitter + "</span><br />");
                        if (linkedin != null && linkedin != "")
                            contactInformation.append("<span>" + linkedin + "</span>");
                        if (emergence != null && emergence != "")
                            contactInformation.append("<span>" + emergence + "</span>");

                        $("#mainLoader").hide();
                    }
                    catch (err) {
                        $("#mainLoader").hide();
                        $("#txtSearch").val("");
                    }
                },
            });
        }
    }
}
function CompanyProfileViewTest_setCompanyInformation(companyProfile) {

    var companyName = $("#companyName");
    var companyNameMain = $("#companyNameMain");
    var coID = $("#coID");
    var businessLine = $("#businessLine");
    var commodities = $("#commodities");
    var entities = $("#entities");
    var entityTpe = $("#entityType");
    companyName.html(companyProfile["CompanyName"]);
    companyNameMain.html(companyProfile["CompanyName"]);
    // coID.html(companyProfile["CO_ID"]);
    businessLine.html(companyProfile["BusinessLineName"]);
    var commoditiesName = companyProfile["CommodityName"];
    if (commoditiesName) {
        commoditiesName = commoditiesName.replace("Ethl", "Ethanol").replace("Misc", "Miscellaneous").replace("Asph", "Asphalt");
    }
    commodities.html(commoditiesName);
    var entitiesName = companyProfile["EntityName"];
    entities.html(setEntitiesName(entitiesName));
    var entityTypeName = companyProfile["EntityTypeName"];
    if (entityTypeName) {
        entityTypeName = entityTypeName.replace("HoldingCo", "Holding Company");
    }
    entityTpe.html(entityTypeName);
    //Contact Information
    var contactName = $("#contactname");
    var phone = $("#phone");
    var fax = $("#fax");
    var email = $("#email");
    var web = $("#web");
    contactName.html(companyProfile["ContactName"]);
    phone.html(companyProfile["Phone"]);
    fax.html(companyProfile["Fax"]);
    email.html(companyProfile["Email"]);
    web.html(companyProfile["Web"]);
    if ($('#web').text() != undefined) {
        if ($('#web').text().search('http') != -1)
            $('#companyWebUrl').attr('href', $("#web").text());
        else
            $('#companyWebUrl').attr('href', "http://" + $("#web").text());
        //alert($('#companyWebUrl').attr('href'));
    }


    //Physical Information
    var phyAdd1 = companyProfile["PhyAddress1"];
    var phyAdd2 = companyProfile["PhyAddress2"];
    var phyCity = companyProfile["PhyCity"];
    var phyState = companyProfile["PhyState"];
    var phyZip = companyProfile["PhyZip"];
    var phyCountry = companyProfile["PhyCountry"];
    if (phyAdd1 != null && phyAdd1 != "")
        $("#phyAdd1").html(phyAdd1);
    if (phyAdd2 != null && phyAdd2 != "")
        $("#phyAdd2").html(phyAdd2);
    if (phyCity != null && phyCity != "")
        $("#phyCity").html(phyCity);
    if (phyState != null && phyState != "")
        $("#phyState").html(phyState);
    if (phyZip != null && phyZip != "")
        $("#phyZip").html(phyZip);
    if (phyCountry != null && phyCountry != "")
        $("#phyCountry").html(phyCountry);

    //Mailing Information
    var mailAdd1 = companyProfile["MailingAddress1"];
    var mailAdd2 = companyProfile["MailingAddress2"];
    var mailCountry = companyProfile["MailingCountry"];
    var mailState = companyProfile["MailingState"];
    var mailCity = companyProfile["MailingCity"];
    var mailZip = companyProfile["MailingZip"];
    var tdMailingAddress = $("#tdMailingAddress");
    if (mailAdd1 != null && mailAdd1 != "")
        $("#mailAdd1").html(mailAdd1);
    if (mailAdd2 != null && mailAdd2 != "")
        $("#mailAdd2").html(mailAdd2);
    if (mailCity != null && mailCity != "")
        $("#mailCity").html(mailCity);
    if (mailState != null && mailState != "")
        $("#mailState").html(mailState);
    if (mailZip != null && mailZip != "")
        $("#mailZip").html(mailZip);
    if (mailCountry != null && mailCountry != "")
        $("#mailCountry").html(mailCountry);
}

function CompanyProfileViewTest_getHtmlFromObjectCompanyOwner(companyOwner, companyAccordion, Owner) {
    var companyID = companyOwner.CompanyID == null ? "" : companyOwner.CompanyID;
    var comName = companyOwner.CompanyName == null ? "" : companyOwner.CompanyName;
    var percentage = companyOwner.Percentage == null ? "" : companyOwner.Percentage.toFixed(2) + '%';
    var compOwnerdiv = '';
    //$.ajax({
    //    type: "GET", //GET or POST or PUT or DELETE verb
    //    url: AmazonAPiURL + "/api/CompanyProfile/GetResult", // Location of the service
    //    //url:  "/CompanyProfile/GetResult", // Location of the service
    //    cache: false,
    //    data: { id: companyID, type: "OwnerCompany" }, //Data sent to server
    //    dataType: "json",
    //    async: false,
    //    success: function (data) {
    //        try {
    //            //console.log(data);
    //            //var jsondata = JSON.parse(JSON.stringify(data));
    //            var jsondata = JSON.parse(data);
    //            var Company = JSON.parse(jsondata.GetCompanyProfileCompanyByIdResult);
    //            //console.log(Company);            

    var CompanyName = comName;
    compOwnerdiv = '<div class="accordion-group" style="border:1.5px solid #EEEEEE !important;">' +
        '<div class="accordion-heading">' +
        '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
        '<tr>' +
        '<td width="40%">' +
        '<a href="#' + Owner + companyID + '" onclick="CompanyProfileViewTest_SearchOwnerCompany(' + companyID + ',\'' + Owner + '\',this);" data-parent="#' + companyAccordion + '" data-toggle="collapse" class="accordion-toggle collapsed" style="padding: 0px 0px 0px 0px !important; color: #368EE0!important; font-size: 13px !important; background: white !important;">' + CompanyName + '</a>' +
        '</td>' +
        '<td width="60%">' + percentage + '</td>' +
        '</tr>' +
        '</table>' +
        '</div>' +
        '<div class="accordion-body collapse" id="' + Owner + companyID + '" style="height: 0px;">' +
        '<div class="accordion-inner" style="border-top: 1px solid #E5E5E5 !important;">' +
        '<h3><span id="' + Owner + 'Name' + companyID + '"></span></h3>' +
        '<table>' +
        '<thead>' +
        '<tr>' +
        '<th width="300" id="' + Owner + 'physicalheader' + companyID + '" style="text-align: left;"></th>' +
        '<th width="300" id="' + Owner + 'mailheader' + companyID + '" style="text-align: left;"></th>' +
        '<th width="300" id="' + Owner + 'contactInfoheader' + companyID + '" style="text-align: left;"></th>' +
        '</tr>' +
        ' <tr>' +
        '<td id="' + Owner + 'PhysicalAddress' + companyID + '" valign="top"></td>' +
        '<td id="' + Owner + 'MailingAddress' + companyID + '" valign="top"></td>' +
        '<td id="' + Owner + 'contactInformation' + companyID + '" valign="top"></td>' +
        '</tr>' +
        '</thead>' +
        '</table>' +
        '<table>' +
        '<thead>' +
        '<tr>' +
        '<th id="' + Owner + 'detailsheader' + companyID + '" style="text-align: left;"></th>' +
        '</tr>' +
        '<tr>' +
        '<td id="' + Owner + 'Details' + companyID + '" valign="top"></td>' +
        '</tr>' +
        '</thead>' +
        '</table>' +
        '</div>' +
        '</div>' +
        '</div>';

    //        }
    //        catch (err) {
    //            $("#mainLoader").hide();
    //            $("#txtSearch").val("");
    //        }
    //    },
    //});

    return $(compOwnerdiv);
}

function CompanyProfileViewTest_SearchOwnerCompany(CompanyID, Owner, currentanchor) {
    if (CompanyID != '' && CompanyID !== undefined) {
        if ($(currentanchor).hasClass("collapsed")) {
            $("#mainLoader").show();
            $.ajax({
                type: "GET", //GET or POST or PUT or DELETE verb
                url: AmazonAPiURL + "/api/CompanyProfile/GetResult", // Location of the service
                //url:  "/CompanyProfile/GetResult", // Location of the service
                cache: true,
                data: { id: CompanyID, type: "OwnerCompany" }, //Data sent to server
                // dataType: "json",
                success: function (data) {
                    try {

                        //console.log(data);
                        //var jsondata = JSON.parse(JSON.stringify(data));
                        //  var jsondata = JSON.parse(data);
                        var Company = JSON.parse(data.GetCompanyProfileCompanyByIdResult);
                        //console.log(Company);

                        $('#' + Owner + 'Details' + CompanyID).html("");
                        $('#' + Owner + 'PhysicalAddress' + CompanyID).html("");
                        $('#' + Owner + 'MailingAddress' + CompanyID).html("");
                        $('#' + Owner + 'contactInformation' + CompanyID).html("");

                        var CompanyName = Company.CompanyName;
                        $("#" + Owner + "Name" + CompanyID).html(CompanyName);

                        //Physical Information
                        var phyadd1 = Company.PhyAddress1;
                        var phyadd2 = Company.PhyAddress2;
                        var phycountry = Company.PhyCountry;
                        var phystate = Company.PhyState;
                        var phycity = Company.PhyCity;
                        var phyzip = Company.PhyZip;

                        var compOwnerPhysicalAddress = $("#" + Owner + "PhysicalAddress" + CompanyID);
                        $("#" + Owner + "physicalheader" + CompanyID).html("Physical Address");
                        if (phyadd1 != null && phyadd1 != "")
                            compOwnerPhysicalAddress.append("<span>" + phyadd1 + "</span><br />");
                        if (phyadd2 != null && phyadd2 != "")
                            compOwnerPhysicalAddress.append("<span>" + phyadd2 + "</span><br />");
                        if (phycountry != null && phycountry != "")
                            compOwnerPhysicalAddress.append("<span>" + phycountry + "</span><br />");
                        if (phystate != null && phystate != "")
                            compOwnerPhysicalAddress.append("<span>" + phystate + "</span><br />");
                        if (phycity != null && phycity != "")
                            compOwnerPhysicalAddress.append("<span>" + phycity + "</span><br />");
                        if (phyzip != null && phyzip != "")
                            compOwnerPhysicalAddress.append("<span>" + phyzip + "</span>");

                        //Mailing Information
                        var mailadd1 = Company.MailingAddress1;
                        var mailadd2 = Company.MailingAddress2;
                        var mailcountry = Company.MailingCountry;
                        var mailstate = Company.MailingState;
                        var mailcity = Company.MailingCity;
                        var mailzip = Company.MailingZip;

                        var compOwnerMailingAddress = $("#" + Owner + "MailingAddress" + CompanyID);
                        $("#" + Owner + "mailheader" + CompanyID).html("Mailing Address");
                        if (mailadd1 != null && mailadd1 != "")
                            compOwnerMailingAddress.append("<span>" + mailadd1 + "</span><br />");
                        if (mailadd2 != null && mailadd2 != "")
                            compOwnerMailingAddress.append("<span>" + mailadd2 + "</span><br />");
                        if (mailcountry != null && mailcountry != "")
                            compOwnerMailingAddress.append("<span>" + mailcountry + "</span><br />");
                        if (mailstate != null && mailstate != "")
                            compOwnerMailingAddress.append("<span>" + mailstate + "</span><br />");
                        if (mailcity != null && mailcity != "")
                            compOwnerMailingAddress.append("<span>" + mailcity + "</span><br />");
                        if (mailzip != null && mailzip != "")
                            compOwnerMailingAddress.append("<span>" + mailzip + "</span>");

                        //Contact Information
                        var contactName = Company.ContactName;
                        var phone = Company.Phone;
                        var fax = Company.Fax;
                        var email = Company.Email;
                        var web = Company.Web;

                        var compOwnercontactInformation = $("#" + Owner + "contactInformation" + CompanyID);
                        $("#" + Owner + "contactInfoheader" + CompanyID).html("Contact Information");
                        if (contactName != null && contactName != "")
                            compOwnercontactInformation.append("<span>ContactName : " + contactName + "</span><br />");
                        if (phone != null && phone != "")
                            compOwnercontactInformation.append("<span>Phone : " + phone + "</span><br />");
                        if (fax != null && fax != "")
                            compOwnercontactInformation.append("<span>Fax : " + fax + "</span><br />");
                        if (email != null && email != "")
                            compOwnercontactInformation.append("<span>" + email + "</span><br />");
                        if (web != null && web != "")
                            compOwnercontactInformation.append("<span>" + web + "</span><br />");

                        //Facility Details
                        var coid = Company.CO_ID == null ? "" : Company.CO_ID;
                        var business = Company.BusinessLineName == null ? "" : Company.BusinessLineName;
                        var comodity = Company.CommodityName == null ? "" : Company.CommodityName;
                        var entity = Company.EntityName == null ? "" : Company.EntityName;
                        if (entity != null || entity != "") {
                            entity = entity.replace("Fac Opr", "Facility Operator");
                            entity = entity.replace("Fac Own", "Facility Owner");
                            entity = entity.replace("Sys Opr", "System Operator");
                            entity = entity.replace("Sys Own  ", "System Owner");
                            entity = entity.replace("PL Own", "Pipeline Owner");
                            entity = entity.replace("PL Opr", "Pipeline Operator");
                            entity = entity.replace("Trans Own ", "Transmission Operator");
                        }
                        var entitytype = Company.EntityTypeName == null ? "" : Company.EntityTypeName;
                        if (comodity) {
                            comodity = comodity.replace("Asph", "Asphalt").replace("Ethl", "Ethanol").replace("Misc", "Miscellaneous")
                        }
                        if (entitytype) {
                            entitytype = entitytype.replace("HoldingCo", "Holding Company");
                        }
                        var compOwnerDetails = $("#" + Owner + "Details" + CompanyID);
                        $("#" + Owner + "detailsheader" + CompanyID).html("Company Details");
                        compOwnerDetails.append("<span>CO_ID&nbsp;           : " + coid + "</span><br />");
                        compOwnerDetails.append("<span>Business Lines&nbsp;   : " + business + "</span><br />");
                        compOwnerDetails.append("<span>Commodities&nbsp; : " + comodity + "</span><br />");
                        compOwnerDetails.append("<span>Entities&nbsp;  : " + entity + "</span><br />");
                        compOwnerDetails.append("<span>Entity Type&nbsp;       : " + entitytype + "</span><br />");

                        $("#mainLoader").hide();
                    }
                    catch (err) {
                        $("#mainLoader").hide();
                        $("#txtSearch").val("");
                    }
                },
            });
        }
    }
}

function CompanyProfileViewTest_getHtmlFromObjectFacOwner(companyFacOwner, facilityAccordion, Owner) {
    var facilityID = companyFacOwner.FacilityID == null ? "" : companyFacOwner.FacilityID;
    var facName = companyFacOwner.FacilityName == null ? "" : companyFacOwner.FacilityName;
    var percentage = companyFacOwner.Percentage == null ? "" : companyFacOwner.Percentage.toFixed(0) + '%';
    var MSID = companyFacOwner.MSID == null ? "" : companyFacOwner.MSID;
    var FacilityType = companyFacOwner.FacilityType == null ? "" : companyFacOwner.FacilityType;
    // percentage = isNaN(parseFloat(percentage)) ? "" : parseFloat(long).toFixed(0);

    var FacOwnerdiv = '<div class="accordion-group" style="border:1.5px solid #EEEEEE !important;">' +
        '<div class="accordion-heading">' +
        '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
        '<tr>' +
        '<td width="40%">' +
        '<a href="#' + Owner + facilityID + '" onclick="CompanyProfileViewTest_SearchFacility(' + facilityID + ',\'' + Owner + '\',this);" data-parent="#' + facilityAccordion + '" data-toggle="collapse" class="accordion-toggle collapsed" style="padding: 0px 0px 0px 0px !important; color: #368EE0!important; font-size: 13px !important; background: white !important;">' + facName + '</a>' +
        '</td>' +
        '<td width="30%">' + percentage + '</td>' +
        '<td width="30%">' + ((FacilityType == "MS") ? "Meter Station" : FacilityType) + '</td>' +       //By Nikunj (Edited for US 526 #19-12-2014#)
        // '<td width="30%">' +
        // '<a href="Map/Index?type=fac&ID=' + MSID + '">Details</a>' +
        // '</td>' +
        '</tr>' +
        '</table>' +
        '</div>' +
        '<div class="accordion-body collapse" id="' + Owner + facilityID + '" style="height: 0px;">' +
        '<div class="accordion-inner" style="border-top: 1px solid #E5E5E5 !important;">' +
        '<h3><span id="' + Owner + 'Name' + facilityID + '"></span></h3>' +
        '<table width="100%">' +
        '<tr>' +
        '<td width="70%">' +
        '<table width="100%">' +
        '<thead>' +
        '<tr>' +
        '<th width="300" id="' + Owner + 'physicalheader' + facilityID + '" style="text-align: left;"></th>' +
        '<th width="300" id="' + Owner + 'mailheader' + facilityID + '" style="text-align: left;"></th>' +
        '<th width="300" id="' + Owner + 'contactInfoheader' + facilityID + '" style="text-align: left;"></th>' +
        '</tr>' +
        ' <tr>' +
        '<td id="' + Owner + 'PhysicalAddress' + facilityID + '" valign="top"></td>' +
        '<td id="' + Owner + 'MailingAddress' + facilityID + '" valign="top"></td>' +
        '<td id="' + Owner + 'contactInformation' + facilityID + '" valign="top"></td>' +
        '</tr>' +
        '</thead>' +
        '</table>' +
        '<table>' +
        '<thead>' +
        '<tr>' +
        '<th id="' + Owner + 'detailsheader' + facilityID + '" style="text-align: left;"></th>' +
        '</tr>' +
        '<tr>' +
        '<td id="' + Owner + 'Details' + facilityID + '" valign="top"></td>' +
        '</tr>' +
        '</thead>' +
        '</table>' +
        '</td>' +
        '<td width="30%">' +
        '<div id="' + Owner + 'map_canvas_plus2' + facilityID + '" style="width: 100%; height: 260px;"> </div>' +
        '</td>' +
        '</tr>' +
        '</table>' +
        '</div>' +
        '</div>' +
        '</div>';
    return $(FacOwnerdiv);
}

function CompanyProfileViewTest_SearchFacility(FacilityID, Owner, currentanchor) {
    if (FacilityID != '' && FacilityID !== undefined) {
        if ($(currentanchor).hasClass("collapsed")) {
            $("#mainLoader").show();
            $.ajax({
                type: "GET", //GET or POST or PUT or DELETE verb                
                // url:  "/CompanyProfile/GetResult", // Location of the service
                url: AmazonAPiURL + "/api/CompanyProfile/GetResult", // Location of the service
                cache: true,
                data: { id: FacilityID, type: "Facility" }, //Data sent to server
                dataType: "json",
                success: function (data) {
                    try {

                        //console.log(data);
                        //var jsondata = JSON.parse(JSON.stringify(data));
                        // var jsondata = JSON.parse(data);
                        var Facility = JSON.parse(data.GetCompanyProfileFacilityByIdResult);

                        $('#' + Owner + 'Details' + FacilityID).html("");
                        $('#' + Owner + 'PhysicalAddress' + FacilityID).html("");
                        $('#' + Owner + 'MailingAddress' + FacilityID).html("");
                        $('#' + Owner + 'contactInformation' + FacilityID).html("");
                        $("#" + Owner + "map_canvas_plus2" + FacilityID).html("");

                        var FacilityName = Facility.FacilityName;
                        var MapMSID = Facility.MSID == null ? "" : Facility.MSID;
                        //  $("#" + Owner + "Name" + FacilityID).html(FacilityName);
                        // $("#" + Owner + "Name" + FacilityID).html(FacilityName + "&nbsp;&nbsp;&nbsp;<a class='nameLink' href='"+energymapitURL+"/Map/Index?type=fac&ID=" + MapMSID + "'>View in Map</a>");

                        //Physical Information
                        var phyadd1 = Facility.PhyAddress1;
                        var phyadd2 = Facility.PhyAddress2;
                        var phycountry = Facility.PhyCountry;
                        var phystate = Facility.PhyState;
                        var phycity = Facility.PhyCity;
                        var phyzip = Facility.PhyZip;

                        var facOwnerPhysicalAddress = $("#" + Owner + "PhysicalAddress" + FacilityID);
                        $("#" + Owner + "physicalheader" + FacilityID).html("Physical Address");
                        if (phyadd1 != null && phyadd1 != "")
                            facOwnerPhysicalAddress.append("<span>" + phyadd1 + "</span><br />");
                        if (phyadd2 != null && phyadd2 != "")
                            facOwnerPhysicalAddress.append("<span>" + phyadd2 + "</span><br />");
                        if (phycountry != null && phycountry != "")
                            facOwnerPhysicalAddress.append("<span>" + phycountry + "</span><br />");
                        if (phystate != null && phystate != "")
                            facOwnerPhysicalAddress.append("<span>" + phystate + "</span><br />");
                        if (phycity != null && phycity != "")
                            facOwnerPhysicalAddress.append("<span>" + phycity + "</span><br />");
                        if (phyzip != null && phyzip != "")
                            facOwnerPhysicalAddress.append("<span>" + phyzip + "</span>");

                        //Mailing Information
                        var mailadd1 = Facility.MailingAddress1;
                        var mailadd2 = Facility.MailingAddress2;
                        var mailcountry = Facility.MailingCountry;
                        var mailstate = Facility.MailingState;
                        var mailcity = Facility.MailingCity;
                        var mailzip = Facility.MailingZip;

                        var facOwnerMailingAddress = $("#" + Owner + "MailingAddress" + FacilityID);
                        $("#" + Owner + "mailheader" + FacilityID).html("Mailing Address");
                        if (mailadd1 != null && mailadd1 != "")
                            facOwnerMailingAddress.append("<span>" + mailadd1 + "</span><br />");
                        if (mailadd2 != null && mailadd2 != "")
                            facOwnerMailingAddress.append("<span>" + mailadd2 + "</span><br />");
                        if (mailcountry != null && mailcountry != "")
                            facOwnerMailingAddress.append("<span>" + mailcountry + "</span><br />");
                        if (mailstate != null && mailstate != "")
                            facOwnerMailingAddress.append("<span>" + mailstate + "</span><br />");
                        if (mailcity != null && mailcity != "")
                            facOwnerMailingAddress.append("<span>" + mailcity + "</span><br />");
                        if (mailzip != null && mailzip != "")
                            facOwnerMailingAddress.append("<span>" + mailzip + "</span>");

                        //Contact Information
                        var phone = Facility.Phone;
                        var fax = Facility.Fax;
                        var email = Facility.Email;
                        var web = Facility.Web;

                        var facOwnercontactInformation = $("#" + Owner + "contactInformation" + FacilityID);
                        $("#" + Owner + "contactInfoheader" + FacilityID).html("Contact Information");
                        if (phone != null && phone != "")
                            facOwnercontactInformation.append("<span>Phone : " + phone + "</span><br />");
                        if (fax != null && fax != "")
                            facOwnercontactInformation.append("<span>Fax : " + fax + "</span><br />");
                        if (email != null && email != "")
                            facOwnercontactInformation.append("<span>" + email + "</span><br />");
                        if (web != null && web != "")
                            facOwnercontactInformation.append("<span>" + web + "</span><br />");

                        //Facility Details
                        var msid = Facility.MSID == null ? "" : Facility.MSID;
                        var factype = Facility.FacilityType == null ? "" : Facility.FacilityType;
                        var facstatus = Facility.FacilityStatus == null ? "" : Facility.FacilityStatus;
                        var faccomodity = Facility.CommodityName == null ? "" : Facility.CommodityName;
                        var faclat = Facility.Latitude == null ? "" : Facility.Latitude;
                        var faclan = Facility.Longitude == null ? "" : Facility.Longitude;

                        var facOwnerDetails = $("#" + Owner + "Details" + FacilityID);
                        $("#" + Owner + "detailsheader" + FacilityID).html("Facility Details");
                        facOwnerDetails.append("<span>MSID&nbsp;           : " + msid + "</span><br />");
                        facOwnerDetails.append("<span>Facility Type&nbsp;   : " + factype + "</span><br />");
                        facOwnerDetails.append("<span>Facility Status&nbsp; : " + facstatus + "</span><br />");
                        facOwnerDetails.append("<span>Commodity Name&nbsp;  : " + faccomodity.replace("Asph", "Asphalt").replace("Ethl", "Ethanol").replace("Misc", "Miscellaneous") + "</span><br />");
                        facOwnerDetails.append("<span>Latitude&nbsp;       : " + faclat + "</span><br />");
                        facOwnerDetails.append("<span>Longitude&nbsp;      : " + faclan + "</span><br />");

                        // Maps Information
                        txt_lat = parseFloat(faclat);
                        txt_long = parseFloat(faclan);
                        initialize_map(Owner, FacilityID);

                        $("#mainLoader").hide();
                    }
                    catch (err) {
                        $("#mainLoader").hide();
                        $("#txtSearch").val("");
                    }
                },
            });
        }
    }
}

function getHtmlFromObjectSysOwner(companySysOwner, systemOwnerAccordion, Owner) {

    var systemID = companySysOwner.SystemID == null ? "" : companySysOwner.SystemID;
    var sysName = companySysOwner.SystemName == null ? "" : companySysOwner.SystemName;
    var percentage = companySysOwner.Percentage == null ? "" : companySysOwner.Percentage.toFixed(2) + '%';

    var SysOwnerdiv = '<div class="accordion-group" style="border:1.5px solid #EEEEEE !important;">' +
        '<div class="accordion-heading">' +
        '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
        '<tr>' +
        '<td width="40%">' +
        '<a href="#' + Owner + systemID + '" onclick="SearchSystem(' + systemID + ',\'' + Owner + '\',this);" data-parent="#' + systemOwnerAccordion + '" data-toggle="collapse" class="accordion-toggle collapsed" style="padding: 0px 0px 0px 0px !important; color: #368EE0!important; font-size: 13px !important; background: white !important;">' + sysName + '</a>' +
        '</td>' +
        '<td width="60%">' + percentage + '</td>' +
        '</tr>' +
        '</table>' +
        '</div>' +
        '<div class="accordion-body collapse" id="' + Owner + systemID + '" style="height: 0px;">' +
        '<div class="accordion-inner" style="border-top: 1px solid #E5E5E5 !important;">' +
        '<h3><span id="' + Owner + 'Name' + systemID + '"></span></h3>' +
        '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
        '<thead>' +
        '<tr>' +
        '<th id="' + Owner + 'detailsheader' + systemID + '" style="text-align: left;"></th>' +
        '</tr>' +
        '<tr>' +
        '<td id="' + Owner + 'Details' + systemID + '" valign="top"></td>' +
        '</tr>' +
        '</thead>' +
        '</table>' +
        '</div>' +
        '</div>' +
        '</div>';
    return $(SysOwnerdiv);
}

function SearchSystem(SystemID, Owner, currentanchor) {
    if (SystemID != '' && SystemID !== undefined) {
        if ($(currentanchor).hasClass("collapsed")) {
            $("#mainLoader").show();
            $.ajax({
                type: "GET",
                url: AmazonAPiURL + "/api/CompanyProfile/GetResult",
                // url:  "/CompanyProfile/GetResult",
                cache: true,
                data: { id: SystemID, type: "System" },
                dataType: "json",
                success: function (data) {
                    try {

                        //var jsondata = JSON.parse(JSON.stringify(data));
                        // var jsondata = JSON.parse(data);
                        var System = JSON.parse(data.GetCompanyProfileSystemByIdResult);
                        $('#' + Owner + 'Details' + SystemID).html("");

                        var SystemName = System.SystemName;
                        $("#" + Owner + "Name" + SystemID).html(SystemName);

                        //System Details
                        var sysid = System.SystemID == null ? "" : System.SystemID;
                        var sysname = System.SystemName == null ? "" : System.SystemName;
                        var trrcname = System.TRRCName == null ? "" : System.TRRCName;
                        var t4permit = System.t4Permit == null ? "" : System.t4Permit;
                        var commerce = System.Commerce == null ? "" : System.Commerce;
                        var career = System.Carrier == null ? "" : System.Carrier;
                        var desc = System.Description == null ? "" : System.Description;
                        var commodity = System.Commodity == null ? "" : System.Commodity;

                        var sysOwnerDetails = $("#" + Owner + "Details" + SystemID);
                        $("#" + Owner + "detailsheader" + SystemID).html("System Details");
                        //sysOwnerDetails.append("<span>System ID&nbsp;           : " + sysid + "</span><br />");
                        ////facOwnerDetails.append("<span>SystemName&nbsp;   : " + sysname + "</span><br />");
                        //sysOwnerDetails.append("<span>TRRC Name&nbsp; : " + trrcname + "</span><br />");
                        //sysOwnerDetails.append("<span>t4 Permit&nbsp;  : " + t4permit + "</span><br />");
                        //sysOwnerDetails.append("<span>Commerce&nbsp;       : " + commerce + "</span><br />");
                        //sysOwnerDetails.append("<span>Carrier&nbsp;       : " + career + "</span><br />");
                        //sysOwnerDetails.append("<span>Description&nbsp;       : " + desc + "</span><br />");
                        if (commodity) {
                            commodity = commodity.replace("Asph", "Asphalt").replace("Ethl", "Ethanol").replace("Misc", "Miscellaneous")
                        }
                        var systemDetailsTable = '<table width="100%">' +
                            '<tr>' +
                            '<td width="7%">System ID</td>' +
                            '<td width="93%">:&nbsp' + sysid + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>TRRC Name</td>' +
                            '<td>:&nbsp' + trrcname + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>t4 Permit</td>' +
                            '<td>:&nbsp' + t4permit + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Commodities</td>' +
                            '<td>:&nbsp' + commodity + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Commerce</td>' +
                            '<td>:&nbsp' + commerce + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td>Carrier</td>' +
                            '<td>:&nbsp' + career + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '<td valign="top">Description</td>' +
                            '<td>:&nbsp' + desc + '</td>' +
                            '</tr>' +
                            '</table>';
                        sysOwnerDetails.append(systemDetailsTable);
                        $("#mainLoader").hide();
                    }
                    catch (err) {
                        $("#mainLoader").hide();
                        $("#txtSearch").val("");
                    }
                },
            });
        }
    }
}

function getHtmlFromObjectPowerOwner(companyPowerOwner, powerAccordion, Owner) {

    var powerID = companyPowerOwner.PowerID == null ? "" : companyPowerOwner.PowerID;
    var powerName = companyPowerOwner.PowerName == null ? "" : companyPowerOwner.PowerName;
    var percentage = companyPowerOwner.Percentage == null ? "" : companyPowerOwner.Percentage.toFixed(2) + '%';

    var PowOwnerdiv = '<div class="accordion-group" style="border:1.5px solid #EEEEEE !important;">' +
        '<div class="accordion-heading">' +
        '<table width="100%" cellpadding="0" cellspacing="0" border="0">' +
        '<tr>' +
        '<td width="40%">' +
        '<a href="#' + Owner + powerID + '" onclick="SearchPower(' + powerID + ',\'' + Owner + '\',this);" data-parent="#' + powerAccordion + '" data-toggle="collapse" class="accordion-toggle collapsed" style="padding: 0px 0px 0px 0px !important; color: #368EE0!important; font-size: 13px !important; background: white !important;">' + powerName + '</a>' +
        '</td>' +
        '<td width="60%">' + percentage + '</td>' +
        '</tr>' +
        '</table>' +
        '</div>' +
        '<div class="accordion-body collapse" id="' + Owner + powerID + '" style="height: 0px;">' +
        '<div class="accordion-inner" style="border-top: 1px solid #E5E5E5 !important;">' +
        '<h3><span id="' + Owner + 'Name' + powerID + '"></span></h3>' +
        '<table width="100%">' +
        '<tr>' +
        '<td width="30%" id="' + Owner + 'Details' + powerID + '" valign="top"></td>' +
        '<td width="44%" valign="top">' +
        '<table width="100%">' +
        '<tr>' +
        '<th id="' + Owner + 'physicalheader' + powerID + '" style="text-align: left;"></th>' +
        '<th id="' + Owner + 'contactInfoheader' + powerID + '" style="text-align: left;"></th>' +
        '</tr>' +
        '<tr>' +
        '<td id="' + Owner + 'PhysicalAddress' + powerID + '" valign="top"></td>' +
        '<td id="' + Owner + 'contactInformation' + powerID + '" valign="top"></td>' +
        '</tr>' +
        '<tr>' +
        '<th id="' + Owner + 'unitsheader' + powerID + '" style="text-align: left;"></th>' +
        '<th id="' + Owner + 'hydroheader' + powerID + '" style="text-align: left;"></th>' +
        '</tr>' +
        '<tr>' +
        '<td id="' + Owner + 'unitsInformation' + powerID + '" valign="top"></td>' +
        '<td id="' + Owner + 'HydroInformation' + powerID + '" valign="top"></td>' +
        '</tr>' +
        '</table>' +
        '</td>' +
        '<td width="30%" valign="top"><div id="' + Owner + 'map_canvas_plus2' + powerID + '" style="width: 100%; height: 260px;"> </div></td>' +
        '</tr>' +
        '</table>' +
        '<span id ="' + Owner + 'unitsExistingHeader' + powerID + '"></span>' +
        '<br/><div style="height:5px;"></div>' +
        '<table class="table table-hover table-nomargin" id="' + Owner + 'powerUnits' + powerID + '"  cellpadding="0" cellspacing="0" border="1" width="100%">' +
        '</table>' +
        '</div>' +
        '</div>' +
        '</div>';
    return $(PowOwnerdiv);
}

function SearchPower(PowerID, Owner, currentanchor) {
    if (PowerID != '' && PowerID !== undefined) {
        if ($(currentanchor).hasClass("collapsed")) {
            $("#mainLoader").show();
            $.ajax({
                type: "GET", //GET or POST or PUT or DELETE verb

                url: AmazonAPiURL + "/api/CompanyProfile/GetResult", // Location of the service
                //url:  "/CompanyProfile/GetResult", // Location of the service
                cache: true,
                data: { id: PowerID, type: "Power" }, //Data sent to server
                dataType: "json",
                success: function (data) {
                    try {
                        //console.log(data);
                        //var jsondata = JSON.parse(JSON.stringify(data));
                        // var jsondata = JSON.parse(data);
                        var Power = JSON.parse(data.GetCompanyProfilePowerByIdResult);
                        var PowerProfile = JSON.parse(Power.CompanyProfilePower);
                        var PowerUnits = JSON.parse(Power.CompanyProfilePowerUnits);

                        $('#' + Owner + 'Details' + PowerID).html("");
                        $('#' + Owner + 'PhysicalAddress' + PowerID).html("");
                        $('#' + Owner + 'HydroInformation' + PowerID).html("");
                        $('#' + Owner + 'contactInformation' + PowerID).html("");
                        $('#' + Owner + 'unitsInformation' + PowerID).html("");
                        $('#' + Owner + 'unitsExistingHeader' + PowerID).html("");
                        $("#" + Owner + "powerUnits" + PowerID).html("");
                        $("#" + Owner + "map_canvas_plus2" + PowerID).html("");

                        var PowerName = PowerProfile.PowerName;
                        // $("#" + Owner + "Name" + PowerID).html(PowerName + "&nbsp;&nbsp;&nbsp;<a class='nameLink' href='" +  "/Map/Index?pname=" + PowerName + "'>View in Map</a>");

                        //Power Details
                        var msid = PowerProfile.MSID == null ? "" : PowerProfile.MSID;
                        var eiacode = PowerProfile.PowerEIAPlantCode == null ? "" : PowerProfile.PowerEIAPlantCode;
                        var regulated = PowerProfile.Regulated == null ? "" : PowerProfile.Regulated;
                        var sector = PowerProfile.Sector == null ? "" : PowerProfile.Sector;
                        var status = PowerProfile.Status == null ? "" : PowerProfile.Status;
                        var primemover = PowerProfile.PrimeMover == null ? "" : PowerProfile.PrimeMover;
                        var primaryfuel = PowerProfile.PrimeFuel == null ? "" : PowerProfile.PrimeFuel;
                        var ghubfuel = PowerProfile.GHUBPrimaryFuel == null ? "" : PowerProfile.GHUBPrimaryFuel;
                        var nerc = PowerProfile.NRECRegion == null ? "" : PowerProfile.NRECRegion;
                        var isorto = PowerProfile.ISORTO == null ? "" : PowerProfile.ISORTO;
                        var lati = PowerProfile.Lat == null ? "" : PowerProfile.Lat;
                        lati = isNaN(parseFloat(lati)) ? "" : parseFloat(lati).toFixed(6);
                        var long = PowerProfile.Long == null ? "" : PowerProfile.Long;
                        long = isNaN(parseFloat(long)) ? "" : parseFloat(long).toFixed(6);
                        var year = PowerProfile.YearInService == null ? "" : PowerProfile.YearInService;

                        var powOwnerDetails = $("#" + Owner + "Details" + PowerID);
                        $("#" + Owner + "detailsheader" + PowerID).html("Power Details");
                        // powOwnerDetails.append("<span>MSID&nbsp;           : " + msid + "</span><br />");
                        powOwnerDetails.append("<span>EIA Plant Code&nbsp;   : " + eiacode + "</span><br />");
                        powOwnerDetails.append("<span>Regulated&nbsp; : " + regulated + "</span><br />");
                        powOwnerDetails.append("<span>Sector&nbsp;  : " + sector + "</span><br />");
                        powOwnerDetails.append("<span>Status&nbsp;       : " + status + "</span><br />");
                        powOwnerDetails.append("<span>Prime Mover&nbsp;      : " + primemover + "</span><br />");
                        powOwnerDetails.append("<span>Prime Fuel&nbsp;           : " + primaryfuel + "</span><br />");
                        //powOwnerDetails.append("<span>GHUBPrimaryFuel&nbsp;   : " + ghubfuel + "</span><br />");
                        powOwnerDetails.append("<span>NERC Region&nbsp; : " + nerc + "</span><br />");
                        powOwnerDetails.append("<span>ISO RTO&nbsp;  : " + isorto + "</span><br />");
                        powOwnerDetails.append("<span>Latitude&nbsp;       : " + lati + "</span><br />");
                        powOwnerDetails.append("<span>Longitude&nbsp;      : " + long + "</span><br />");
                        powOwnerDetails.append("<span>Year In Service&nbsp; : " + year + "</span><br />");

                        //Physical Information
                        var phyadd1 = PowerProfile.PhysicalAddress1;
                        var phyadd2 = PowerProfile.PhysicalAddress2;
                        var phycountry = PowerProfile.PhysicalCountry;
                        var phystate = PowerProfile.PhysicalState;
                        var phycity = PowerProfile.PhysicalCity;
                        var phyzip = PowerProfile.PhysicalZip;

                        var powOwnerPhysicalAddress = $("#" + Owner + "PhysicalAddress" + PowerID);
                        $("#" + Owner + "physicalheader" + PowerID).html("Physical Address");
                        if (phyadd1 != null && phyadd1 != "")
                            powOwnerPhysicalAddress.append("<span>" + phyadd1 + "</span><br />");
                        if (phyadd2 != null && phyadd2 != "")
                            powOwnerPhysicalAddress.append("<span>" + phyadd2 + "</span><br />");
                        if (phycountry != null && phycountry != "")
                            powOwnerPhysicalAddress.append("<span>" + phycountry + "</span><br />");
                        if (phystate != null && phystate != "")
                            powOwnerPhysicalAddress.append("<span>" + phystate + "</span><br />");
                        if (phycity != null && phycity != "")
                            powOwnerPhysicalAddress.append("<span>" + phycity + "</span><br />");
                        if (phyzip != null && phyzip != "")
                            powOwnerPhysicalAddress.append("<span>" + phyzip + "</span>");

                        //Contact Information
                        var phone = PowerProfile.Phone;
                        var fax = PowerProfile.Fax;
                        var email = PowerProfile.eMail;
                        var web = PowerProfile.Web;

                        var powOwnercontactInformation = $("#" + Owner + "contactInformation" + PowerID);
                        $("#" + Owner + "contactInfoheader" + PowerID).html("Contact Information");
                        if (phone != null && phone != "")
                            powOwnercontactInformation.append("<span>Phone : " + phone + "</span><br />");
                        if (fax != null && fax != "")
                            powOwnercontactInformation.append("<span>Fax : " + fax + "</span><br />");
                        if (email != null && email != "")
                            powOwnercontactInformation.append("<span>" + email + "</span><br />");
                        if (web != null && web != "")
                            powOwnercontactInformation.append("<span>" + web + "</span><br />");

                        // Units Information
                        var noofunits = PowerProfile.NumberOfUnits;
                        var installed = PowerProfile.NamePlateCapacity;
                        var proposed = PowerProfile.ProposedCapacity;
                        var retired = PowerProfile.RetiredCapacity;

                        var powOwnerUnits = $("#" + Owner + "unitsInformation" + PowerID);
                        $("#" + Owner + "unitsheader" + PowerID).html("Units Information");
                        if (noofunits != null && noofunits != "")
                            powOwnerUnits.append("<span>No. Of Units : " + noofunits + "</span><br />");
                        if (installed != null && installed != "")
                            powOwnerUnits.append("<span>Nameplate Capacity : " + installed + "</span><br />");
                        if (proposed != null && proposed != "")
                            powOwnerUnits.append("<span>Proposed Capacity : " + proposed + "</span><br />");
                        if (retired != null && retired != "")
                            powOwnerUnits.append("<span>Retired Capacity  : " + retired + "</span><br />");

                        //Hydro Information
                        var reservior = PowerProfile.Reservior;
                        var popular = PowerProfile.PopularName;
                        var river = PowerProfile.River;
                        var stateline = PowerProfile.StateLine;

                        var powOwnerhydroInformation = $("#" + Owner + "HydroInformation" + PowerID);
                        $("#" + Owner + "hydroheader" + PowerID).html("Hydro Information");
                        if (reservior != null && reservior != "")
                            powOwnerhydroInformation.append("<span>Reservoir : " + reservior + "</span><br />");
                        if (popular != null && popular != "")
                            powOwnerhydroInformation.append("<span>Popular : " + popular + "</span><br />");
                        if (river != null && river != "")
                            powOwnerhydroInformation.append("<span>River : " + river + "</span><br />");
                        if (stateline != null && stateline != "")
                            powOwnerhydroInformation.append("<span>State Line  : " + stateline + "</span><br />");

                        //PowerUnits Information
                        $('#' + Owner + 'unitsExistingHeader' + PowerID).html("<b>Existing & Planned Unit Data</b>");
                        for (var i = 0; i < PowerUnits.length; i++) {
                            $("#" + Owner + "powerUnits" + PowerID).append(getHtmlForPowerUnitTable(PowerUnits[i], i));
                        }
                        PowerUnits = null;

                        //Maps Information
                        txt_lat = parseFloat(lati);
                        txt_long = parseFloat(long);
                        initialize_map(Owner, PowerID);

                        $("#mainLoader").hide();
                    }
                    catch (err) {
                        $("#mainLoader").hide();
                        $("#txtSearch").val("");
                    }
                },
            });
        }
    }
}

function getHtmlFromobjectTransmissionOperated(companyTransOwner, transAccordion, Owner) {
    var transProjID = companyTransOwner.TransProjID == null ? "" : companyTransOwner.TransProjID;
    var traName = companyTransOwner.TransProjName == null ? "" : companyTransOwner.TransProjName;
    var percentage = companyTransOwner.Percentage == null ? "" : companyTransOwner.Percentage.toFixed(2);

    var TransOwnerdiv = '<div class="accordion-group" style="border:1.5px solid #EEEEEE !important;">' +
        '<div class="accordion-heading">' +
        '<table>' +
        '<tr>' +
        '<td width="460px">' +
        '<a href="#' + Owner + transProjID + '" onclick="SearchTransmission(' + transProjID + ',\'' + Owner + '\',this);" data-parent="#' + transAccordion + '" data-toggle="collapse" class="accordion-toggle collapsed" style="padding: 0px 0px 0px 0px !important; color: #368EE0!important; font-size: 13px !important; background: white !important;">' + traName + '</a>' +
        '</td>' +
        '<td width="300px">' + '</td>' +
        '</tr>' +
        '</table>' +
        '</div>' +
        '<div class="accordion-body collapse" id="' + Owner + transProjID + '" style="height: 0px;">' +
        '<div class="accordion-inner" style="border-top: 1px solid #E5E5E5 !important;">' +
        '<h3><span id="' + Owner + 'Name' + transProjID + '"></span></h3>' +
        '<div id="TransmissionOwner' + Owner + transProjID + '">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    return $(TransOwnerdiv);
}

function getHtmlFromObjectTransmission(companyTransOwner, transAccordion, Owner) {

    var transProjID = companyTransOwner.TransProjID == null ? "" : companyTransOwner.TransProjID;
    var traName = companyTransOwner.TransProjName == null ? "" : companyTransOwner.TransProjName;
    var percentage = companyTransOwner.Percentage == null ? "" : companyTransOwner.Percentage.toFixed(2);

    var TransOwnerdiv = '<div class="accordion-group" style="border:1.5px solid #EEEEEE !important;">' +
        '<div class="accordion-heading">' +
        '<table>' +
        '<tr>' +
        '<td width="460px">' +
        '<a href="#' + Owner + transProjID + '" onclick="SearchTransmission(' + transProjID + ',\'' + Owner + '\',this);" data-parent="#' + transAccordion + '" data-toggle="collapse" class="accordion-toggle collapsed" style="padding: 0px 0px 0px 0px !important; color: #368EE0!important; font-size: 13px !important; background: white !important;">' + traName + '</a>' +
        '</td>' +
        '<td width="300px">' + percentage + '%' + '</td>' +
        '</tr>' +
        '</table>' +
        '</div>' +
        '<div class="accordion-body collapse" id="' + Owner + transProjID + '" style="height: 0px;">' +
        '<div class="accordion-inner" style="border-top: 1px solid #E5E5E5 !important;">' +
        '<h3><span id="' + Owner + 'Name' + transProjID + '"></span></h3>' +
        '<div id="TransmissionOwner' + Owner + transProjID + '">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    return $(TransOwnerdiv);
}

function SearchTransmission(TransProjID, Owner, currentanchor) {
    if (TransProjID != '' && TransProjID !== undefined) {
        if ($(currentanchor).hasClass("collapsed")) {
            $("#mainLoader").show();
            $.ajax({
                type: "GET", //GET or POST or PUT or DELETE verb

                url: AmazonAPiURL + "/api/CompanyProfile/GetResult", // Location of the service
                //url:  "/CompanyProfile/GetResult", // Location of the service
                cache: true,
                data: { id: TransProjID, type: "Transmission" }, //Data sent to server
                dataType: "json",
                success: function (data) {
                    try {

                        //  alert(data);
                        // var jsondata = JSON.parse(JSON.stringify(data));
                        // var jsondata = JSON.parse(data);
                        var Transmission = JSON.parse(data.GetCompanyProfileTransmissionProjectByIdResult);

                        $('#TransmissionOwner' + Owner + TransProjID).html("");

                        var TransmissionName = Transmission.ProjectName;
                        $("#" + Owner + "Name" + TransProjID).html(TransmissionName);

                        //Power Details
                        var ID = Transmission.ID == null ? "" : Transmission.ID;
                        var ProjectNumber = Transmission.ProjectNumber == null ? "" : Transmission.ProjectNumber;
                        var ProjectMapName = Transmission.ProjectMapName == null ? "" : Transmission.ProjectMapName;
                        var TransGroupName = Transmission.TransGroupName == null ? "" : Transmission.TransGroupName;
                        var Sponsor = Transmission.Sponsor == null ? "" : Transmission.Sponsor;
                        var Partners = Transmission.Partners == null ? "" : Transmission.Partners;
                        var LineMiiles = Transmission.LineMiiles == null ? "" : Transmission.LineMiiles;
                        var Voltage = Transmission.Voltage == null ? "" : Transmission.Voltage;
                        var Voltage1 = Transmission.Voltage1 == null ? "" : Transmission.Voltage1;
                        var VoltageType = Transmission.VoltageType == null ? "" : Transmission.VoltageType;
                        var OrginPoint = Transmission.OrginPoint == null ? "" : Transmission.OrginPoint;
                        var EndPoint = Transmission.EndPoint == null ? "" : Transmission.EndPoint;
                        var FromState = Transmission.FromState == null ? "" : Transmission.FromState;
                        var ToState = Transmission.ToState == null ? "" : Transmission.ToState;

                        var Status = Transmission.Status == null ? "" : Transmission.Status;
                        var ConstructionDate = Transmission.ConstructionDate == null ? "" : Transmission.ConstructionDate;
                        var CompletionDate = Transmission.CompletionDate == null ? "" : Transmission.CompletionDate;
                        var EstCost = Transmission.EstCost == null ? "" : Transmission.EstCost;
                        var MRDescription = Transmission.MRDescription == null ? "" : Transmission.MRDescription;
                        var WebSite = Transmission.WebSite == null ? "" : Transmission.WebSite;
                        var MapLink = Transmission.MapLink == null ? "" : Transmission.MapLink;
                        var NERCRegionName = Transmission.NERCRegionName == null ? "" : Transmission.NERCRegionName;
                        var ISOName = Transmission.ISOName == null ? "" : Transmission.ISOName;
                        var ProjectObjective = Transmission.ProjectObjective == null ? "" : Transmission.ProjectObjective;
                        var ProjectType = Transmission.ProjectType == null ? "" : Transmission.ProjectType;
                        var OriginBalanceAuth = Transmission.OriginBalanceAuth == null ? "" : Transmission.OriginBalanceAuth;
                        var EndBalanceAuth = Transmission.EndBalanceAuth == null ? "" : Transmission.EndBalanceAuth;
                        var CountryCode = Transmission.CountryCode == null ? "" : Transmission.CountryCode;

                        var Trans = '<table>' +
                            '<tr>' +
                            '<td width="300" valign="top">' +
                            '<table width="300">' +
                            '<tr><td width="150" valign="top" class="TdAlign">Project Number</td><td width="150">:&nbsp;' + ProjectNumber + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">Project Map Name</td><td>:&nbsp;' + ProjectMapName + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">Trans Group Name</td><td>:&nbsp;' + TransGroupName + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">Sponsor</td><td>:&nbsp;' + Sponsor + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">Partners</td><td>:&nbsp;' + Partners + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">Line Miiles</td><td>:&nbsp;' + LineMiiles + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">Voltage</td><td>:&nbsp;' + Voltage + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">Voltage Type</td><td>:&nbsp;' + VoltageType + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">Origin Point</td><td>:&nbsp;' + OrginPoint + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">End Point</td><td>:&nbsp;' + EndPoint + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">From State</td><td>:&nbsp;' + FromState + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">To State</td><td>:&nbsp;' + ToState + '</td></tr>' +
                            '</table>' +
                            '</td>' +
                            '<td width="300" valign="top">' +
                            '<table width="300">' +
                            '<tr><td width="150" valign="top" class="TdAlign">Status</td><td width="150">:&nbsp;' + Status + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">Website</td><td>:&nbsp;' + WebSite + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">Map Link</td><td>:&nbsp;' + MapLink + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">Country</td><td>:&nbsp;' + CountryCode + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">NERC Region</td><td>:&nbsp;' + NERCRegionName + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">ISO Name</td><td>:&nbsp;' + ISOName + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">Project Objective</td><td>:&nbsp;' + ProjectObjective + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">Project Type</td><td>:&nbsp;' + ProjectType + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">Origin Balance Auth</td><td>:&nbsp;' + OriginBalanceAuth + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">End Balance Auth</td><td>:&nbsp;' + EndBalanceAuth + '</td></tr>' +
                            '<tr><td valign="top" class="TdAlign">MR Description</td><td>:&nbsp;' + MRDescription + '</td></tr>' +
                            '</table>' +
                            '</td>' +
                            '</tr>' +
                            '</table>';
                        $('#TransmissionOwner' + Owner + TransProjID).append(Trans);

                        $("#mainLoader").hide();
                    }
                    catch (err) {
                        $("#mainLoader").hide();
                        $("#txtSearch").val("");
                    }
                },
            });
        }
    }
}

function getHtmlFromObjectIndustry(companyIndsOwner, indsAccordion, Owner) {

    var IndsUpdateID = companyIndsOwner.IndustryUpdateID == null ? "" : companyIndsOwner.IndustryUpdateID;
    var IndsUpdateName = companyIndsOwner.IndustryUpdateName == null ? "" : companyIndsOwner.IndustryUpdateName;

    var IndsOwnerdiv = '<div class="accordion-group" style="border:1.5px solid #EEEEEE !important;">' +
        '<div class="accordion-heading">' +
        '<table>' +
        '<tr>' +
        '<td width="460px">' +
        '<a href="#' + Owner + IndsUpdateID + '" onclick="SearchIndustry(' + IndsUpdateID + ',\'' + Owner + '\',this);" data-parent="#' + indsAccordion + '" data-toggle="collapse" class="accordion-toggle collapsed" style="padding: 0px 0px 0px 0px !important; color: #368EE0!important; font-size: 13px !important; background: white !important;">' + IndsUpdateName + '</a>' +
        '</td>' +
        '</tr>' +
        '</table>' +
        '</div>' +
        '<div class="accordion-body collapse" id="' + Owner + IndsUpdateID + '" style="height: 0px;">' +
        '<div class="accordion-inner" style="border-top: 1px solid #E5E5E5 !important;">' +
        '<h3><span id="' + Owner + 'Name' + IndsUpdateID + '"></span></h3>' +
        '<div id="IndustryOwner' + IndsUpdateID + '">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    return $(IndsOwnerdiv);
}

function SearchIndustry(IndustryUpdateID, Owner, currentanchor) {
    if (IndustryUpdateID != '' && IndustryUpdateID !== undefined) {
        if ($(currentanchor).hasClass("collapsed")) {
            $("#mainLoader").show();
            $.ajax({
                type: "GET", //GET or POST or PUT or DELETE verb                
                url: AmazonAPiURL + "/api/CompanyProfile/GetResult", // Location of the service
                //url:  "/CompanyProfile/GetResult", // Location of the service
                cache: true,
                data: { id: IndustryUpdateID, type: "Industry" }, //Data sent to server
                dataType: "json",
                success: function (data) {
                    try {

                        //  alert(data);
                        //var jsondata = JSON.parse(JSON.stringify(data));
                        //var jsondata = JSON.parse(data);
                        var Industry = JSON.parse(data.GetCompanyProfileIndustryByIdResult);

                        $('#IndustryOwner' + IndustryUpdateID).html("");

                        var Name = Industry.ProjectName;
                        $("#" + Owner + "Name" + IndustryUpdateID).html(Name);

                        //Industry Details
                        var ID = Industry.IndustryUpdateID == null ? "" : Industry.IndustryUpdateID;
                        var IUkey = Industry.IUkey == null ? "" : Industry.IUkey;
                        var Region = Industry.Region == null ? "" : Industry.Region;
                        var Status = Industry.Status == null ? "" : Industry.Status;
                        var ProjectType = Industry.ProjectType == null ? "" : Industry.ProjectType;
                        var Commodities = Industry.Commodities == null ? "" : Industry.Commodities;
                        if (commodities) {
                            Commodities = Commodities.replace("Ethl", "Ethanol").replace("Misc", "Miscellaneous").replace("Asph", "Asphalt");
                        }
                        var Operator = Industry.Operator == null ? "" : Industry.Operator;
                        var FERCDocket = Industry.FERCDocket == null ? "" : Industry.FERCDocket;
                        var MapLink = Industry.MapLink == null ? "" : Industry.MapLink;
                        var WebSite = Industry.WebSite == null ? "" : Industry.WebSite;
                        var Currency = Industry.Currency == null ? "" : Industry.Currency;
                        var ProjectName = Industry.ProjectName == null ? "" : Industry.ProjectName;
                        var StartDate = Industry.StartDate == null ? "" : Industry.StartDate;
                        var CompletionDate = Industry.CompletionDate == null ? "" : Industry.CompletionDate;
                        var TotalEstimatedCost = Industry.TotalEstimatedCost == null ? "" : Industry.TotalEstimatedCost;
                        var ProjectDescription = Industry.ProjectDescription == null ? "" : Industry.ProjectDescription;

                        var IndsDetais = '<table width="100%"> ';
                        if (ProjectName != "")
                            IndsDetais += '<tr><td width="130" valign="top">Project Name</td><td>:&nbsp;' + ProjectName + '</td></tr>';
                        if (Operator != "")
                            IndsDetais += '<tr><td width="130">Operator</td><td>:&nbsp;' + Operator + '</td></tr>';
                        if (Region != "")
                            IndsDetais += '<tr><td width="130">Region</td><td>:&nbsp;' + Region + '</td></tr>';
                        if (ProjectType != "")
                            IndsDetais += '<tr><td width="130">Project Type</td><td>:&nbsp;' + ProjectType + '</td></tr>';
                        if (Commodities != "")
                            IndsDetais += '<tr><td width="130">Commodities</td><td>:&nbsp;' + Commodities + '</td></tr>';
                        if (Status != "")
                            IndsDetais += '<tr><td width="130">Status</td><td>:&nbsp;' + Status + '</td></tr>';
                        if (StartDate != "")
                            IndsDetais += '<tr><td width="130">Start Date</td><td>:&nbsp;' + StartDate + '</td></tr>';
                        if (CompletionDate != "")
                            IndsDetais += '<tr><td width="130">Completion Date</td><td>:&nbsp;' + CompletionDate + '</td></tr>';
                        if (TotalEstimatedCost != "")
                            IndsDetais += '<tr><td width="130">Total Estimated Cost</td><td>:&nbsp;$' + fnNumberFormatting(TotalEstimatedCost) + '</td></tr>';
                        if (WebSite != "")
                            IndsDetais += '<tr><td width="130">WebSite</td><td>:&nbsp;' + WebSite + '</td></tr>';
                        if (ProjectDescription != "")
                            IndsDetais += '<tr><td width="130" valign="top">Project Description</td><td>:&nbsp;' + ProjectDescription + '</td></tr>';

                        IndsDetais += '</table>';
                        $('#IndustryOwner' + IndustryUpdateID).append(IndsDetais);

                        //var Inds = '<table width="100%">' +
                        //            '<tr>' +
                        //            '<td width="50%" valign="top">' +
                        //            '<table>' +
                        //            '<tr><td valign="top">Project Name</td><td>:&nbsp;' + ProjectName + '</td></tr>' +
                        //            '<tr><td>Operator</td><td>:&nbsp;' + Operator + '</td></tr>' +
                        //            '<tr><td>Region</td><td>:&nbsp;' + Region + '</td></tr>' +
                        //            '<tr><td>Project Type</td><td>:&nbsp;' + ProjectType + '</td></tr>' +
                        //            '<tr><td>Commodities</td><td>:&nbsp;' + Commodities + '</td></tr>' +
                        //            '</table>' +
                        //            '</td>' +
                        //            '<td width="50%" valign="top">' +
                        //            '<table>' +
                        //            '<tr><td>Status</td><td>:&nbsp;' + Status + '</td></tr>' +
                        //            '<tr><td>Start Date</td><td>:&nbsp;' + StartDate + '</td></tr>' +
                        //            '<tr><td>Completion Date</td><td>:&nbsp;' + CompletionDate + '</td></tr>' +
                        //            '<tr><td>Total Estimated Cost</td><td>:&nbsp;' + TotalEstimatedCost + '</td></tr>' +
                        //            //'<tr><td>Project Description</td><td>:&nbsp;' + ProjectDescription + '</td></tr>' +
                        //            '</table>' +
                        //            '</td>' +
                        //            '</tr>' +
                        //            '</table>' +
                        //            '<table width="100%" cellspacing="0" cellpadding="0" >' +
                        //            '<tr>' +
                        //            '<td width="130" valign="top">Project Description :' +
                        //             '</td>' +
                        //             '<td valign="top">' + ProjectDescription +
                        //             '</td>' +
                        //            '</tr>' +
                        //            '</table>';
                        // $('#IndustryOwner' + IndustryUpdateID).append(Inds);

                        $("#mainLoader").hide();
                    }
                    catch (err) {
                        $("#mainLoader").hide();
                        $("#txtSearch").val("");
                    }
                },
            });
        }
    }
}

function getHtmlFromObjectDocument(companyDocuments, docsAccordian, Owner) {

    var companyID = companyDocuments.CompanyID == null ? "" : companyDocuments.CompanyID;
    var documentID = companyDocuments.DocumentID == null ? "" : companyDocuments.DocumentID;
    var documentname = companyDocuments.DocumentTitle == null ? "" : companyDocuments.DocumentTitle;
    var FilePath = companyDocuments.FilePath == null ? "" : companyDocuments.FilePath;

    var Documentdiv = '<div class="accordion-group" style="border:1.5px solid #EEEEEE !important;">' +
        '<div class="accordion-heading">' +
        '<table>' +
        '<tr>' +
        '<td width="460px">' +
        '<a target="_parent" href="' + 'http://www.energymapit.com/CompanyProfile/getDocument?FilePath=' + FilePath + '&DocumentName=' + documentname + '">' + documentname + '</a>' +
        '</td>' +
        '</tr>' +
        '</table>' +
        '</div>' +
        '</div>';
    return $(Documentdiv);
}

function setEntitiesName(shortEntities) {

    if (shortEntities != null && shortEntities != "") {
        var Entities = shortEntities.split(",");
        var EntityName;
        for (x in Entities) {
            var Entity = EntitiesArray[0][Entities[x].trim()];
            if (x == 0)
                EntityName = Entity;
            else
                EntityName = EntityName + "," + Entity;
        }
        return EntityName;
    }
    else
        return "";
}

function goToByScroll(id) {
    //alert(id);
    id = id.replace("link", "");
    var total;
    var firstDivHeight = $("#container").height();
    var secondDivHeight = $("#companycompownertab").height();
    var thirdDivHeight = $("#companyfacownertab").height();
    var fourthDivHeight = $("#companysysownertab").height();
    var fifthDivHeight = $("#companypowerownertab").height();
    var sixDivHeight = $("#companycontacttab").height();
    var sevenDivHeight = $("#companytransmissiontab").height();
    var eightDivHeight = $("#companyindustrytab").height();
    if (id == 1) {
        total = 0;
    }
    if (id == 2) {
        total = firstDivHeight + 20 + 30;
    }
    if (id == 3) {
        total = firstDivHeight + secondDivHeight + 20 + 30;
    }
    if (id == 4) {
        total = firstDivHeight + secondDivHeight + thirdDivHeight + 35 + 30;
    }
    if (id == 5) {
        total = firstDivHeight + secondDivHeight + thirdDivHeight + fourthDivHeight + 45 + 30;
    }
    if (id == 6) {
        total = firstDivHeight + secondDivHeight + thirdDivHeight + fourthDivHeight + fifthDivHeight + 55 + 30;
    }
    if (id == 7) {
        //total = firstDivHeight + secondDivHeight + thirdDivHeight + fourthDivHeight + fifthDivHeight + sixDivHeight + 65;
        total = firstDivHeight + secondDivHeight + thirdDivHeight + fourthDivHeight + fifthDivHeight + 55 + 0;
    }
    if (id == 8) {
        total = firstDivHeight + secondDivHeight + thirdDivHeight + fourthDivHeight + fifthDivHeight + sixDivHeight + sevenDivHeight + 75 + 30;
    }
    if (id == 9) {
        total = firstDivHeight + secondDivHeight + thirdDivHeight + fourthDivHeight + fifthDivHeight + sixDivHeight + sevenDivHeight + eightDivHeight + 30;
    }
    //$("#companymaintab").scrollTop(parseFloat(total),'slow');
    // Scroll
    // $("#companymaintab").animate({ scrollTop: parseFloat(total) }, 'slow');
    $("#modal-bodyCompany").animate({ scrollTop: parseFloat(total) }, 'slow');
}

function initialize_map(Owner, PowerID) {
    lat = txt_lat;
    lng = txt_long;
    geocoderProfile = new google.maps.Geocoder();
    infowindowProfile = new google.maps.InfoWindow();
    var latlng = new google.maps.LatLng(lat, lng);
    var mapOptions_Setup = {
        zoom: 13,
        center: latlng,
        mapTypeControl: false,
        disableDefaultUI: false,
        mapTypeId: google.maps.MapTypeId.HYBRID,
        streetViewControl: false
    };
    var MapDiv2 = document.getElementById(Owner + "map_canvas_plus2" + PowerID);
    mapB = new google.maps.Map(MapDiv2, mapOptions_Setup);
    codeLatLng();
    google.maps.event.trigger(mapB, 'load');
    //google.maps.event.addDomListener(window, 'load', initialize_map);
}

function codeLatLng() {
    var latlng = new google.maps.LatLng(lat, lng);
    geocoderProfile.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                mapB.setZoom(16);
                markerProfile = new google.maps.Marker({
                    position: latlng,
                    map: mapB
                });
                // infowindowProfile.setContent(results[1].formatted_address);
                //infowindowProfile.open(mapB, markerProfile);
            }
        } else {

        }
    });
}

function getHtmlForPowerUnitTable(PowerUnits, i) {
    var Table = "";
    var powerID = PowerUnits.PowerID == null ? "" : PowerUnits.PowerID;
    var GenID = PowerUnits.GenID == null ? "" : PowerUnits.GenID;
    var FuelType = PowerUnits.FuelType == null ? "" : PowerUnits.FuelType;
    var Status = PowerUnits.Status == null ? "" : PowerUnits.Status;
    var NamePlate = parseFloat(PowerUnits.NamePlateCapacity) > 0 ? PowerUnits.NamePlateCapacity + "MW" : "";
    var Proposed = parseFloat(PowerUnits.ProposedCapacity) > 0 ? PowerUnits.ProposedCapacity + "MW" : "";
    var Retired = parseFloat(PowerUnits.RetiredCapacity) > 0 ? PowerUnits.RetiredCapacity + "MW" : "";
    var Year = PowerUnits.YearInService == null ? "" : PowerUnits.YearInService;
    var YearRetired = PowerUnits.YearRetired == null || PowerUnits.YearRetired == "1" ? "" : PowerUnits.YearRetired;

    var tableTH = '<tr><th>Generator ID</th><th>Fuel Type</th><th>Status</th><th>Name Plate Capacity</th><th>Proposed Capacity</th><th>Retired Capacity</th><th>Year In Service</th><th>Year Retired</th></tr>';
    var tableTD = '<tr><td style="text-align:center">' + GenID + '</td>' +
        '<td style="text-align:center">' + FuelType + '</td>' +
        '<td style="text-align:center">' + Status + '</td>' +
        '<td style="text-align:center">' + NamePlate + '</td>' +
        '<td style="text-align:center">' + Proposed + '</td>' +
        '<td style="text-align:center">' + Retired + '</td>' +
        '<td style="text-align:center">' + Year + '</td>' +
        '<td style="text-align:center">' + YearRetired + '</td></tr>';
    if (i == 0)
        Table = tableTH + tableTD;
    else
        Table = tableTD;

    return $(Table);
}
//Company Profile Page Code Finish