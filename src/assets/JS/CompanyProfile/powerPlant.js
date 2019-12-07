
var PowerPlantsData;
var DataFilled = false;
var TabClicked = false;
var OnceDoneFill = false;
var PageDropDown = '<span class="jsgrid-pager"> <select id="PowerPlantTestpager" class="PowerPlantTestpager"><option selected="">25</option> <option >50</option><option>100</option> <option>500</option></select>  items Per Page</span>';
// var AmazonAPiURL = 'https://avp8hf6otb.execute-api.us-east-1.amazonaws.com/Prod';
var AmazonAPiURL = 'https://nqzkggqnbb.execute-api.us-east-1.amazonaws.com/Prod';

(function ($) {
    var templates = {
        PowerPlantGrid: ' <div class="loader" id="powerPlantsTestLoader"> <img id="loading-image" src="css/images/ajax-loader.GIF" alt="Loading..." height="100" width="100" /><br /></div>' +
    '<div class="row-fluid"><div class="span12"><div class="box box-color box-bordered">' +
                '<div class="box-title" style=" border-color: #368ee0 !important; border: 2px solid #ddd; padding:0px;"></div><div class="box-content nopadding box-border"><div class="highlight-toolbar">' +
                        '<p class="PrjHeader" style=" font-size: 25px; padding-top: 10px; font-weight: bold; ">POWER PLANTS</p>' +
            '<div class="row-fluid"><div class="span12 data_power_plants_filters"> <div class="span2 ghub_data_form_row"> <label>State</label><select multiple="multiple" name="power_Test_state" id="power_Test_state" class="span12 multiplechoice state"></select></div> <div class="span2 ghub_data_form_row"><label>NERC Region</label><select multiple="multiple" name="power_Test_nerc_region" id="power_Test_nerc_region" class="span12 multiplechoice nerc_region"></select></div><div class="span2 ghub_data_form_row"> <label>Primary Plant Fuel</label><select multiple="multiple" name="power_Test_primary_fuel" id="power_Test_primary_fuel" class="span12 multiplechoice primary_fuel"></select></div> <div class="span2 ghub_data_form_row"><label>Sector</label><select multiple="multiple" name="power_Test_sector_number" id="power_Test_sector_number" class="span12 multiplechoice sector_number"></select></div>' +
             ' <div class="span2 ghub_data_form_row"><label>ISO/RTO</label><select multiple="multiple" name="power_Test_iso_rto" id="power_Test_iso_rto" class="span12 multiplechoice iso_rto_code">  ' +
  '<option value="ALL" selected="">All</option>' +
                '<option value="CAISO">CAISO</option>' +
                '<option value="ERCOT">ERCOT</option>' +
                '<option value="ISONE">ISONE</option>' +
                '<option value="MISO">MISO</option>' +
                '<option value="NYISO">NYISO</option>' +
                '<option value="PJM">PJM</option>' +
                '<option value="SPP">SPP</option>' +
                '<option value="OIESO">OIESO</option>' +
                '<option value="AESO">AESO</option>' +
                '<option value="NBSO">NBSO</option></select></div>' +
        '<div class="span3" style="margin-left: 10px !important"><div class="span12 ghub_filter_panel_row"><label class="span6 text-center"><input type="checkbox" name="chkRegulated_Test" id="chkRegulated_Test" title="Regulated" value="RE" class="multicheckbox regulatory_status" checked="">' +
'Regulated</label><label class="span6 text-center"><input type="checkbox" name="chkNonRegulated_Test" id="chkNonRegulated_Test" title="Non-Regulated" value="NonRE" class="multicheckbox regulatory_status" checked="">Non-Regulated' +
'</label></div><div class="span12 text-right"><div class="tofrom_ghub_header">From</div><div class="tofrom_ghub_header">To</div></div>' +
'<div class="span12 tofrom_ghub_panel_row"><div class="span4"><label style="float: left">Capacity MW</label></div>' +
'<div class="span8 text-right"><input type="text" name="txtCapacityFrom_Test" id="txtCapacityFrom_Test" title="" value="0" class="text capacity_from">' +
'<input type="text" name="txtCapacityTo_Test" id="txtCapacityTo_Test" title="" value="99999" class="text capacity_to"></div></div>' +
'<div class="span12 tofrom_ghub_panel_row"><div class="span6"><label style="float: left">Net Generation GWh</label></div>' +
'<div class="span6 text-right"><input type="text" name="txtGenerationFrom_Test" id="txtGenerationFrom_Test" title="" value="0" class="text generation_from">' +
'<input type="text" name="txtGenerationTo_Test" id="txtGenerationTo_Test" title="" value="99999" class="text generation_to"></div></div></div>' +
'<div class="span12 text-left" style="margin-left: 5px"><label>Hold down ctrl and click to select more than one option.</label></div>' +
 '<div class="span12" style="margin-left: 5px"><div class="span3"><input id="btnPowerClearFilter_Test" onclick="ClearTest_PowerPlantsFilter();" type="button" name="action" value="Clear" class="btn btn-primary" style="font-weight: normal" /></div>' +
 '<div class="span6 autocomplete" style="text-align: center;"><input type="text" style="height: 100%; width: 50%;" id="Search_TestPowerPlant" placeholder="Search Utility or Plant name" class="NewsArticleSearch"><input id="btnFilter_TestUtilityAndPowerplant" onclick="SearchUtilityandPowerPlant();" type="button" name="action" value="Search" class="btn btn-primary" style="font-weight: normal; margin-left: 1%;margin-top: -10px;" /></div>' +
 '<div class="span3 text-right"><input id="btnPowerApplyFilter_Test" type="button" name="btnPowerApplyFilter_Test"  onclick="ApplyTest_PowerPlantsFilter();"value="Apply Filters" class="btn btn-primary" style="font-weight: normal"></div></div>' +
            '</div> <span class="jsgrid-pager">Show&nbsp;<select id="PowerPlantTestpager" class="PowerPlantTestpager"><option selected="">25</option> <option>50</option><option>100</option> <option>500</option></select> <span style="display:  table-cell;vertical-align:  middle;">items Per Page<span></span></span></span><div id="PowerPlantsGridTest"> </div><div class="span12" style="margin-left: 0px;"><div id="externalPager" class="span4 external-pager jsgrid-pager-container" style="text-align: center;width: auto;"></div><div class="span6" style="margin-left: 0px;padding-top: 6px;display:none" id="PPTPageDropdown"> </div></div></div>' +
            '<div id="modal-PlantsOperator_Test" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;"> <div class="modal-content"><div class="modal-header" style="border-bottom: 0px;">' +
            '<button type="button" class="close" data-dismiss="modal">&times;</button> </div><div id="modal-bodyPlantOperator_Test" class="modal-body"> </div></div></div> ' +
            '<div id="modal-PowerPlantPopup_Test" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;"><div class="modal-content"><div class="modal-header btnModalClose" style="border-bottom: 0px;"><button type="button" class="close" data-dismiss="modal">&times;</button>' +
        '</div><div id="modal-bodyPowerPlantPopup_Test" class="modal-body" style="overflow-y: visible;max-height: 0px;" ><div class="row-fluid"><span class="PlantOperatorHeader" id="PlantOperatorHeaderName"></span></div> <br /><div class="row-fluid"><div class="span12"><div class="span4" id="span6_1">' +
          '</div> <div class="span4" id="span6_2"> </div> <div class="span4" id="span6_3"> <div class="reg_bg" style="height: 350px; width: 100%"><div id="Test_map_canvas" style="width: 100%; height: 100%;"></div></div></div></div></div><div id="TestLoadTable"></div></div></div></div>'
    }


    $.fn.PowerPlant = function (option) {
        var defaults = {
            onSuccess: function (data) { console.log([200, 'OK']); },
            onError: function (data) { console.log([500, 'Error']); }
        };
        (function () {
            // //var po1 = null;
            // //var s1 = null;            
            // var fileref = document.createElement('link')
            // fileref.setAttribute("rel", "stylesheet")
            // ////fileref.setAttribute("type", "text/css")
            // fileref.setAttribute("href", "css/jquery.mCustomScrollbar.css")
            // if (typeof fileref != "undefined")
            //     s1 = $('#headElement')[0];
            // $(s1).append(fileref);

            // var fileref = document.createElement('link')
            // fileref.setAttribute("rel", "stylesheet")
            // //////fileref.setAttribute("type", "text/css")
            // fileref.setAttribute("href", "css/jquery.ui.theme.css")
            // if (typeof fileref != "undefined")
            //     s1 = $('#headElement')[0];
            // $(s1).append(fileref);

            // var fileref = document.createElement('link')
            // fileref.setAttribute("rel", "stylesheet")
            // ////fileref.setAttribute("type", "text/css")
            // fileref.setAttribute("href", "css/style.css")
            // if (typeof fileref != "undefined")
            //     s1 = $('#headElement')[0];
            // $(s1).append(fileref);

            // var fileref = document.createElement('link')
            // fileref.setAttribute("rel", "stylesheet")
            // ////fileref.setAttribute("type", "text/css")
            // fileref.setAttribute("href", "css/themes.css")
            // if (typeof fileref != "undefined")
            //     s1 = $('#headElement')[0];
            // $(s1).append(fileref);

            // var fileref = document.createElement('link')
            // fileref.setAttribute("rel", "stylesheet")
            // ////fileref.setAttribute("type", "text/css")
            // fileref.setAttribute("href", "css/demos.css")
            // if (typeof fileref != "undefined")
            //     s1 = $('#headElement')[0];
            // $(s1).append(fileref);

            // var fileref = document.createElement('link')
            // fileref.setAttribute("rel", "stylesheet")
            // ////fileref.setAttribute("type", "text/css")
            // fileref.setAttribute("href", "css/jsgrid.css")
            // if (typeof fileref != "undefined")
            //     s1 = $('#headElement')[0];
            // $(s1).append(fileref);

            // var fileref = document.createElement('link')
            // fileref.setAttribute("rel", "stylesheet")
            // ////fileref.setAttribute("type", "text/css")
            // fileref.setAttribute("href", "css/theme.css")
            // if (typeof fileref != "undefined")
            //     s1 = $('#headElement')[0];
            // $(s1).append(fileref);

            // var fileref = document.createElement('link')
            // fileref.setAttribute("rel", "stylesheet")
            // ////fileref.setAttribute("type", "text/css")
            // fileref.setAttribute("href", "css/ui.dynatree.css")
            // if (typeof fileref != "undefined")
            //     s1 = $('#headElement')[0];
            // $(s1).append(fileref);

            // var fileref = document.createElement('link')
            // fileref.setAttribute("rel", "stylesheet")
            // ////fileref.setAttribute("type", "text/css")
            // fileref.setAttribute("href", "css/chosen.css")
            // if (typeof fileref != "undefined")
            //     s1 = $('#headElement')[0];
            // $(s1).append(fileref);

            // var fileref = document.createElement('link')
            // fileref.setAttribute("rel", "stylesheet")
            // ////fileref.setAttribute("type", "text/css")
            // fileref.setAttribute("href", "css/icheck/all.css")
            // if (typeof fileref != "undefined")
            //     s1 = $('#headElement')[0];
            // $(s1).append(fileref);

            // var fileref = document.createElement('link')
            // fileref.setAttribute("rel", "stylesheet")
            // ////fileref.setAttribute("type", "text/css")
            // fileref.setAttribute("href", "css/icon.css")
            // if (typeof fileref != "undefined")
            //     s1 = $('#headElement')[0];
            // $(s1).append(fileref);

            // var fileref = document.createElement('link')
            // fileref.setAttribute("rel", "stylesheet")
            // ////fileref.setAttribute("type", "text/css")
            // fileref.setAttribute("href", "css/themes.css")
            // if (typeof fileref != "undefined")
            //     s1 = $('#headElement')[0];
            // $(s1).append(fileref);           
            // var fileref = document.createElement('link')
            // fileref.setAttribute("rel", "stylesheet")
            // ////fileref.setAttribute("type", "text/css")
            // fileref.setAttribute("href", "css/jquery.ui.theme.css")
            // if (typeof fileref != "undefined")
            //     s1 = $('#headElement')[0];
            // $(s1).append(fileref);

            // var fileref = document.createElement('link')
            // fileref.setAttribute("rel", "stylesheet")
            // ////fileref.setAttribute("type", "text/css")
            // fileref.setAttribute("href", "css/jquery-ui.css")
            // if (typeof fileref != "undefined")
            //     s1 = $('#headElement')[0];
            // $(s1).append(fileref);

            // var fileref = document.createElement('link')
            // fileref.setAttribute("rel", "stylesheet")
            // ////fileref.setAttribute("type", "text/css")
            // fileref.setAttribute("href", "css/bootstrap-responsive.min.css")
            // if (typeof fileref != "undefined")
            //     s1 = $('#headElement')[0];
            // $(s1).append(fileref);

            // var fileref = document.createElement('link')
            // fileref.setAttribute("rel", "stylesheet")
            // ////fileref.setAttribute("type", "text/css")
            // fileref.setAttribute("href", "css/bootstrap.min.css")
            // if (typeof fileref != "undefined")
            //     s1 = $('#headElement')[0];
            // $(s1).append(fileref);

            // var fileref = document.createElement('link')
            // fileref.setAttribute("rel", "stylesheet")
            // //fileref.setAttribute("type", "text/css")
            // fileref.setAttribute("href", "css/style.css")
            // if (typeof fileref != "undefined")
            //     s1 = $('#headElement')[0];
            // $(s1).append(fileref);

            // var fileref = document.createElement('link')
            // fileref.setAttribute("rel", "stylesheet")
            // //fileref.setAttribute("type", "text/css")
            // fileref.setAttribute("href", "css/CompanyProfile/PowerPlants.css")
            // if (typeof fileref != "undefined")
            //     s1 = $('#headElement')[0];
            // $(s1).append(fileref);

            // var fileref = document.createElement('script')
            //// fileref.setAttribute("type", "text/javascript")
            // fileref.setAttribute("src", 'http://maps.googleapis.com/maps/api/js?v=2&key=AIzaSyCdCw-UMwdjTOzXPaelRVOSSzvhpspTgCU&sensor=false')
            // if (typeof fileref != "undefined")
            //     s4 = document.getElementsByTagName('script')[0];
            // $(s4.parentNode).append(fileref);

            // var fileref = document.createElement('script')
            //// fileref.setAttribute("type", "text/javascript")
            // fileref.setAttribute("src", 'JS/jquery.mCustomScrollbar.concat.min.js')
            // if (typeof fileref != "undefined")
            //     s4 = document.getElementsByTagName('script')[0];
            // $(s4.parentNode).append(fileref);

            // var fileref = document.createElement('script')
            //// fileref.setAttribute("type", "text/javascript")
            // fileref.setAttribute("src", 'JS/jsgrid.min.js')
            // if (typeof fileref != "undefined")
            //     s4 = document.getElementsByTagName('script')[0];
            // $(s4.parentNode).append(fileref);           

            // var fileref = document.createElement('script')
            //// fileref.setAttribute("type", "text/javascript")
            // fileref.setAttribute("src", 'JS/UtilityLibs.js')
            // if (typeof fileref != "undefined")
            //     s4 = document.getElementsByTagName('script')[0];
            // $(s4.parentNode).append(fileref);

            // var fileref = document.createElement('script')
            //// fileref.setAttribute("type", "text/javascript")
            // fileref.setAttribute("src", 'JS/moment.js')
            // if (typeof fileref != "undefined")
            //     s4 = document.getElementsByTagName('script')[0];
            // $(s4.parentNode).append(fileref);

            // var fileref = document.createElement('script')
            //// fileref.setAttribute("type", "text/javascript")
            // fileref.setAttribute("src", 'JS/chosen.jquery.min.js')
            // if (typeof fileref != "undefined")
            //     s4 = document.getElementsByTagName('script')[0];
            // $(s4.parentNode).append(fileref);

            // var fileref = document.createElement('script')
            //// fileref.setAttribute("type", "text/javascript")
            // fileref.setAttribute("src", 'JS/jquery.icheck.min.js')
            // if (typeof fileref != "undefined")
            //     s4 = document.getElementsByTagName('script')[0];
            // $(s4.parentNode).append(fileref);

            // var fileref = document.createElement('script')
            //// fileref.setAttribute("type", "text/javascript")
            // fileref.setAttribute("src", 'JS/fullcalendar.min.js')
            // if (typeof fileref != "undefined")
            //     s4 = document.getElementsByTagName('script')[0];
            // $(s4.parentNode).append(fileref);

            // var fileref = document.createElement('script')
            //// fileref.setAttribute("type", "text/javascript")
            // fileref.setAttribute("src", 'JS/bootstrap.min.js')
            // if (typeof fileref != "undefined")
            //     s4 = document.getElementsByTagName('script')[0];
            // $(s4.parentNode).append(fileref);

            // var fileref = document.createElement('script')
            //// fileref.setAttribute("type", "text/javascript")
            // fileref.setAttribute("src", 'JS/jquery.ui.core.min.js')
            // if (typeof fileref != "undefined")
            //     s4 = document.getElementsByTagName('script')[0];
            // $(s4.parentNode).append(fileref);

            // var fileref = document.createElement('script')
            //// fileref.setAttribute("type", "text/javascript")
            // fileref.setAttribute("src", 'JS/jquery-ui.js')
            // if (typeof fileref != "undefined")
            //     s4 = document.getElementsByTagName('script')[0];
            // $(s4.parentNode).append(fileref);

        })();
        var settings = $.extend({}, defaults, option);
        $('#PPTPageDropdown').css('display', 'none');

        $.ajax({
            type: "GET",
            url: AmazonAPiURL + "/api/CompanyProfile/GetPowerPlants",
            //contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                //response = JSON.parse(response);
                PowerPlantsData = response.data;
                FillPowerPlants_Test_Grid(PowerPlantsData);
                DataFilled = true;

                $("#chkRegulated_Test").change(function () {
                    var thisVal = $(this).is(":checked");
                    var NonReg = $('#chkNonRegulated_Tet').is(":checked");
                    if (NonReg == false && thisVal == false) {
                        $('#chkNonRegulated_Test').prop('checked', true);
                    }
                });

                $("#chkNonRegulated_Test").change(function () {
                    var thisVal = $(this).is(":checked");
                    var Reg = $('#chkRegulated_Test').is(":checked");
                    if (Reg == false && thisVal == false) {
                        $('#chkRegulated_Test').prop('checked', true);
                    }
                });

                $(".PowerPlantTestpager").on("change", function () {
                    ;
                    $("#PowerPlantsGridTest").jsGrid("option", "pageSize", $(this).val());
                    $("#PowerPlantTestpager").val($(this).val());
                });
                $('#Search_TestPowerPlant').on('keyup', function (e) {
                    event.preventDefault();
                    if (event.keyCode === 13) {
                        searchTestPowerPlantData();
                    }
                });

                $(".tabs.tabs-inline.tabs-left > li > a").click(function (e) {
                    e.preventDefault();
                    goToByScroll($(this).attr("id"));
                });

                //$("#PlantOperatorGrid_Test").dataTable({
                //    "bSort": true,
                //});
                SuggestivePowerplantResults();
            },
            failure: function (response) {

            },
            error: function (error) {

            },
        });
        fillPowerState_Test();


        $("#powerplants").click(function () {
            if (TabClicked == false) {
                TabClicked = true;
                fillPowerState();
            }
            if (DataFilled == true && OnceDoneFill == false) {
                ClearGenUnitFilter();
                OnceDoneFill = true;
            }
        });
        var element = "";
        element = templates.PowerPlantGrid;
        return this.html(element)
    }



})(jQuery);
function SearchUtilityandPowerPlant() {
    try {
        searchTestPowerPlantData();

    } catch (e) {
        console.log(e.message);
    }
}


