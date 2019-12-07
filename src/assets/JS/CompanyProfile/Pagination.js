var records = null;

var CompanyOwnerRecords = null;
var CompanyOperRecords = null;
var FacOwnerRecords = null;
var FacOperRecords = null;
var SystemOwnerRecord = null;
var SystemOperRecords = null;
var PowerOwnerRecords = null;
var PowerOperRecord = null;
var TransProjRecords = null;
var IndusUpRecords = null;
var ContactsRecords = null;

function ApplyPaging(PagingID, DivPagingID, CurrentPage, ShowPerPage, NoOfPages, NoOfItems) {
    var html = '<div class="highlight-toolbar" id="Custom' + DivPagingID + '">' +
               '<input type="hidden" id="' + CurrentPage + '" />' +
               '<input type="hidden" id="' + ShowPerPage + '" />' +
               '<input type="hidden" id="' + NoOfPages + '" />' +
               '<input type="hidden" id="' + NoOfItems + '" />' +
               '<div class="pull-left">' +
               '<div class="btn-toolbar">' +
               '<div class="btn-group">' +
               '<div class="pagination pagination-custom" id="' + DivPagingID + '"></div>' +
               '</div>' +
               '</div>' +
               '</div>' +
               '</div>';
    $(html).insertAfter($("#" + PagingID));
}
function RemoveOld(PagingID) {
    var DivPagingID = PagingID + 'Paging';
    $("#Custom" + DivPagingID).html("");
    $("#Custom" + DivPagingID).remove();
    RemoveDataSource(PagingID);
}

function Paginate(per_page, data, PagingID) {
    RemoveOld(PagingID);
    if (data != null && data.length > per_page) {
        AssignDataSource(PagingID, data);
        var DivPagingID = PagingID + 'Paging';
        var CurrentPage = DivPagingID + 'CurrentPage';
        var ShowPerPage = DivPagingID + 'ShowPerPage';
        var NoOfPages = DivPagingID + 'NoOfPages';
        var NoOfItems = DivPagingID + 'NoOfItems';

        ApplyPaging(PagingID, DivPagingID, CurrentPage, ShowPerPage, NoOfPages, NoOfItems);

        var show_per_page = per_page;
        var number_of_items = data.length;
        var number_of_pages = Math.ceil(number_of_items / show_per_page);

        //records = data;

        //set the value of our hidden input fields

        $('#' + ShowPerPage).val(show_per_page);
        $('#' + NoOfItems).val(number_of_items);
        $('#' + NoOfPages).val(number_of_pages);
        $('#' + CurrentPage).val(0);

        PageLinks(number_of_pages, DivPagingID);
        AppendPageHtml(0, DivPagingID);
    }
    else {
        SetHtml(PagingID, data);
    }
}

function PageLinks(number_of_pages, DivPagingID) {
    var navigation_html = '<ul>';
    if (parseInt(number_of_pages, 10) > 1) {
        navigation_html += '<li class="prev">';
        navigation_html += '<a class="pageIndex" href="javascript:GoToPage(0,\'' + DivPagingID + '\')">First</i></a>';
        navigation_html += '</li>';
    }
    if (parseInt(number_of_pages, 10) > 1) {
        navigation_html += '<li class="prev first">';
        navigation_html += '<a class="pageIndex" href="javascript:PreviousPage(\'' + DivPagingID + '\');">Prev</a>';
        navigation_html += '</li>';
    }
    var current_link = 0;
    while (number_of_pages > current_link) {
        if (current_link <= 10) {
            navigation_html += '<li class="' + DivPagingID + current_link + '">';
            navigation_html += '<a class="pageIndex" href="javascript:GoToPage(' + current_link + ',\'' + DivPagingID + '\')" longdesc="' + current_link + '">' + (current_link + 1) + '</a>';
            navigation_html += '</li>';
        }
        else {
            navigation_html += '<li class="' + DivPagingID + current_link + '" style="display:none;">';
            navigation_html += '<a class="pageIndex" href="javascript:GoToPage(' + current_link + ',\'' + DivPagingID + '\')" longdesc="' + current_link + '">' + (current_link + 1) + '</a>';
            navigation_html += '</li>';
        }
        current_link++;
    }
    if (parseInt(number_of_pages, 10) > 1) {
        navigation_html += '<li class="last">';
        navigation_html += '<a class="next pageIndex" href="javascript:NextPage(\'' + DivPagingID + '\');">Next</a>';
        navigation_html += '</li>';
    }
    if (parseInt(number_of_pages, 10) > 1) {
        navigation_html += '<li class="last">';
        navigation_html += '<a class="next pageIndex" href="javascript:GoToPage(' + (parseInt(number_of_pages) - 1) + ',\'' + DivPagingID + '\')">Last</a>';
        navigation_html += '</li>';
    }
    navigation_html += '</ul>';

    $('#' + DivPagingID).html(navigation_html);
}

