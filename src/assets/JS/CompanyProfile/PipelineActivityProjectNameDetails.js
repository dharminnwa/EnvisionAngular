// var AmazonAPiURL = 'https://avp8hf6otb.execute-api.us-east-1.amazonaws.com/Prod';
var AmazonAPiURL = 'https://nqzkggqnbb.execute-api.us-east-1.amazonaws.com/Prod';
var NodeAPI = 'https://node.envisionmaps.net';
var jsonSuggestionData = null;
$(window).load(function () {
    // GetAllCompanies();
    var qs = getQueryStrings();
    var id = 0;
    if (qs) {
        id = qs["t"];
    }
    if (id) {
        setTimeout(function () { ShowProjectNameModel(id); }, 2000);

    }
    else {
        //ShowEmptyPlantOperator();
        // $("#powerPlantsTestLoader").hide();
        $("#divinfo").html("");
        $("#divinfo").html("No Data Found!");
        hidePageLoadingTest();
    }
});
Date.prototype.yyyymmdd = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based         
    var dd = this.getDate().toString();
    return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);
};
Date.prototype.mmddyyyy = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based         
    var dd = this.getDate().toString();
    return (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]) + "-" + yyyy;
};
function showCompanyDataModalTest(CompanyId) {
    var URL = window.location.href;
    var Path = window.location.pathname.replace("PipelineActivityProjectName.html", "CompanyProfileDetail.html");
    var origin = window.location.origin;
    var LinkURL = origin + Path;
    LinkURL = LinkURL + "?t=" + CompanyId;
    //window.open(LinkURL, '_blank', 'location=yes,height=600,width=1200,scrollbars=yes,status=yes');
}
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

function ShowProjectNameModel(ID) {
    try {
        showPageLoadingTest()
        $.ajax({
            type: "GET",
            url: NodeAPI + "/api/PipelineActivity/SearchPipelineActivities",
            data: { ID: ID },
            // dataType: "json",
            // async: true,
            success: function (result) {
                result = result.SearchPipelineActivities
                var divinfo = $("#divinfo");
                divinfo.html("");
                var html = PipelineHTML(result, 1);
                divinfo.html(html);
                $("#modal-bodyProjectNameData").css({ 'border': '1px solid #CBCBCB', 'padding': '5px 5px 5px 5px', '-webkit-border-radius': '4px', '-moz-border-radius': '4px', 'border-radius': '4px' });
                hidePageLoadingTest();
            },
            error: function (data) {
                hidePageLoadingTest();
            }
        });
    } catch (e) {
        console.log(e.message);
    }

}
function GetAllCompanies() {
    $.ajax({
        //url: "/CompanyProfile/getJsonParentCompany",
        url: AmazonAPiURL + "/api/CompanyProfile/getJsonParentCompany",
        data: {},
        dataType: 'json',
        cache: true,
        type: 'GET',
        async: false,
        success: function (data) {
            //var result = JSON.parse(JSON.stringify(data));
            //var resultData = JSON.parse(result.getCompaniesForJsonFilesResult);
            var resultData = JSON.parse(data);
            jsonSuggestionData = JSON.parse(resultData.parentChildCompany);
        },
        error: function (data) {
        }
    });
}
function showPageLoadingTest() { $("#mainLoader").show(); }