function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
function FillPowerPlants_Test_Grid(GridData) {
    try {

        $('#PowerPlantsGridTest').html("");
        $('#PPTPageDropdown').css('display', 'block');
        $("#PowerPlantTestpager").val("25");
        $("#PowerPlantsGridTest").jsGrid({
            height: "auto",
            width: "100%",
            sorting: true,
            paging: true,
            autoload: true,
            //pageSize: 25,
            pageButtonCount: 5,
            selectable: true,
            data: GridData,
            pageSizes: 25,
            pagerContainer: "#externalPager",
            pagerFormat: "Pages: {pageIndex} &nbsp;&nbsp; {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} of {pageCount} ",
            pagePrevText: "Prev",
            pageNextText: "Next",
            pageFirstText: "First",
            pageLastText: "Last",
            pageNavigatorNextText: "&#8230;",
            pageNavigatorPrevText: "&#8230;",
            fields: [
                { name: "powerID", visible: false, title: "ID" },
                { name: "companyID", visible: false, title: 'CompanyID' },
                {
                    name: "operatingUtility", title: 'Operating Utility', width: '15%', itemTemplate: function (item, value) {

                        var _object = value.operatingUtility;
                        var CompID = value.companyID;
                        return "<a class=PlantOperLink href='javascript:void(0)' onclick='OpenPlantOperatorModal_Test(" + CompID + ")'>" + _object + "</a>"
                    }
                },
                {
                    name: "powerPlant", title: 'Power Plant', width: '15%', itemTemplate: function (item, value) {

                        var _object = value.powerPlant;
                        var PowerID = value.powerID;
                        var CompanyID = value.companyID;
                        return "<a class=ProjectLink href='javascript:void(0)' onclick='OpenPlantModal_Test(" + PowerID + "," + CompanyID + ")'>" + _object + "</a>"
                    }
                },
                { name: "state", title: 'State', width: "5%" },
                { name: "nerc", title: 'NERC', width: "5%" },
                { name: "isO_RTO", title: 'ISO/ RTO', width: "7%" },
                { name: "transmissionGridOwner", title: 'Transmission Grid Owner', width: '14%' },
                { name: "regulated", title: 'Regulated<br/>(Y/N)', width: '7%' },
                { name: "sector", title: 'Sector', width: "15%" },
                { name: "primaryFuel", title: 'Primary Fuel', width: '9%' },
                {
                    name: "capacityMW", title: 'Capacity MW', width: '9%', itemTemplate: function (item, value) {

                        if (item.indexOf(".") != -1) {
                            var val = parseFloat(item).toFixed(2);
                            return val;
                        } else {
                            return item;
                        }

                    }
                },

            ]
        });
        $("#PowerPlantsGridTest").jsGrid("option", "pageSize", 25);
        if ($("#PowerPlantsGridTest").html() != "") {
            //var PageDropDown = '<span class="jsgrid-pager"> <select id="PowerPlantTestpager"><option selected="">25</option> <option >50</option><option>100</option> <option>500</option></select>  items Per Page</span>'
            //$("#GenUnitContent_Test .jsgrid-pager-container .jsgrid-pager").append(PageDropDown);
        }

        $("#powerPlantsTestLoader").hide();
    }
    catch (err) {
    }
}
function fillPower_Test_NERCRegion(response) {


    if (!response) {
        var apiurl = AmazonAPiURL + "/api/CompanyProfile/GetAllPowerPlantsOptions";
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                response = JSON.parse(this.responseText);
                if (response.error == "") {
                    $("#power_Test_nerc_region").html('');
                    $("#power_Test_nerc_region").append($('<option></option>').attr("value", "ALL").html("ALL"));
                    $("#power_Test_nerc_region").val("ALL");
                    for (i = 0; i < response.nerc.length; i++) {
                        var obj = response.nerc[i];
                        $("#power_Test_nerc_region").append($('<option></option>').attr("value", obj.nercregionCode.trim()).html(obj.nercregionCode));
                    }
                    fillPower_Test_FuelType(response);
                }
                else {
                    alert(response.msg);
                }

            }
            else {
                // alert(this.responseText);
                // console.log(this.responseText);
            }
        };
        xmlHttp.open("GET", apiurl, true);
        xmlHttp.send();
    } else {
        if (response.error == "") {
            $("#power_Test_nerc_region").html('');
            $("#power_Test_nerc_region").append($('<option></option>').attr("value", "ALL").html("ALL"));
            $("#power_Test_nerc_region").val("ALL");
            for (i = 0; i < response.nerc.length; i++) {
                var obj = response.nerc[i];
                $("#power_Test_nerc_region").append($('<option></option>').attr("value", obj.nercregionCode.trim()).html(obj.nercregionCode));
            }
            fillPower_Test_FuelType(response);
        }
        else {
            alert(response.msg);
        }
    }

}