function PreviousPage(DivPagingID) {
    new_page = parseInt($('#' + DivPagingID + 'CurrentPage').val()) - 1;
    if (!ValidatePageNumber(new_page, DivPagingID))
        return;
    if ($(DivPagingID + ' .active').prev(DivPagingID + ' .prev').length != true) {
        GoToPage(new_page, DivPagingID);
    }
}
function GoToPage(page_num, DivPagingID) {
    var NoOfPages = parseInt($("#" + DivPagingID + "NoOfPages").val());
    if (page_num == 0) {
        FirstPage(DivPagingID);
    } else if (page_num + 1 == NoOfPages) {
        LastPage(NoOfPages, DivPagingID);
    } else
        PageNumbers(DivPagingID, page_num);

    AppendPageHtml(page_num, DivPagingID);
}
function NextPage(DivPagingID) {
    new_page = parseInt($('#' + DivPagingID + 'CurrentPage').val()) + 1;
    if (!ValidatePageNumber(new_page, DivPagingID))
        return;
    if ($(DivPagingID + ' .active').next(DivPagingID + ' .last').length != true) {
        GoToPage(new_page, DivPagingID);
    }
}

function AppendPageHtml(page_num, DivPagingID) {
    var ShowPerPage = parseInt($("#" + DivPagingID + "ShowPerPage").val());
    var start_from = page_num * ShowPerPage;
    var end_on = start_from + ShowPerPage
    var activate_id = page_num;
    var get_box = document.getElementsByClassName(DivPagingID + page_num);

    //var result = records.slice(start_from, end_on);
    var GridID = DivPagingID.replace("Paging", "");
    var result = GetRecords(GridID, start_from, end_on);

    SetHtml(GridID, result);

    //var FacOwnerTr = "facilityOwnerAccordion";
    //if (typeof (result) != "undefined" && result != null && result.length > 0) {
    //    $('#facilityOwnerAccordion').html("");
    //    for (var i = 0; i < result.length; i++) {
    //        $('#facilityOwnerAccordion').append(getHtmlFromObjectFacOwner(result[i], FacOwnerTr, "facOwner"));
    //    }
    //}

    $("#" + DivPagingID).find('li.active').removeClass("active");
    $(get_box).addClass("active");
    $('#' + DivPagingID + 'CurrentPage').val(page_num);
}

function ValidatePageNumber(new_page, DivPagingID) {
    var NoOfPages = parseInt($("#" + DivPagingID + "NoOfPages").val());
    if (new_page > -1 && new_page < NoOfPages)
        return true;
    else
        return false;
}

function PageNumbers(DivPagingID, page_num) {
    if (page_num > 5) {
        for (var i = page_num; i < page_num + 10 ; i++) {
            $("." + DivPagingID + i).hide();
        }
        for (var i = page_num; i >= page_num - 10 ; i--) {
            $("." + DivPagingID + i).hide();
        }

        var num_before = page_num - 5;
        for (var i = page_num; i >= num_before; i--) {
            $("." + DivPagingID + i).show();
        }
        var num_after = page_num + 5
        for (var i = page_num; i < num_after; i++) {
            $("." + DivPagingID + i).show();
        }
    }
    else {
        for (var i = page_num; i < page_num + 10 ; i++) {
            $("." + DivPagingID + i).hide();
        }
        for (var i = page_num; i >= page_num + 10 ; i--) {
            $("." + DivPagingID + i).hide();
        }
        for (var i = 0; i < 10 ; i++) {
            $("." + DivPagingID + i).show();
        }
    }
}