function hidePageLoadingTest() { $("#mainLoader").hide(); }
function PipelineHTML(detail, index) {
    var startdate = detail.ProjectStartDate != null || detail.ProjectStartDate != undefined ? new Date(detail.ProjectStartDate).mmddyyyy() : "N/A";
    var enddate = detail.ProjectFinishDate != null || detail.ProjectFinishDate != undefined ? new Date(detail.ProjectFinishDate).mmddyyyy() : "N/A";
    var updateddate = detail.UpdatedDate != null || detail.UpdatedDate != undefined ? new Date(detail.UpdatedDate).mmddyyyy() : "N/A";
    var contactName = detail.Contact;
    var ContactPhone = detail.ConPhone;
    var ProjectState = detail.StateName;
    if (!contactName) {
        contactName = "";
    }
    if (!ContactPhone) {
        ContactPhone = "";
    }
    if (!ProjectState) {
        ProjectState = "";
    }
    var Cost = detail.ProjectCost;
    if (!Cost) {
        Cost = "";
    }
    var div = "<div class='search-info' id='ActivityProjectBox' style='margin-left:0px;'>" +
        "<div class='row-fluid'><div class='span12'> <div class='span8'  style='font-size:20px;'>" + detail.MRProjectName + "</div><div class='span4 text-right'style='font-size: 15px;'><b>Project State:</b>" + ProjectState + "</div></div></div>"
        +
        "<p style='margin-top: 2%;font-size: 15px; '>" +
        "<b>Last Updated : </b><span style='padding-right:10px'>" + updateddate + "</span>" +
        "<b>Status : </b><span style='padding-right:10px'>" + detail.Status + "</span>";
    div += "<b>Estimate : </b><span style='padding-right:10px'> $" + Cost.toLocaleString() + ".00" + "</span>";

    div += "<b>Estimate Start Date : </b><span style='padding-right:10px'>" + startdate + "</span>" +
        "<b>Estimate Finish Date : </b><span style='padding-right:10px'>" + enddate + " " +
        "<p>" +
        "<div class='row-fluid'style=' margin-top: 2%;; '><div class='span12'><div class='span3 text-left' style='font-size: 15px; '><b>Contact : </b><span style='padding-right:10px'>" + contactName + "</span></div>" +
        "<div class='span3 text-left' style='font-size: 15px; '><b>Phone : </b><span style='padding-right:10px'>" + ContactPhone + "</span> </div>" +
        "<div class='span6'></div>"
        + "</div> </div>" +
        "<div><p style='font-size: 15px; font-family: sans-serif; '>" + detail.Description + "</p></div>";
    var holdingCompaines;
    var holdingStates;
    var holdingCities;
    var holdingCountries;
    var holdingPhones;
    var CompanyId;

    if (detail.MRHoldingCo)
        holdingCompaines = detail.MRHoldingCo.toString().split("?");

    if (detail.Hstate)
        holdingStates = detail.Hstate.toString().split("?");

    if (detail.WebSite)
        holdingWebsites = detail.WebSite.toString().split("?");

    if (detail.Hcity)
        holdingCities = detail.Hcity.toString().split("?");

    if (detail.Hcountry)
        holdingCountries = detail.Hcountry.toString().split("?");

    if (detail.Hphone)
        holdingPhones = detail.Hphone.toString().split("?");

    if (detail.CompanyID)
        CompanyId = detail.CompanyID.toString().split("?");

    if ((holdingCompaines || holdingCompaines) &&
        holdingCompaines.length > 0) {
        var id = "r" + index;
        div += "<div class='more-section' style=' padding-top: 25px; '>";
        div += "<div class='more-desc'>"
        div += "<label style='line-height: 30px; '>" +
            "<span style='text-decoration: underline; font-weight: bold;width: 16%;'>Holding Company</span>" +
            "<span style='text-decoration: underline; font-weight: bold;'>City</span>" +
            "<span style='text-decoration: underline; font-weight: bold;'>State</span>" +
            "<span style='text-decoration: underline; font-weight: bold;'>Country</span>" +
            "<span style='text-decoration: underline; font-weight: bold;'>Phone</span>" +
            "<span style='text-decoration: underline; font-weight: bold;'>Website</span>" +
            "</label>";

        for (var x = 0; x < holdingCompaines.length; x++) {
            if (holdingWebsites[x] != undefined) {
                if (holdingWebsites[x].search('http') != -1)
                    holdingWebsites[x] = holdingWebsites[x];
                else
                    holdingWebsites[x] = "http://" + holdingWebsites[x];
            }
            div += "<label style='line-height: 30px; '>";
            div += "<a class=ProjectLink href='javascript:void(0)' onclick='showCompanyDataModalTest(" + CompanyId[x] + ")'><span style='width: 16%;'>" + holdingCompaines[x] + "</span></a>";
            // var company = SearchCompanyInParentList(holdingCompaines[x]);
            // if (company == undefined) {
            //     company = SearchCompanyInChildList(holdingCompaines[x]);
            //     if (company == undefined) {
            //         div += "<a class=ProjectLink href='javascript:void(0)' onclick='showCompanyDataModalTest(" + CompanyId[x] + ")'><span style='width: 16%;'>" + holdingCompaines[x] + "</span></a>";
            //     }
            //     else {
            //         div += "<a class=ProjectLink href='javascript:void(0)' onclick='showCompanyDataModalTest(" + CompanyId[x] + ")'><span style='width: 16%;'>" + holdingCompaines[x] + "</span></a>";
            //     }
            // }
            // else {
            //     //"<a class=ProjectLink href='javascript:void(0)' onclick='showCompanyDataModalTest(" + id + ")'>" + cmpName + "</a>"
            //     div += "<a class=ProjectLink href='javascript:void(0)' onclick='showCompanyDataModalTest(" + CompanyId[x] + ")'><span style='width: 16%;'>" + holdingCompaines[x] + "</span></a>";
            // }
            div += "<span>" + (holdingCities == undefined ? '' :  holdingCities[x] )+ "</span>" +
                "<span>" + ( holdingStates == undefined ? '' : holdingStates[x] ) + "</span>" +
                "<span>" + ( holdingCountries == undefined ? '' : holdingCountries[x] )+ "</span>" +
                "<span>" + (holdingPhones == undefined ? '' : holdingPhones[x]) + "</span>" +
                "<a href='" + (holdingWebsites == undefined ? '' : holdingWebsites[x]) + "' target='_blank' style='font-size:13px;'>" + (holdingWebsites == undefined ? '' : holdingWebsites[x]) + "</a></label>";
        }
        div += "</div></div>";

    }
    div += "</div>";
    return div;
}

function SearchCompanyInChildList(company) {


    var y = undefined;
    if (jsonSuggestionData != null && jsonSuggestionData != undefined && jsonSuggestionData.length > 0) {
        $.each(jsonSuggestionData, function (i, el) {
            if (el.children != null && el.children != undefined && el.children.length > 0) {
                $.each(el.children, function (j, data) {
                    if (data.title == company) {
                        y = data;
                    }
                });
            }
        });
    }
    else {

    }
    return y;
}
function SearchCompanyInParentList(company) {
    var y = undefined;
    if (jsonSuggestionData != null && jsonSuggestionData != undefined && jsonSuggestionData.length > 0) {
        $.each(jsonSuggestionData, function (i, el) {
            if (el.title == company) {
                y = el;
            }
        });
    }
    return y;
}