function fillPower_Test_FuelType(response) {
    if (!response) {
        // var apiurl = AmazonAPiURL+"/api/CompanyProfile/GetFuelType";
        var apiurl = AmazonAPiURL + "/api/CompanyProfile/GetAllPowerPlantsOptions";
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                response = JSON.parse(this.responseText);
                if (response.error != "") {
                    $("#power_Test_primary_fuel").html('');
                    $("#power_Test_primary_fuel").append($('<option></option>').attr("value", "ALL").html("ALL"));
                    $("#power_Test_primary_fuel").val("ALL");
                    for (i = 0; i < response.fuelType.length; i++) {
                        var obj = response.fuelType[i];
                        $("#power_Test_primary_fuel").append($('<option></option>').attr("value", obj.primaryFuel.trim()).html(obj.primaryFuel));
                    }
                    fillSectors_Test();
                }
                else {
                    alert(response.msg);
                }

            }
            else {
                // alert(this.responseText);
                // console.log(this.responseText);
            }
        };
        xmlHttp.open("GET", apiurl, true);
        xmlHttp.send();
    }
    else {
        if (response.error == "") {
            $("#power_Test_primary_fuel").html('');
            $("#power_Test_primary_fuel").append($('<option></option>').attr("value", "ALL").html("ALL"));
            $("#power_Test_primary_fuel").val("ALL");
            for (i = 0; i < response.fuelType.length; i++) {
                var obj = response.fuelType[i];
                $("#power_Test_primary_fuel").append($('<option></option>').attr("value", obj.primaryFuel.trim()).html(obj.primaryFuel));
            }
            fillSectors_Test(response);
        }
        else {
            alert(response.msg);
        }
    }

}
function fillSectors_Test(response) {
    if (!response) {
        var apiurl = AmazonAPiURL + "/api/CompanyProfile/GetAllPowerPlantsOptions";
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                response = JSON.parse(this.responseText);
                if (response.error == "") {
                    $("#power_Test_sector_number").html('');
                    $("#power_Test_sector_number").append($('<option></option>').attr("value", "ALL").html("ALL"));
                    $("#power_Test_sector_number").val("ALL");
                    for (i = 0; i < response.sector.length; i++) {
                        var obj = response.sector[i];
                        $("#power_Test_sector_number").append($('<option></option>').attr("value", obj.sector).html(obj.sector));
                    }
                }
                else {
                    alert(response.msg);
                }

            }
            else {
                // alert(this.responseText);
                // console.log(this.responseText);
            }
        };
        xmlHttp.open("GET", apiurl, true);
        xmlHttp.send();
    }
    else {

        if (response.error == "") {
            $("#power_Test_sector_number").html('');
            $("#power_Test_sector_number").append($('<option></option>').attr("value", "ALL").html("ALL"));
            $("#power_Test_sector_number").val("ALL");
            for (i = 0; i < response.sector.length; i++) {
                var obj = response.sector[i];
                $("#power_Test_sector_number").append($('<option></option>').attr("value", obj.sector).html(obj.sector));
            }
        }
        else {
            alert(response.msg);
        }
    }
}
function resizePlantOperatorPopup_Test() {
    var popupHeight = $("#modal-PlantsOperator_Test").height()
    if (popupHeight > 0) {
        var bodyMaxHeight = popupHeight - 50;
        if (bodyMaxHeight < 150) {
            bodyMaxHeight = 150;
        }
        $("#modal-PlantsOperator_Test .modal-body").css('max-height', bodyMaxHeight);

        var ActualBodyHeight = $("#modal-bodyPlantOperator_Test").height()
        if (ActualBodyHeight < bodyMaxHeight) {
            $("#modal-PlantsOperator_Test").css('height', ActualBodyHeight + 50);

        }
    }
}
function PopupCenter(url, title, w, h) {
    // Fixes dual-screen position                         Most browsers      Firefox  
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow  
    if (window.focus) {
        newWindow.focus();
    }
}
function OpenPlantOperatorModal_Test(CompanyID) {
    var URL = window.location.href;
    if (URL) {
        URL = URL.replace("PowerPlantGrid.html", "OperatingUtilitydetail.html");
        URL = URL + "?t=" + CompanyID;
        window.open(URL, '_blank', 'location=yes,height=600,width=1000,scrollbars=yes,status=yes');
       // PopupCenter(URL, 'Operating Utility', '800', '600');
    }
    //$("#powerPlantsTestLoader").show();
    //var apiurl = AmazonAPiURL + "/api/CompanyProfile/GetPlantOperatorByID?cID=" + CompanyID
    //var xmlHttp = new XMLHttpRequest();
    //xmlHttp.onreadystatechange = function () {
    //    if (this.readyState == 4 && this.status == 200) {

    //        var response = this.responseText;
    //        var Data = JSON.parse(response);
    //        Data = JSON.parse(Data);
    //        $("#modal-bodyPlantOperator_Test").html("");
    //        var TotalCapacity = 0;
    //        var html = '<div class="row-fluid"><span class="PlantOperatorHeader">' + Data.data.CompanyName + '</span></div><br/>'
    //        //$("#modal-bodyPlantOperator_Test").append(html);
    //        //html = '';
    //        var CompType = Data.data.CompanyType;
    //        if (CompType == null || CompType == 'null') {
    //            CompType = '';
    //        }
    //        //html += '<div class="row-fluid"><div class="span12" id="span121"><div class="span6"><span class="PlantOperatorSubHeader">Contact Details</span><br> <br><div class="Contact_box">' +
    //        //       '<div class="row-fluid"><div class="span4"><b>Physical Address 1 :</b></div><div class="span8">' + Data.data.PhysicalAddress1 + '</div></div>' +
    //        //       '<div class="row-fluid"><div class="span4"><b>Physical Address 2 :</b></div><div class="span8">' + Data.data.PhysicalAddress2 + '</div></div>' +
    //        //       '<div class="row-fluid"><div class="span4"><b>City/State/Zip :</b></div><div class="span8">' + Data.data.City + ',' + Data.data.State + ',' + Data.data.Zip + '</div></div>' +
    //        //       '<div class="row-fluid"><div class="span4"><b>Country :</b></div><div class="span8">' + Data.data.Country + '</div></div>' +
    //        //       '<div class="row-fluid"><div class="span4"><b>Company Type:</b></div><div class="span8">' + CompType + '</div></div><div class="row-fluid"><div class="span4"><b>Parent Company:</b></div><div class="span8">' + Data.data.ParentCompany + '</div></div></div></div>'
    //        //$("#modal-bodyPlantOperator_Test").html(html);
    //        var htmlAddress2 = '';
    //        if (Data.data.PhysicalAddress2) {
    //            htmlAddress2 = '<br/>' + Data.data.PhysicalAddress2
    //        }
    //        html += '<div class="row-fluid"><div class="span12" id="span121"><div class="span6"><span class="PlantOperatorSubHeader">Contact Details</span><br> <br><div class="Contact_box">' +
    //                '<div class="row-fluid"><div class="span4"><b>Address</b></div><div class="span8">' + Data.data.PhysicalAddress1 + htmlAddress2 + '<br/>' + Data.data.City + ', ' + Data.data.State + ' ' + Data.data.Zip + '<br/>' + Data.data.Country +
    //                '</div></div><div class="row-fluid"><div class="span4"><b>Company Type:</b></div><div class="span8">' + CompType + '</div></div><div class="row-fluid"><div class="span4"><b>Parent Company:</b></div><div class="span8">' + Data.data.ParentCompany + '</div></div></div></div>'
    //        $("#modal-bodyPlantOperator_Test").html(html);
    //        html = '';

    //        html = '<div class="span6"><span class="PlantOperatorSubHeader">Operating Summary</span><br/><br/><div class="Operator_box"><div class="row-fluid"><div class="span6"><b>Operating Capacity</b></div>' +
    //        '<div class="span3"><b>MWs</b></div></div>'

    //        if (Data.Capacity.length > 0) {
    //            for (var i = 0; i < Data.Capacity.length; i++) {
    //                TotalCapacity = Data.Capacity[i].Value + TotalCapacity;
    //                var Keyval = Data.Capacity[i].Value;
    //                if (Keyval) {
    //                    Keyval = Keyval.toFixed(2);
    //                }
    //                html += '<div class="row-fluid"><div class="span6"><b>' + Data.Capacity[i].Key + '</b></div><div class="span3">' + Keyval + '</div><div class="span3"></div></div>'
    //            }
    //        }

    //        html += '<div class="row-fluid"><div class="span6"><b>Total Capacity:</b></div>'
    //        if (TotalCapacity > 0) {
    //            html += '<div class="span3">' + TotalCapacity.toFixed(2) + '</div>'
    //        } else {
    //            html += '<div class="span3"></div>'
    //        }
    //        html += '<div class="span3"></div></div></div>'
    //        $("#span121").append(html);
    //        html = '';

    //        html = '<br /><span class="PlantOperatorSubHeader">Plant Data</span><br /><br />';
    //        html += '<div class="row-fluid PlantOperatorContent"> <table id="PlantOperatorGrid_Test" class="table table-hover table-striped table-bordered grid" style="border-left: 1px solid #ddd;" cellspacing="0" width="100%"><thead><tr><th>Power Plant</th><th>City</th><th>County</th><th>State</th><th>NERC</th><th>Capacity MWs</th><th>Planned<br />Increases MWs</th><th>Primary Fuel</th><th>Sector</th></tr></thead><tbody id="PlantOperatorGrid_tbody"></tbody></table></div>'
    //        $("#modal-bodyPlantOperator_Test").append(html);
    //        if (Data.data.Plants.length > 0) {
    //            html = '';
    //            for (var i = 0; i < Data.data.Plants.length; i++) {
    //                var PlannedIncreasesMWs = Data.data.Plants[i].PlannedIncreasesMWs
    //                if (PlannedIncreasesMWs == null || PlannedIncreasesMWs == 'null') {
    //                    PlannedIncreasesMWs = ''
    //                }
    //                var Sector = Data.data.Plants[i].Sector;
    //                var PrimaryFuel = Data.data.Plants[i].PrimaryFuel;
    //                if (!Sector)
    //                    Sector = '';
    //                if (!PrimaryFuel)
    //                    PrimaryFuel = '';
    //                var CapacityMWs = Data.data.Plants[i].CapacityMWs
    //                var NERC = Data.data.Plants[i].NERC
    //                if (CapacityMWs) {
    //                    CapacityMWs = parseFloat(CapacityMWs)
    //                    CapacityMWs = CapacityMWs.toFixed(2);
    //                }
    //                else {
    //                    CapacityMWs = '';
    //                }
    //                if (NERC) {
    //                    NERC = parseFloat(NERC)
    //                    NERC = NERC.toFixed(2);
    //                }
    //                else {
    //                    NERC = '';
    //                }
    //                html += '<tr><td>' + Data.data.Plants[i].PlantName + '</td><td>' + Data.data.Plants[i].City + '</td><td>' + Data.data.Plants[i].County + '</td><td>' + Data.data.Plants[i].State + '</td><td>' + NERC + '</td><td>' + CapacityMWs + '</td><td>' + PlannedIncreasesMWs + '</td><td>' + PrimaryFuel + '</td><td>' + Sector + '</td></tr>';
    //            }
    //        }
    //        $("#PlantOperatorGrid_tbody").html("");
    //        $("#PlantOperatorGrid_tbody").html(html);
    //        $("#powerPlantsTestLoader").hide();
    //        $("#modal-PlantsOperator_Test").css('height', '80%');
    //        $("#modal-bodyPlantOperator_Test").css('max-height', 'none');
    //        $("#modal-PlantsOperator_Test").on('show', function () {
    //            $(this).addClass("modalPlantOperator");
    //        })
    //        //$("#modal-PlantsOperator_Test").on('shown.bs.modal', function () {
    //        //    resizePlantOperatorPopup_Test();
    //        //})
    //        $("#modal-PlantsOperator_Test").on('hidden.bs.modal', function () {
    //            $(this).removeClass("modalPlantOperator");
    //        })
    //        $("#modal-PlantsOperator_Test").modal('show');
    //    }
    //    else {
    //        // alert(this.responseText);
    //        //console.log(this.responseText);
    //    }
    //};
    //xmlHttp.open("GET", apiurl, true);
    //xmlHttp.send();
}