function FirstPage(DivPagingID) {
    var current = parseInt($('#' + DivPagingID + 'CurrentPage').val());
    for (var i = current; i < current + 10 ; i++) {
        $("." + DivPagingID + i).hide();
    }
    for (var i = current; i > current - 10 ; i--) {
        $("." + DivPagingID + i).hide();
    }
    for (var i = 0; i < 10; i++) {
        $("." + DivPagingID + i).show();
    }
}
function LastPage(Last, DivPagingID) {
    var current = parseInt($('#' + DivPagingID + 'CurrentPage').val());

    if (!ValidatePageNumber(current + 1, DivPagingID))
        return;

    for (var i = current; i < current + 10 ; i++) {
        $("." + DivPagingID + i).hide();
    }
    for (var i = current; i > current - 10 ; i--) {
        $("." + DivPagingID + i).hide();
    }

    var val = Last % 10;
    if (val > 0) {
        var showCount = Last - val;
        for (var i = showCount; i <= Last; i++) {
            $("." + DivPagingID + i).show();
        }
    }
    else {
        var count = Last - 10;
        for (var i = Last; i >= count; i--) {
            $("." + DivPagingID + i).show();
        }
    }
}

function AssignDataSource(GridID, DataSource) {
    switch (GridID) {
        case "companyOwnerAccordion":
            CompanyOwnerRecords = DataSource;
            break;
        case "companyOperatorAccordion":
            CompanyOperRecords = DataSource;
            break;
        case "facilityOwnerAccordion":
            FacOwnerRecords = DataSource;
            break;
        case "facilityOperatorAccordion":
            FacOperRecords = DataSource;
            break;
        case "systemOwnerAccordion":
            SystemOwnerRecord = DataSource;
            break;
        case "systemOperatorAccordion":
            SystemOperRecords = DataSource;
            break;
        case "powerOwnerAccordion":
            PowerOwnerRecords = DataSource;
            break;
        case "powerOperatorAccordion":
            PowerOperRecord = DataSource;
            break;
        case "transmissionAccordion":
            TransProjRecords = DataSource;
            break;
        case "industryAccordion":
            IndusUpRecords = DataSource;
            break;
        case "contactsAccordion":
            ContactsRecords = DataSource;
            break;
    }
}
function RemoveDataSource(GridID) {
    switch (GridID) {
        case "companyOwnerAccordion":
            CompanyOwnerRecords = null;
            break;
        case "companyOperatorAccordion":
            CompanyOperRecords = null;
            break;
        case "facilityOwnerAccordion":
            FacOwnerRecords = null;
            break;
        case "facilityOperatorAccordion":
            FacOperRecords = null;
            break;
        case "systemOwnerAccordion":
            SystemOwnerRecord = null;
            break;
        case "systemOperatorAccordion":
            SystemOperRecords = null;
            break;
        case "powerOwnerAccordion":
            PowerOwnerRecords = null;
            break;
        case "powerOperatorAccordion":
            PowerOperRecord = null;
            break;
        case "transmissionAccordion":
            TransProjRecords = null;
            break;
        case "industryAccordion":
            IndusUpRecords = null;
            break;
        case "contactsAccordion":
            ContactsRecords = null;
            break;
    }
}
function GetRecords(GridID, start_from, end_on) {
    var result;
    switch (GridID) {
        case "companyOwnerAccordion":
            result = CompanyOwnerRecords.slice(start_from, end_on);
            break;
        case "companyOperatorAccordion":
            result = CompanyOperRecords.slice(start_from, end_on);
            break;
        case "facilityOwnerAccordion":
            result = FacOwnerRecords.slice(start_from, end_on);
            break;
        case "facilityOperatorAccordion":
            result = FacOperRecords.slice(start_from, end_on);
            break;
        case "systemOwnerAccordion":
            result = SystemOwnerRecord.slice(start_from, end_on);
            break;
        case "systemOperatorAccordion":
            result = SystemOperRecords.slice(start_from, end_on);
            break;
        case "powerOwnerAccordion":
            result = PowerOwnerRecords.slice(start_from, end_on);
            break;
        case "powerOperatorAccordion":
            result = PowerOperRecord.slice(start_from, end_on);
            break;
        case "transmissionAccordion":
            result = TransProjRecords.slice(start_from, end_on);
            break;
        case "industryAccordion":
            result = IndusUpRecords.slice(start_from, end_on);
            break;
        case "contactsAccordion":
            result = ContactsRecords.slice(start_from, end_on);
            break;
    }
    return result;
}
function SetHtml(GridID, result) {
    switch (GridID) {
        case "companyOwnerAccordion":
            CompanyHTML(GridID, result, "compOwner");
            break;
        case "companyOperatorAccordion":
            CompanyHTML(GridID, result, "compOperator");
            break;
        case "facilityOwnerAccordion":
            FacilityHTML(GridID, result, "facOwner");
            break;
        case "facilityOperatorAccordion":
            FacilityHTML(GridID, result, "facOperator");
            break;
        case "systemOwnerAccordion":
            SystemHTML(GridID, result, "sysOwner");
            break;
        case "systemOperatorAccordion":
            SystemHTML(GridID, result, "sysOperator");
            break;
        case "powerOwnerAccordion":
            PowerHTML(GridID, result, "powOwner");
            break;
        case "powerOperatorAccordion":
            PowerHTML(GridID, result, "powOperator");
            break;
        case "transmissionAccordion":
            TransProjHTML(GridID, result, "transmission");
            break;
        case "industryAccordion":
            IndustryUpdatesHTML(GridID, result, "industry");
            break;
        case "contactsAccordion":
            ContactsHTML(GridID, result);
            break;
    }
}
function CompanyHTML(GridID, result, owner) {
    if (typeof (result) != "undefined" && result != null && result.length > 0) {
        $('#' + GridID).html("");
        for (var i = 0; i < result.length; i++) {
            $('#' + GridID).append(getHtmlFromObjectCompanyOwner(result[i], GridID, owner));
        }
    }
}
function FacilityHTML(GridID, result, owner) {
    if (typeof (result) != "undefined" && result != null && result.length > 0) {
        $('#' + GridID).html("");
        for (var i = 0; i < result.length; i++) {
            $('#' + GridID).append(getHtmlFromObjectFacOwner(result[i], GridID, owner));
        }
    }
}
function SystemHTML(GridID, result, owner) {
    if (typeof (result) != "undefined" && result != null && result.length > 0) {
        $('#' + GridID).html("");
        for (var i = 0; i < result.length; i++) {
            $('#' + GridID).append(getHtmlFromObjectSysOwner(result[i], GridID, owner));
        }
    }
}
function PowerHTML(GridID, result, owner) {
    if (typeof (result) != "undefined" && result != null && result.length > 0) {
        $('#' + GridID).html("");
        for (var i = 0; i < result.length; i++) {
            $('#' + GridID).append(getHtmlFromObjectPowerOwner(result[i], GridID, owner));
        }
    }
}
function TransProjHTML(GridID, result, owner) {
    if (typeof (result) != "undefined" && result != null && result.length > 0) {
        $('#' + GridID).html("");
        for (var i = 0; i < result.length; i++) {
            $('#' + GridID).append(getHtmlFromObjectTransmission(result[i], GridID, owner));
        }
    }
}
function IndustryUpdatesHTML(GridID, result, owner) {
    if (typeof (result) != "undefined" && result != null && result.length > 0) {
        $('#' + GridID).html("");
        for (var i = 0; i < result.length; i++) {
            $('#' + GridID).append(getHtmlFromObjectIndustry(result[i], GridID, owner));
        }
    }
}
function ContactsHTML(GridID, result) {
    if (typeof (result) != "undefined" && result != null && result.length > 0) {
        $('#' + GridID).html("");
        for (var i = 0; i < result.length; i++) {
            $('#' + GridID).append(getHtmlFromObjectContact(result[i]));
        }
    }
}