function OpenPlantModal_Test(PowerID, CompanyID) {
    var URL = window.location.href;
    if (URL) {
        URL = URL.replace("PowerPlantGrid.html", "PowerPlantdetail.html");
        URL = URL + "?p=" + PowerID + "&c=" + CompanyID + "&Type=Power";
       window.open(URL, '_blank', 'location=yes,height=600,width=1050,scrollbars=yes,status=yes');
       
    }
    //$("#powerPlantsTestLoader").show();

    //$.ajax({
    //    type: "GET",
    //    url: AmazonAPiURL + "/api/CompanyProfile/GetPowerPlantByID?PowerID=" + PowerID + "&CompanyID=" + CompanyID,
    //    //contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (response) {
    //        var Data = JSON.parse(response);
    //        //Data = JSON.parse(Data);
    //        var OperatingUtility = '';
    //        var OwnershipType = '';
    //        var Country = '';
    //        var City = '';
    //        var NERC = '';
    //        var ISO = '';
    //        var TransFacilityOwner = '';
    //        if (Data.data.OperatingUtility) {
    //            OperatingUtility = Data.data.OperatingUtility
    //        }
    //        if (Data.data.OwnershipType) {
    //            OwnershipType = Data.data.OwnershipType
    //        }
    //        if (Data.data.Country) {
    //            Country = Data.data.Country
    //        }
    //        if (Data.data.City) { City = Data.data.City; }
    //        if (Data.data.NERC) { NERC = Data.data.NERC }
    //        if (Data.data.ISO) { ISO = Data.data.ISO }
    //        if (Data.data.TransFacilityOwner) { TransFacilityOwner = Data.data.TransFacilityOwner }
    //        //var html = '<div class="row-fluid"> <span class="PlantOperatorHeader" id="PlantOperatorHeaderName"></span> </div><br />';
    //        //html += ' <div class="row-fluid"> <div class="span12"> <div class="span4" id="span6_1"></div><div class="span4" id="span6_2"></div><div class="span4" id="span6_3"></div></div></div>';
    //        //$("#modal-bodyPowerPlantPopup_Test").html(html);
    //        //var html = '<div class="row-fluid"> <span class="PlantOperatorHeader" id="PlantOperatorHeaderName">' + Data.data.Name + '</span> </div><br />';
    //        //html += ' <div class="row-fluid"> <div class="span12"> <div class="span4" id="span6_1"></div><div class="span4" id="span6_2"></div><div class="span4" id="span6_3"></div></div></div>';
    //        //$("#modal-bodyPowerPlantPopup_Test").html(html);
    //        $("#PlantOperatorHeaderName").html(Data.data.Name);
    //        html = ''
    //        html = '<div class="left_box"><div class="row-fluid"><div class="span4"><b>Operating Utility</b></div><div class="span8">' + OperatingUtility + '</div></div>' +
    //            '<div class="row-fluid"><div class="span4"><b>Ownership Type:</b></div><div class="span8">' + OwnershipType + '</div></div>' +
    //            '  <div class="row-fluid"><div class="span4"><b>Country</b></div><div class="span8">' + Country + '</div></div>' +
    //            '<div class="row-fluid"><div class="span4"><b>City/State:</b></div><div class="span8">' + City + ', ' + Data.data.State + '</div></div>' +
    //            '<div class="row-fluid"><div class="span4"><b>County:</b></div><div class="span8">' + Data.data.County + '</div></div>' +
    //            '<div class="row-fluid"><div class="span4"><b>EIA Plant Code:</b></div><div class="span8">' + Data.data.PowerEIAPlantCode + '</div></div>' +
    //            '<div class="row-fluid"><div class="span4"><b>NERC Region:</b></div><div class="span8">' + NERC + '</div></div>' +
    //            ' <div class="row-fluid"> <div class="span4"><b>ISO/RTO:</b></div> <div class="span8">' + ISO + '</div></div>' +
    //            '<div class="row-fluid"><div class="span4"><b>Trans Facility Owner:</b></div><div class="span8">' + TransFacilityOwner + '</div></div></div>'
    //        $("#span6_1").html("");
    //        $("#span6_1").append(html);
    //        var HeatRate = Data.data.HeatRate;
    //        var PrimaryFuel = Data.data.PrimaryFuel;
    //        var WaterSource = Data.data.WaterSource;
    //        var RegulatoryStatus = Data.data.RegulatoryStatus;
    //        var Sector = Data.data.Sector;
    //        var CapacityFactor = Data.data.CapacityFactor;
    //        var Capacity = Data.data.Capacity
    //        if (HeatRate == null || HeatRate == 'null')
    //            HeatRate = '';
    //        if (PrimaryFuel == null || PrimaryFuel == 'null')
    //            PrimaryFuel = '';
    //        if (WaterSource == null || WaterSource == 'null')
    //            WaterSource = '';
    //        if (RegulatoryStatus == null || RegulatoryStatus == 'null')
    //            RegulatoryStatus = '';
    //        if (Sector == null || Sector == 'null')
    //            Sector = '';
    //        if (CapacityFactor == null || CapacityFactor == 'null')
    //            CapacityFactor = '';
    //        if (Capacity == null || Capacity == 'null')
    //            Capacity = '';
    //        if (HeatRate) {
    //            HeatRate = HeatRate.toFixed(2)
    //        }
    //        html = '';
    //        html = '  <div class="right_box"> <div class="row-fluid"><div class="span4"><b>Capacity (MWs):</b></div><div class="span8">' + Capacity + '</div></div>' +
    //            '<div class="row-fluid"><div class="span4"><b>Capacity Factor:</b></div><div class="span8">' + CapacityFactor + '</div></div>' +
    //             '<div class="row-fluid"><div class="span4"><b>Avg. Heat Rate (Btu/kWh):</b></div><div class="span8">' + HeatRate + '</div></div>' +
    //             '<div class="row-fluid"><div class="span4"><b>Primary Fuel:</b></div><div class="span8">' + PrimaryFuel + '</div></div>' +
    //             ' <div class="row-fluid"><div class="span4"><b>Water Source:</b></div><div class="span8">' + WaterSource + '</div></div>' +
    //             '<div class="row-fluid"><div class="span4"><b>Regulatory Status:</b></div><div class="span8">' + RegulatoryStatus + '</div></div>' +
    //             '<div class="row-fluid"><div class="span4"><b>Sector:</b></div><div class="span8">' + Sector + '</div></div></div>';
    //        $("#span6_2").html("");
    //        $("#span6_2").append(html);
    //        //html = '';
    //        //html = '<div class="reg_bg" style="height: 365px; width: 98%"><div id="Test_map_canvas" style="width: 100%; height: 100%;"></div></div>';
    //        // $("#span6_3").html("");
    //        //$("#span6_3").append(html);
    //        html = '';
    //        $("#TestLoadTable").html("");
    //        html = '<br /><span class="PlantOperatorHeader">Existing & Planned Unit Data</span><br /><br />';
    //        $("#TestLoadTable").append(html);
    //        html = '';
    //        html = ' <div class="row-fluid PowerPlantUnitsContent">  <table id="PowerPlantUnitsGrid_Test" class="table table-hover table-striped table-bordered grid" style="border-left: 1px solid #ddd;" cellspacing="0" width="100%"> <thead><tr><th>Generator</th><th>Prime Mover</th>' +
    //                '<th>NamePlate<br /> Capacity MWs</th><th>Proposed<br /> Capacity  MWs</th><th>Status</th><th>Online<br />Year</th><th>Primary Fuel</th></tr></thead> <tbody id="PowerPlantUnitsGrid_Test_tbody"></tbody></table></div>';
    //        $("#TestLoadTable").append(html);
    //        html = '';
    //        if (Data.data.PowerUnits.length > 0) {
    //            for (var i = 0; i < Data.data.PowerUnits.length; i++) {
    //                var Generator = Data.data.PowerUnits[i].Generator;
    //                var PrimeMover = Data.data.PowerUnits[i].PrimeMover;
    //                var NamePlateCapacity = Data.data.PowerUnits[i].NamePlateCapacity;
    //                var SummerCapabilities = Data.data.PowerUnits[i].SummerCapabilities;
    //                var Status = Data.data.PowerUnits[i].Status;
    //                var OnlineYear = Data.data.PowerUnits[i].OnlineYear;
    //                var PrimaryFuel = Data.data.PowerUnits[i].PrimaryFuel;
    //                var Ownership = Data.data.PowerUnits[i].Ownership;
    //                var ProposedCapacity = Data.data.PowerUnits[i].ProposedCapacity;
    //                if (Generator == null || Generator == 'null')
    //                    Generator = '';
    //                if (PrimeMover == null || PrimeMover == 'null')
    //                    PrimeMover = '';
    //                if (NamePlateCapacity == null || NamePlateCapacity == 'null')
    //                    NamePlateCapacity = '';
    //                if (SummerCapabilities == null || SummerCapabilities == 'null')
    //                    SummerCapabilities = '';
    //                if (Status == null || Status == 'null')
    //                    Status = '';
    //                if (OnlineYear == null || OnlineYear == 'null')
    //                    OnlineYear = '';
    //                if (PrimaryFuel == null || PrimaryFuel == 'null')
    //                    PrimaryFuel = '';
    //                if (Ownership == null || Ownership == 'null')
    //                    Ownership = '';
    //                if (ProposedCapacity == null || ProposedCapacity == 'null')
    //                    ProposedCapacity = '';
    //                if (NamePlateCapacity) {
    //                    NamePlateCapacity = parseFloat(NamePlateCapacity)
    //                    NamePlateCapacity = NamePlateCapacity.toFixed(2);
    //                }
    //                if (SummerCapabilities) {
    //                    SummerCapabilities = parseFloat(SummerCapabilities)
    //                    SummerCapabilities = SummerCapabilities.toFixed(2);

    //                }
    //                if (ProposedCapacity) {
    //                    ProposedCapacity = parseFloat(ProposedCapacity)
    //                    ProposedCapacity = ProposedCapacity.toFixed(2);

    //                }

    //                html += '<tr><td>' + Generator + '</td><td>' + PrimeMover + '</td><td>' + NamePlateCapacity + '</td><td>' + ProposedCapacity + '</td><td>' + Status + '</td><td>' + OnlineYear +
    //                    '</td><td>' + PrimaryFuel + '</td></tr>';
    //            }
    //        }
    //        $("#PowerPlantUnitsGrid_Test_tbody").html("");
    //        $("#PowerPlantUnitsGrid_Test_tbody").html(html);

    //        $("#powerPlantsTestLoader").hide();
    //        $("#modal-PowerPlantPopup_Test").css('height', '80%');
    //        $("#modal-PowerPlantPopup_Tes").css('max-height', 'none');
    //        $("#modal-PowerPlantPopup_Test").on('show', function () {
    //            $(this).addClass("modalPlantOperator");
    //            // $("#Test_map_canvas").empty();

    //        })
    //        $("#modal-PowerPlantPopup_Test").on('shown.bs.modal', function () {
    //            PowerPlantTest_initialize_map(Data.data.latitude, Data.data.longitude);
    //            // resizePowerPlantPopup_Test();
    //        })
    //        $("#modal-PowerPlantPopup_Test").on('hidden.bs.modal', function () {
    //            $(this).removeClass("modalPlantOperator");
    //        })
    //        //$("#modal-bodyPowerPlantPopup_Test").html(response);
    //        $("#modal-PowerPlantPopup_Test").modal('show');
    //        $("#main").css('margin-left', '0px');
    //        // $("#Test_map_canvas").html("");

    //    },
    //    failure: function (response) {

    //    }
    //});
}

function resizePowerPlantPopup_Test() {
    $(window).resize(function () {
        $('#modal-PowerPlantPopup_Test').height($(window).height() - 100);
        var headerheight = $('#modal-PowerPlantPopup_Test').height();
        headerheight = headerheight - 220;
        $('#modal-PowerPlantPopup_Test .modal-body').css('max-height', headerheight);
    });

    $(window).trigger('resize');
}

function fillPowerState_Test() {

    // var apiurl = AmazonAPiURL+"/api/CompanyProfile/GetPowerState";
    var apiurl = AmazonAPiURL + "/api/CompanyProfile/GetAllPowerPlantsOptions";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            response = JSON.parse(this.responseText);
            if (response.msg != "") {
                $("#power_Test_state").html('');
                $("#power_Test_state").append($('<option></option>').attr("value", "ALL").html("ALL"));
                $("#power_Test_state").val("ALL");
                for (i = 0; i < response.sates.length; i++) {
                    var obj = response.sates[i];
                    $("#power_Test_state").append($('<option></option>').attr("value", obj.stateCode1.trim()).html(obj.stateProvince));
                }
                fillPower_Test_NERCRegion(response);
            }
            else {
                alert(response.msg);
            }

        }
        else {
            // alert(this.responseText);
            // console.log(this.responseText);
        }
    };
    xmlHttp.open("GET", apiurl, true);
    xmlHttp.send();
}



function ApplyTest_PowerPlantsFilter() {
    $('#PowerPlantsGridTest').empty();
    $('#PowerPlantsGridTest').html("<b>&nbsp;&nbsp; Loading... </b><br/><br/>");
    if (PowerPlantsData == undefined || PowerPlantsData == null) {
        var apiurl = AmazonAPiURL + "/api/CompanyProfile/GetPowerPlants";
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                response = JSON.parse(this.responseText);
                PowerPlantsData = response.data;
                AppyFilterPowerPlantTest(PowerPlantsData);
            }
            else {
                // alert(this.responseText);
                // console.log(this.responseText);
            }
        };
        xmlHttp.open("GET", apiurl, true);
        xmlHttp.send();
    }
    else {
        AppyFilterPowerPlantTest(PowerPlantsData);
    }
}
function searchTestPowerPlantData() {
    try {
        $('#PowerPlantsGridTest').empty();
        $('#PowerPlantsGridTest').html("<b>&nbsp;&nbsp; Loading... </b><br/><br/>");
        $('#Search_TestPowerPlantautocomplete-list').css('display', 'none');
        var Search_TestPowerPlant = $('#Search_TestPowerPlant').val();
        var TestPowerPlantsData = PowerPlantsData
        if (Search_TestPowerPlant) {
            TestPowerPlantsData = PowerPlantsData.filter(function (el) {
                if (el.operatingUtility.toLowerCase().indexOf(Search_TestPowerPlant.toLowerCase().trim()) > -1 || el.powerPlant.toLowerCase().indexOf(Search_TestPowerPlant.toLowerCase().trim()) > -1) {
                    return el;
                }
                //else if (el.powerPlant != null && el.powerPlant != undefined && ) {
                //    return el;
                //}
            });
            ;
        }
        FillPowerPlants_Test_Grid(TestPowerPlantsData);

    } catch (e) {
        console.log(ex.message);
    }
}
function AppyFilterPowerPlantTest(PowerPlantsData) {
    var states = $("#power_Test_state").val();
    var NERCRegions = $("#power_Test_nerc_region").val();
    var Fuels = $("#power_Test_primary_fuel").val();
    var Sectors = $("#power_Test_sector_number").val();
    var ISORTO = $("#power_Test_iso_rto").val();
    var RegCheck = $('#chkRegulated_Test').is(":checked");
    var NonRegCheck = $('#chkNonRegulated_Test').is(":checked");
    var FromCapacity = $('#txtCapacityFrom_Test').val();
    var ToCapacity = $('#txtCapacityTo_Test').val();
    var Search_TestPowerPlant = $("#Search_TestPowerPlant").val();

    var StatesData = PowerPlantsData.filter(function (el) {
        if (states[0] == "ALL")
            return el;
        else
            if (el.state != null && el.state != undefined && states.indexOf(el.state.trim()) > -1)
                return el;
    })
    var NERCData = StatesData.filter(function (el) {
        if (NERCRegions[0] == "ALL")
            return el;
        else
            if (el.nerc != null && el.nerc != undefined && NERCRegions.indexOf(el.nerc.trim()) > -1)
                return el;
    })
    var FuelsData = NERCData.filter(function (el) {
        if (Fuels[0] == "ALL")
            return el;
        else
            if (el.primaryFuel != null && el.primaryFuel != undefined && Fuels.indexOf(el.primaryFuel.trim()) > -1)
                return el;
    })
    var SectorsData = FuelsData.filter(function (el) {
        if (Sectors[0] == "ALL")
            return el;
        else
            if (el.sector != null && el.sector != undefined && Sectors.indexOf(el.sector.trim()) > -1)
                return el;
    })
    var ISORTOData = SectorsData.filter(function (el) {
        if (ISORTO[0] == "ALL")
            return el;
        else
            if (el.isO_RTO != null && el.isO_RTO != undefined && ISORTO.indexOf(el.isO_RTO.trim()) > -1)
                return el;
    })
    var RegData = ISORTOData.filter(function (el) {
        if (RegCheck == true && NonRegCheck == true)
            return el;
        else if (NonRegCheck == false)
            return el.regulated == "Yes";
        else
            return el.regulated == "No";
    })
    var CapacityData;
    if (parseInt(FromCapacity) >= 0 && parseInt(ToCapacity) >= 0) {
        CapacityData = RegData.filter(function (el) {
            return parseInt(el.capacityMW) >= parseInt(FromCapacity) && parseInt(el.capacityMW) <= parseInt(ToCapacity)
        })
    }
    else
        CapacityData = RegData;

    // if (Search_TestPowerPlant) {
    // var data = CapacityData.filter(function (el) {

    // if (Search_TestPowerPlant.toLowerCase().indexOf(el.operatingUtility.toLowerCase().trim()) > -1 || Search_TestPowerPlant.toLowerCase().indexOf(el.powerPlant.toLowerCase().trim()) > -1) {
    // return el;
    // }
    // //else if (el.powerPlant != null && el.powerPlant != undefined && ) {
    // //    return el;
    // //}
    // });
    // CapacityData = data;

    // }

    $("#PowerPlantsGrid_info").hide();
    $("#PowerPlantsGrid_paginate").hide();
    $('#PowerPlantsGridTest').empty();
    $('#PowerPlantsGridTest').html("<b>&nbsp;&nbsp; Loading... </b><br/><br/>");
    setTimeout(function () { FillPowerPlants_Test_Grid(CapacityData); }, 500);

}
function ClearTest_PowerPlantsFilter() {

    $('#PowerPlantsGridTest').empty();
    $('#PowerPlantsGridTest').html("<b>&nbsp;&nbsp; Loading... </b><br/><br/>");
    if (PowerPlantsData == undefined || PowerPlantsData == null) {
        var apiurl = AmazonAPiURL + "/api/CompanyProfile/GetPowerPlants";
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                response = JSON.parse(this.responseText);
                PowerPlantsData = response.data;
                ClearFilterForPowerPlantTest(PowerPlantsData);

            }
            else {
                // alert(this.responseText);
                //console.log(this.responseText);
            }
        };
        xmlHttp.open("GET", apiurl, true);
        xmlHttp.send();
    }
    else {
        ClearFilterForPowerPlantTest(PowerPlantsData);
    }
}

function ClearFilterForPowerPlantTest(PowerPlantsData) {
    $("#power_Test_state").val("ALL");
    $("#power_Test_nerc_region").val("ALL");
    $("#power_Test_primary_fuel").val("ALL");
    $("#power_Test_sector_number").val("ALL");
    $("#power_Test_iso_rto").val("ALL");
    $("#Power_TestPlantsGrid_info").hide();
    $("#Power_TestPlantsGrid_paginate").hide();
    $('#PowerPlantsGridTest').empty();
    $("#txtCapacityFrom_Test").val(0);
    $("#txtCapacityTo_Test").val(99999);
    $('#PowerPlantsGridTest').html("<b>&nbsp;&nbsp; Loading... </b><br/><br/>");
    $("#Search_TestPowerPlant").val("");
    setTimeout(function () { FillPowerPlants_Test_Grid(PowerPlantsData); }, 500);
    FillPowerPlants_Test_Grid(PowerPlantsData);
    DataFilled = true;
}


function SuggestivePowerplantResults() {
    try {
        var apiurl = AmazonAPiURL + "/api/CompanyProfile/GetSuggestivePowerplantResults";
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                response = JSON.parse(this.responseText);
                response = JSON.parse(response);
                if (response) {

                    autocomplete_Test(document.getElementById("Search_TestPowerPlant"), response);

                    //$("#Search_TestPowerPlant").autocomplete({
                    //    source: response
                    //});
                }

            }
            else {
                // alert(this.responseText);
                //console.log(this.responseText);
            }
        };
        xmlHttp.open("GET", apiurl, true);
        xmlHttp.send();
    } catch (e) {
        console.log(e.message);

    }
}

function autocomplete_Test(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        $('#' + this.id + "autocomplete-list").css({
            "max-height": "500px",
            "overflow": "auto"
        });
        /*for each item in the array...*/
        var j = 0;
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                if (j < 50) {
                    b = document.createElement("DIV");
                    /*make the matching letters bold:*/
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    /*insert a input field that will hold the current array item's value:*/
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    /*execute a function when someone clicks on the item value (DIV element):*/
                    b.addEventListener("click", function (e) {
                        /*insert the value for the autocomplete text field:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        /*close the list of autocompleted values,
                        (or any other open lists of autocompleted values:*/
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
                j++;
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

