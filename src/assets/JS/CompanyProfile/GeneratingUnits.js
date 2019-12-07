var GenUnitTestData;
var GenUnit_TestTabClicked = false;
// var AmazonAPiURL = 'https://avp8hf6otb.execute-api.us-east-1.amazonaws.com/Prod';
var AmazonAPiURL = 'https://nqzkggqnbb.execute-api.us-east-1.amazonaws.com/Prod';
(function ($) {
    var templates = {
        GeneratingUnits: '<div class="loader" id="GenUnitsLoader_Test"><img id="loading-image" src="css/images/ajax-loader.GIF" alt="Loading..." height="100" width="100" /></div>' +
         '<div class="row-fluid"><div class="span12"><div class="box box-color box-bordered">' +
         '<div class="box-title" style=" border-color: #368ee0 !important; border: 2px solid #ddd; padding:0px;"></div><div class="box-content nopadding box-border"><div class="highlight-toolbar">' +
                 '<p class="PrjHeader" style=" font-size: 25px; padding-top: 10px; font-weight: bold; ">GENERATING UNITS</p>' +
             '<div class="row-fluid"><div class="span12 data_generating_units_filters"><div class="span2 genhub_data_form_row"><label>State</label><select multiple="multiple" name="GenUnit_TestStates" id="GenUnit_TestStates" class="span12 multiplechoice state"></select>' +
     '</div><div class="span2 genhub_data_form_row"><label>NERC Region</label><select multiple="multiple" name="GenUnit_TestRegion" id="GenUnit_TestRegion" class="span12 multiplechoice nerc_region"></select></div><div class="span2 genhub_data_form_row"><label>Prime Mover</label>' +
         '<select multiple="multiple" name="GenUnit_TestPrimeMovers" id="GenUnit_TestPrimeMovers" class="span12 multiplechoice prime_mover"><option value="ALL" selected="">All</option><option value="Other">Battery</option><option value="GeoThermal">Binary Cycle</option><option value="Combined Cycle">Comb Cycle ST</option><option value="Combined Cycle">Comb Cycle</option>' +
             '<option value="Solar NP">Conc Solar</option><option value="Combined Cycle">Comb Cycle SS</option> <option value="Combined Cycle">Comb Cycle CT</option><option value="Other">Fuel Cell</option><option value="Other">Flywheel</option>' +
             '<option value="Combustion">Gas Turbine</option><option value="Water">HY Turbine</option><option value="Combustion">IC Engine</option><option value="Other">Other</option><option value="Water">HY Pump Store</option><option value="Solar PV">Photovoltaic</option><option value="Steam">Steam Turbine</option>' +
             '<option value="Wind">Wind Turb OnS</option></select></div><div class="span2 genhub_data_form_row"> <label>Status</label><select multiple="multiple" name="GenUnit_TestStatus" id="GenUnit_TestStatus" class="span12 multiplechoice status"><option value="ALL" selected="">All</option><option value="Proposed">Pending Approval</option><option value="Idle/Inactive">Out of Service ST</option>' +
             '<option value="Active">Operating</option><option value="Proposed">Other Planned</option><option value="Proposed">Planned</option><option value="Active">Standby</option><option value="Proposed">Regulatory Appr</option><option value="Proposed">Testing</option><option value="Under Construction">Under Constr &lt;50%</option><option value="Under Construction">Under Constr &gt;50%</option></select>' +
     '</div><div class="span2 genhub_data_form_row"><label>Primary Fuel Type</label><select multiple="multiple" name="GenUnit_TestFuelTypes" id="GenUnit_TestFuelTypes" class="span12 multiplechoice primary_fuel"><option value="ALL" selected="">All</option><option value="Biomass">Bio</option><option value="Coal">Coal</option><option value="Gas">Gas</option><option value="Waste">Waste</option><option value="Other">Other</option>' +
     '</select></div><div class="span3" style="margin-left: 10px !important"><div>&nbsp;</div><div class="span12 text-right"><div class="tofrom_genhub_header">From</div><div class="tofrom_genhub_header">To</div></div><div class="span12 tofrom_genhub_panel_row">' +
 '<div class="span4"><label style="float: left">Online Year</label> </div> <div class="span8 text-right"><input type="text" name="txt_TestOnlineYearFrom" id="txt_TestOnlineYearFrom" title="" value="1856" class="text online_year_from" />' +
 '    <input type="text" name="txt_TestOnlineYearTo" id="txt_TestOnlineYearTo" title="" value="2030" class="text online_year_to" /> </div></div><div class="span12 tofrom_genhub_panel_row"><div class="span6"><label style="float: left">Nameplate Capacity MW</label></div>' +
 '<div class="span6 text-right"><input type="text" name="txt_TestNamePlateCapFrom" id="txt_TestNamePlateCapFrom" title="" value="0" class="text capacity_from" />       <input type="text" name="txt_TestNamePlateCapTo" id="txt_TestNamePlateCapTo" title="" value="99999" class="text capacity_to" />' +
 '</div></div><div class="span12 tofrom_genhub_panel_row"><div class="span6"><label style="float: left">Summer Capacity MW</label></div>' +
 '<div class="span6 text-right"><input type="text" name="txt_TestSummerCapFrom" id="txt_TestSummerCapFrom" title="" value="0" class="text summer_capacity_from" />' +
 '    <input type="text" name="txt_TestSummerCapTo" id="txt_TestSummerCapTo" title="" value="99999" class="text summer_capacity_to" />' +
 '</div></div></div><div class="span12 text-left" style="margin-left: 5px"><label>Hold down ctrl and click to select more than one option.</label></div><div class="span12" style="margin-left: 5px"><div class="span3"><input id="btnClear_TestGenUnit" type="button" name="action" value="Clear" class="btn btn-primary" style="font-weight: normal" onclick=" Clear_TestGenUnitFilter();" />' +
'</div><div class="span6 autocomplete" style="text-align: center;"><input type="text" style="height: 100%; width: 50%;" id="Search_TestGUT" placeholder="Search Utility or Plant name" class="NewsArticleSearch">' +
'    <input id="btnFilter_GUTTestUtilityAndPowerplant" onclick="SearchGUTUtilityandPowerPlant();" type="button" name="action" value="Search" class="btn btn-primary" style="font-weight: normal; margin-left: 1%;margin-top: -10px;" /></div> <div class="span3 text-right"><input id="btnApply_TestGenUnit" type="button" name="action" value="Apply Filters" class="btn btn-primary" style="font-weight: normal" onclick=" Apply_TestGenUnitFilter();">' +
'</div></div></div>' +
'<span class="jsgrid-pager">Show&nbsp;<select id="GeneratingUnitsTestpager" class="GeneratingUnitsTestpager"><option selected="">25</option><option>50</option><option>100</option><option>500</option></select><span style="display:  table-cell;vertical-align:  middle;">&nbsp;items Per Page<span></span></span></span>' +
'<div class="GenUnitContent" id="GenUnitContent_Test"></div><div class="span12" style="margin-left: 0px;"><div id="GenUnitexternalPager" class="span4 external-pager jsgrid-pager-container" style="text-align: center;width: auto;"></div><div class="span6" style="margin-left: 0px;padding-top: 6px; display:none;" id="GUTPageDropdown">' +
' </div></div></div>' +
'<div id="modal-GenUnitsPlantsOperator_Test" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-content"><div class="modal-header" style="border-bottom: 0px;"><button type="button" class="close" data-dismiss="modal">&times;</button></div><div id="modal-GenUnitsbodyPlantOperator_Test" class="modal-body"></div></div></div>' +
'<div id="modal-GenUnitsPowerPlantPopup_Test" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-content"><div class="modal-header btnModalClose" style="border-bottom: 0px;"><button type="button" class="close" data-dismiss="modal">&times;</button></div><div id="modal-GenUnitsbodyPowerPlantPopup_Test" class="modal-body" style="overflow-y: visible;max-height: 0px;"></div></div></div>'

    };


    $.fn.GeneratingUnits = function (option) {
        var defaults = {
            onSuccess: function (data) { console.log([200, 'OK']); },
            onError: function (data) { console.log([500, 'Error']); }
        };
        (function () {
            //var po1 = null;
            //var s1 = null;


            //po1 = document.createElement('link'); po1.async = true;
            //po1.href = 'css/CompanyProfile/GeneratingUnits.css'
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);

            //po1 = null;
            //s1 = null;
            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/CompanyProfile/PowerPlants.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);


            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/jquery.mCustomScrollbar.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);

            //s1 = null;
            //po1 = null;
            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/jquery.ui.theme.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);

            //s1 = null;
            //po1 = null;
            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/style.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);


            //s1 = null;
            //po1 = null;
            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/themes.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);
            //s1 = null;
            //po1 = null;
            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/demos.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);
            //s1 = null;
            //po1 = null;
            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/jsgrid.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);
            //s1 = null;
            //po1 = null;
            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/theme.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);

            //s1 = null;
            //po1 = null;
            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/ui.dynatree.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);
            //s1 = null;
            //po1 = null;
            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/chosen.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);
            //s1 = null;
            //po1 = null;
            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/icheck/all.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);
            //s1 = null;
            //po1 = null;
            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/icon.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);
            //s1 = null;
            //po1 = null;
            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/themes.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);
            //s1 = null;
            //po1 = null;
            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/fullcalendar.print.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);
            //s1 = null;
            //po1 = null;
            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/fullcalendar.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);
            //s1 = null;
            //po1 = null;
            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/jquery.ui.theme.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);
            //s1 = null;
            //po1 = null;
            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/jquery-ui.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);
            //s1 = null;
            //po1 = null;
            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/bootstrap-responsive.min.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);
            //s1 = null;
            //po1 = null;
            //po1 = document.createElement('link');
            //po1.async = true;
            //po1.rel = 'stylesheet'
            //po1.type = "text/css"
            //po1.href = "css/bootstrap.min.css"
            //s1 = document.getElementsByTagName('link')[0];
            //s1.parentNode.insertBefore(po1, s1);

            //var po4 = null;
            //var s4 = null;
            //po4 = null;
            //s4 = null;
            //po4 = document.createElement('script');
            //// po4.type = 'text/javascript';
            //po4.async = true;
            //po4.src = 'js/CompanyProfile/ContextMenu.js';
            //po4.type = "text/javascript"
            //s4 = document.getElementsByTagName('script')[1];
            //s4.parentNode.insertBefore(po4, s4);

            //po4 = null;
            //s4 = null;
            //po4 = document.createElement('script');
            //// po4.type = 'text/javascript';
            //po4.async = true;
            //po4.src = 'js/CompanyProfile/googleMapHelper.js';
            //po4.type = "text/javascript"
            //s4 = document.getElementsByTagName('script')[1];
            //s4.parentNode.insertBefore(po4, s4);

            //po4 = null;
            //s4 = null;
            //po4 = document.createElement('script');
            //// po4.type = 'text/javascript';
            //po4.async = true;
            //po4.src = 'http://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyCdCw-UMwdjTOzXPaelRVOSSzvhpspTgCU&sensor=false';
            //po4.type = "text/javascript"
            //s4 = document.getElementsByTagName('script')[1];
            //s4.parentNode.insertBefore(po4, s4);

            //po4 = null;
            //s4 = null;
            //po4 = document.createElement('script');
            //// po4.type = 'text/javascript';
            //po4.async = true;
            //po4.src = 'js/jquery.mCustomScrollbar.concat.min.js';
            //po4.type = "text/javascript"
            //s4 = document.getElementsByTagName('script')[1];
            //s4.parentNode.insertBefore(po4, s4);

            //po4 = null;
            //s4 = null;
            //po4 = document.createElement('script');
            //// po4.type = 'text/javascript';
            //po4.async = true;
            //po4.src = 'js/jsgrid.min.js';
            //po4.type = "text/javascript"
            //s4 = document.getElementsByTagName('script')[1];
            //s4.parentNode.insertBefore(po4, s4);


            //po4 = null;
            //s4 = null;
            //po4 = document.createElement('script');
            //// po4.type = 'text/javascript';
            //po4.async = true;
            //po4.src = 'js/moment.js';
            //po4.type = "text/javascript"
            //s4 = document.getElementsByTagName('script')[1];
            //s4.parentNode.insertBefore(po4, s4);

            //po4 = null;
            //s4 = null;
            //po4 = document.createElement('script');
            //// po4.type = 'text/javascript';
            //po4.async = true;
            //po4.src = 'js/chosen.jquery.min.js';
            //po4.type = "text/javascript"
            //s4 = document.getElementsByTagName('script')[1];
            //s4.parentNode.insertBefore(po4, s4);



            //po4 = null;
            //s4 = null;
            //po4 = document.createElement('script');
            //// po4.type = 'text/javascript';
            //po4.async = true;
            //po4.src = 'js/jquery.bootbox.js';
            //po4.type = "text/javascript"
            //s4 = document.getElementsByTagName('script')[1];
            //s4.parentNode.insertBefore(po4, s4);

            //po4 = null;
            //s4 = null;
            //po4 = document.createElement('script');
            //// po4.type = 'text/javascript';
            //po4.async = true;
            //po4.src = 'js/bootstrap.min.js';
            //po4.type = "text/javascript"
            //s4 = document.getElementsByTagName('script')[1];
            //s4.parentNode.insertBefore(po4, s4);


            //po4 = null;
            //s4 = null;
            //po4 = document.createElement('script');
            //// po4.type = 'text/javascript';
            //po4.async = true;
            //po4.src = 'js/jquery-ui.js';
            //po4.type = "text/javascript"
            //s4 = document.getElementsByTagName('script')[1];
            //s4.parentNode.insertBefore(po4, s4);


        })();


        var settings = $.extend({}, defaults, option);
        var apiurl = AmazonAPiURL + "/api/CompanyProfile/GetGeneratingUnits"
        var GridLoaded = false;
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var response = this.responseText;
                response = JSON.parse(response);
                GenUnitTestData = response.data;
                var apiurl1 = AmazonAPiURL + "/api/CompanyProfile/GetGeneratingUnits?skip=17000"
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {                        
                        var response = this.responseText;
                        response = JSON.parse(response);
                        var UnitData = response.data;
                        GenUnitTestData = GenUnitTestData.concat(UnitData);
                        FillGenUnitGrid_Test(GenUnitTestData);

                    }
                    else {
                        if (GridLoaded == false) {
                            GridLoaded = true;
                            FillGenUnitGrid_Test(GenUnitTestData);
                        }
                    }
                };
                xmlHttp.open("GET", apiurl1, true);
                xmlHttp.send();
                $('#GUTPageDropdown').css('display', 'none');
                $(".GeneratingUnitsTestpager").on("change", function () {
                    $("#GenUnitContent_Test").jsGrid("option", "pageSize", $(this).val());
                    // $("#externalPager .jsgrid-pager").append(PageDropDown);
                    $("#GeneratingUnitsTestpager").val($(this).val());
                });
                $('#Search_TestGUT').on('keyup', function (e) {
                    event.preventDefault();
                    if (event.keyCode === 13) {
                        searchGeneartingUnitsData();
                    }
                });
                //$("#btnApply_TestGenUnit").on("click", function () {
                //    Apply_TestGenUnitFilter();
                //});

                //$("#btnClear_TestGenUnit").on("click", function () {
                //    Clear_TestGenUnitFilter();
                //});


            }
        };
        xmlHttp.open("GET", apiurl, true);
        xmlHttp.send();
        Suggestive_GUT_PowerplantResults();
        fill_Test_GenUnitStates();
        var element = "";
        element = templates.GeneratingUnits;
        return this.html(element)

    }

})(jQuery);


function searchGeneartingUnitsData() {
    try {
        var Search_TestGUT = $('#Search_TestGUT').val();
        $('#Search_TestGUTautocomplete-list').css('display', 'none');
        var UnitsData = GenUnitTestData
        if (Search_TestGUT) {
            UnitsData = GenUnitTestData.filter(function (el) {
                if (el.operatingUtility.toLowerCase().indexOf(Search_TestGUT.toLowerCase().trim()) > -1 || el.powerPlant.toLowerCase().indexOf(Search_TestGUT.toLowerCase().trim()) > -1) {
                    return el;
                }
                //else if (el.powerPlant != null && el.powerPlant != undefined && ) {
                //    return el;
                //}
            });
        }
        setTimeout(function () { FillGenUnitGrid_Test(UnitsData); }, 500);
    } catch (e) {
        console.log(ex.message);
    }
}
function SearchGUTUtilityandPowerPlant() {
    try {
        searchGeneartingUnitsData();

    } catch (e) {
        console.log(e.message);
    }
}

function Apply_TestGenUnitFilter() {
    var States = $("#GenUnit_TestStates").val();
    var NERCRegions = $("#GenUnit_TestRegion").val();
    var PrimeMover = $("#GenUnit_TestPrimeMovers").val();
    var Status = $("#GenUnit_TestStatus").val();
    var FuelTypes = $("#GenUnit_TestFuelTypes").val();
    var OnlineYearFrom = $('#txt_TestOnlineYearFrom').val();
    var OnlineYearTo = $('#txt_TestOnlineYearTo').val();
    var NamePlateCapFrom = $('#txt_TestNamePlateCapFrom').val();
    var NamePlateCapTo = $('#txt_TestNamePlateCapTo').val();
    var SummerCapFrom = $('#txt_TestSummerCapFrom').val();
    var SummerCapTo = $('#txt_TestSummerCapTo').val();
    var Search_TestGUT = $('#Search_TestGUT').val();

    //if (States[0] == "ALL" && NERCRegions[0] == "ALL" && Status[0] == "ALL" && FuelTypes[0] == "ALL" && PrimeMover[0] == "ALL") {
    //    return;
    //}
    //else {
    Clear_TestGenUnitGrid();
    if (GenUnitTestData == undefined || GenUnitTestData == null) {

        var apiurl = AmazonAPiURL + "/api/CompanyProfile/GetGeneratingUnits"
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                var response = this.responseText;
                response = JSON.parse(response);
                GenUnitTestData = response.data;
                Test_ApplyFilter(GenUnitTestData);
            }
        };
        xmlHttp.open("GET", apiurl, true);
        xmlHttp.send();


    }
    else
        Test_ApplyFilter(GenUnitTestData);
    //}
}
function Clear_TestGenUnitFilter() {
    Clear_TestGenUnitGrid();
    Test_SetDefaultValues();
    setTimeout(function () { FillGenUnitGrid_Test(GenUnitTestData); }, 500);
}
function Test_SetDefaultValues() {
    $("#GenUnit_TestStates").val("ALL");
    $("#GenUnit_TestRegion").val("ALL");
    $("#GenUnit_TestPrimeMovers").val("ALL");
    $("#GenUnit_TestStatus").val("ALL");
    $("#GenUnit_TestFuelTypes").val("ALL");
    $("#txt_TestOnlineYearFrom").val(1856);
    $("#txt_TestOnlineYearTo").val(2030);
    $("#txt_TestNamePlateCapFrom").val(0);
    $("#txt_TestNamePlateCapTo").val(99999);
    $("#txt_TestSummerCapFrom").val(0);
    $("#txt_TestSummerCapTo").val(99999);
    $('#Search_TestGUT').val("");
}
function Test_ApplyFilter(GenUnitData) {
    var States = $("#GenUnit_TestStates").val();
    var NERCRegions = $("#GenUnit_TestRegion").val();
    var PrimeMover = $("#GenUnit_TestPrimeMovers").val();
    var Status = $("#GenUnit_TestStatus").val();
    var FuelTypes = $("#GenUnit_TestFuelTypes").val();
    var OnlineYearFrom = $('#txt_TestOnlineYearFrom').val();
    var OnlineYearTo = $('#txt_TestOnlineYearTo').val();
    var NamePlateCapFrom = $('#txt_TestNamePlateCapFrom').val();
    var NamePlateCapTo = $('#txt_TestNamePlateCapTo').val();
    var SummerCapFrom = $('#txt_TestSummerCapFrom').val();
    var SummerCapTo = $('#txt_TestSummerCapTo').val();
    var Search_TestGUT = $('#Search_TestGUT').val();

    var StatesData = GenUnitData.filter(function (el) {
        if (States[0] == "ALL")
            return el;
        else
            if (el.state != null && el.state != undefined && States.indexOf(el.state.trim()) > -1)
                return el;
    })
    var NERCData = StatesData.filter(function (el) {
        if (NERCRegions[0] == "ALL")
            return el;
        else
            if (el.nerc != null && el.nerc != undefined && NERCRegions.indexOf(el.nerc.trim()) > -1)
                return el;
    })
    var PrimeMoverData = NERCData.filter(function (el) {
        if (PrimeMover[0] == "ALL")
            return el;
        else
            if (el.primeMover != null && el.primeMover != undefined && PrimeMover.indexOf(el.primeMover.trim()) > -1)
                return el;
    })
    var StatusData = PrimeMoverData.filter(function (el) {
        if (Status[0] == "ALL")
            return el;
        else
            if (el.status != null && el.status != undefined && Status.indexOf(el.status.trim()) > -1)
                return el;
    })
    var FuelTypesData = StatusData.filter(function (el) {
        if (FuelTypes[0] == "ALL")
            return el;
        else
            if (el.primaryFuel != null && el.primaryFuel != undefined && FuelTypes.indexOf(el.primaryFuel.trim()) > -1)
                return el;
    })

    var OnlineYearData;
    if (parseInt(OnlineYearFrom) >= 0 && parseInt(OnlineYearTo) >= 0) {
        OnlineYearData = FuelTypesData.filter(function (el) {
            return parseInt(el.onlineYear) >= parseInt(OnlineYearFrom) && parseInt(el.onlineYear) <= parseInt(OnlineYearTo)
        })
    }
    else
        OnlineYearData = FuelTypesData;

    var NamePlateCapacityData;
    if (parseInt(NamePlateCapFrom) >= 0 && parseInt(NamePlateCapTo) >= 0) {
        NamePlateCapacityData = OnlineYearData.filter(function (el) {
            return parseInt(el.capacity) >= parseInt(NamePlateCapFrom) && parseInt(el.capacity) <= parseInt(NamePlateCapTo)
        })
    }
    else
        NamePlateCapacityData = OnlineYearData;

    var SummerCapacityData;
    if (parseInt(SummerCapFrom) >= 0 && parseInt(SummerCapTo) >= 0) {
        SummerCapacityData = NamePlateCapacityData.filter(function (el) {
            return parseInt(el.summerCapacity) >= parseInt(SummerCapFrom) && parseInt(el.summerCapacity) <= parseInt(SummerCapTo)
        })
    }
    else
        SummerCapacityData = NamePlateCapacityData;



    setTimeout(function () { FillGenUnitGrid_Test(SummerCapacityData); }, 500);
}
function Clear_TestGenUnitGrid() {
    $('#GenUnitContent_Test').empty();
    $('#GenUnitContent_Test').html("<b>&nbsp;&nbsp; Loading... </b><br/><br/>");
}
function fill_Test_GenUnitStates() {
    // var apiurl = AmazonAPiURL+"/api/CompanyProfile/GetPowerState";
    var apiurl = AmazonAPiURL + "/api/CompanyProfile/GetAllGeneratingUnitOptions";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            
            response = JSON.parse(this.responseText);
            if (response.error == "") {
                $("#GenUnit_TestStates").html('');
                $("#GenUnit_TestStates").append($('<option></option>').attr("value", "ALL").html("ALL"));
                $("#GenUnit_TestStates").val("ALL");
                for (i = 0; i < response.sates.length; i++) {
                    var obj = response.sates[i];
                    $("#GenUnit_TestStates").append($('<option></option>').attr("value", obj.stateCode1).html(obj.stateProvince));
                }
                fill_Test_GenUnitNERCRegion(response);
            }
            else {
                alert(response.error);
            }

        }
        else {
            // console.log(this.responseText);
        }
    };
    xmlHttp.open("GET", apiurl, true);
    xmlHttp.send();
}

function fill_Test_GenUnitNERCRegion(Data) {
    if (!Data.nerc) {
        var apiurl = AmazonAPiURL + "/api/CompanyProfile/GetAllGeneratingUnitOptions";
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                response = JSON.parse(this.responseText);
                if (response.error == "") {
                    $("#GenUnit_TestRegion").html('');
                    $("#GenUnit_TestRegion").append($('<option></option>').attr("value", "ALL").html("ALL"));
                    $("#GenUnit_TestRegion").val("ALL");
                    for (i = 0; i < response.nerc.length; i++) {
                        var obj = response.nerc[i];
                        $("#GenUnit_TestRegion").append($('<option></option>').attr("value", obj.nercregionCode).html(obj.nercregionCode));
                    }
                }
                else {
                    alert(response.error);
                }

            }
            else {
                // console.log(this.responseText);
            }
        };
        xmlHttp.open("GET", apiurl, true);
        xmlHttp.send();
    }
    else {
        $("#GenUnit_TestRegion").html('');
        $("#GenUnit_TestRegion").append($('<option></option>').attr("value", "ALL").html("ALL"));
        $("#GenUnit_TestRegion").val("ALL");
        for (i = 0; i < Data.nerc.length; i++) {
            var obj = Data.nerc[i];
            $("#GenUnit_TestRegion").append($('<option></option>').attr("value", obj.nercregionCode).html(obj.nercregionCode));
        }
    }
    fill_Test_GenUnitPrimeMover(response);
}
function fill_Test_GenUnitPrimeMover(Data) {
    if (!Data.primeMover) {
        var apiurl = AmazonAPiURL + "/api/CompanyProfile/GetAllGeneratingUnitOptions";
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {

                response = JSON.parse(this.responseText);
                if (response.error == "") {
                    $("#GenUnit_TestPrimeMovers").html('');
                    $("#GenUnit_TestPrimeMovers").append($('<option></option>').attr("value", "ALL").html("ALL"));
                    $("#GenUnit_TestPrimeMovers").val("ALL");
                    for (i = 0; i < response.primeMover.length; i++) {
                        var obj = response.primeMover[i];
                        $("#GenUnit_TestPrimeMovers").append($('<option></option>').attr("value", obj.primeMover).html(obj.primeMover));
                    }
                }
                else {
                    alert(response.error);
                }

            }
            else {
                console.log(this.responseText);
            }
        };
        xmlHttp.open("GET", apiurl, true);
        xmlHttp.send();
    }
    else {
        $("#GenUnit_TestPrimeMovers").html('');
        $("#GenUnit_TestPrimeMovers").append($('<option></option>').attr("value", "ALL").html("ALL"));
        $("#GenUnit_TestPrimeMovers").val("ALL");
        for (i = 0; i < Data.primeMover.length; i++) {
            var obj = Data.primeMover[i];
            $("#GenUnit_TestPrimeMovers").append($('<option></option>').attr("value", obj.primeMover).html(obj.primeMover));
        }
    }
}
function FillGenUnitGrid_Test(GenUnitTestData) {
    try {
        $("#GenUnitsLoader_Test").show();
        $('#GenUnitContent_Test').html("");
        $('#GUTPageDropdown').css('display', 'block');
        $("#GeneratingUnitsTestpager").val("25");
        $("#GenUnitContent_Test").jsGrid({
            height: "auto",
            width: "100%",
            sorting: true,
            paging: true,
            autoload: true,
            pageButtonCount: 5,
            selectable: true,
            data: GenUnitTestData,
            pageSizes: 25,
            pagerContainer: "#GenUnitexternalPager",
            pagerFormat: "Pages: {pageIndex} &nbsp;&nbsp; {first} {prev} {pages} {next} {last} &nbsp;&nbsp; {pageIndex} of {pageCount} ",
            pagePrevText: "Prev",
            pageNextText: "Next",
            pageFirstText: "First",
            pageLastText: "Last",
            pageNavigatorNextText: "&#8230;",
            pageNavigatorPrevText: "&#8230;",
            fields: [
                { name: "unitID", visible: false, title: "ID" },
                { name: "powerID", visible: false, title: 'PowerID' },
                {
                    name: "operatingUtility", title: 'Operating Utility', width: '16%'
                    , itemTemplate: function (item, value) {

                        var _object = value.operatingUtility;
                        var CompID = value.companyID;
                        return "<a class=GenOperLink href='javascript:void(0)' onclick='Gen_Test_UnitsPlantOperatorModal(" + CompID + ")'>" + _object + "</a>"

                    }
                },
                {
                    name: "powerPlant", title: 'Power Plant', width: '16%'
                    , itemTemplate: function (item, value) {
                        var _object = value.powerPlant;
                        var PowerID = value.powerID;
                        var CompanyID = value.companyID;
                        return "<a class=GenPlantLink href='javascript:void(0)' onclick='Gen_Test_UnitsPlantModal(" + PowerID + "," + CompanyID + ")'>" + _object + "</a>"
                    }
                },
                { name: "state", title: 'State', width: "7%" },
                { name: "generator", title: 'Generator', width: "7%" },
                { name: "primeMover", title: 'Prime Mover', width: "10%" },
                { name: "status", title: 'Status', width: '11%' },
                {
                    name: "capacity", title: 'Capacity<br/>(MW)', width: '7%'
                    , itemTemplate: function (item, value) {

                        var Capacity = value.capacity;
                        if (Capacity != undefined && Capacity != null && Capacity != "")
                            return Capacity.toFixed(2);
                        else
                            return Capacity;
                    }
                },
                {
                    name: "summerCapacity", title: 'Summer Capacity<br/>(MW)', width: "15%", itemTemplate: function (item, value) {
                        var summerCapacity = value.summerCapacity;
                        if (summerCapacity != undefined && summerCapacity != null && summerCapacity != "")
                            return summerCapacity.toFixed(2);
                        else
                            return summerCapacity;

                    }
                },
                { name: "onlineYear", title: 'Online Year', width: '9%' },
                { name: "primaryFuel", title: 'Primary Fuel', width: '9%' },

            ]
        });
        $("#GenUnitContent_Test").jsGrid("option", "pageSize", 25);
        $("#GenUnitsLoader_Test").hide();
    }
    catch (err) {
        console.log("GenUnitsGridTest Err : " + err);
        $("#GenUnitsLoader_Test").hide();
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
function Gen_Test_UnitsPlantOperatorModal(CompanyID) {
    var URL = window.location.href;
    if (URL) {
        URL = URL.replace("GeneratingUnits.html", "OperatingUtilitydetail.html");
        URL = URL + "?t=" + CompanyID;
        window.open(URL, '_blank', 'location=yes,height=600,width=1000,scrollbars=yes,status=yes');      
        //PopupCenter(URL, 'Operating Utility', '800', '600');
    }
    //$("#GenUnitsLoader_Test").show();

    //var apiurl = AmazonAPiURL + "/api/CompanyProfile/GetPlantOperatorByID?cID=" + CompanyID
    //var xmlHttp = new XMLHttpRequest();
    //xmlHttp.onreadystatechange = function () {
    //    if (this.readyState == 4 && this.status == 200) {

    //        var response = this.responseText;

    //        var Data = JSON.parse(response);
    //        Data = JSON.parse(Data);
    //        $("#modal-GenUnitsbodyPlantOperator_Test").html("");
    //        var TotalCapacity = 0;
    //        var html = '<div class="row-fluid"><span class="PlantOperatorHeader">' + Data.data.CompanyName + '</span></div><br/>'
    //        //$("#modal-bodyPlantOperator_Test").append(html);
    //        //html = '';
    //        var CompType = Data.data.CompanyType;
    //        if (CompType == null || CompType == 'null') {
    //            CompType = '';
    //        }
    //        //html += '<div class="row-fluid"><div class="span12" id="span121"><div class="span6"><span class="PlantOperatorSubHeader">Contact Details</span><br> <br><div class="Contact_box">' +
    //        //        '<div class="row-fluid"><div class="span4"><b>Physical Address 1 :</b></div><div class="span8">' + Data.data.PhysicalAddress1 + '</div></div>'+
    //        //        '<div class="row-fluid"><div class="span4"><b>Physical Address 2 :</b></div><div class="span8">' + Data.data.PhysicalAddress2 + '</div></div>' +
    //        //        '<div class="row-fluid"><div class="span4"><b>City/State/Zip :</b></div><div class="span8">' + Data.data.City + ',' + Data.data.State + ',' + Data.data.Zip + '</div></div>' +
    //        //        '<div class="row-fluid"><div class="span4"><b>Country :</b></div><div class="span8">' + Data.data.Country + '</div></div>' +
    //        //        '<div class="row-fluid"><div class="span4"><b>Company Type:</b></div><div class="span8">' + CompType + '</div></div><div class="row-fluid"><div class="span4"><b>Parent Company:</b></div><div class="span8">' + Data.data.ParentCompany + '</div></div></div></div>'
    //        //$("#modal-GenUnitsbodyPlantOperator_Test").html(html);
    //        var htmlAddress2 = '';
    //        if (Data.data.PhysicalAddress2) {
    //            htmlAddress2 = '<br/>' + Data.data.PhysicalAddress2
    //        }
    //        html += '<div class="row-fluid"><div class="span12" id="span121"><div class="span6"><span class="PlantOperatorSubHeader">Contact Details</span><br> <br><div class="Contact_box">' +
    //                '<div class="row-fluid"><div class="span4"><b>Address</b></div><div class="span8">' + Data.data.PhysicalAddress1 + '' + htmlAddress2 + '<br />' + Data.data.City + ', ' + Data.data.State + ' ' + Data.data.Zip + '<br />' + Data.data.Country +
    //                '</div></div><div class="row-fluid"><div class="span4"><b>Company Type:</b></div><div class="span8">' + CompType + '</div></div><div class="row-fluid"><div class="span4"><b>Parent Company:</b></div><div class="span8">' + Data.data.ParentCompany + '</div></div></div></div>'
    //        $("#modal-GenUnitsbodyPlantOperator_Test").html(html);
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
    //        html += '<div class="row-fluid PlantOperatorContent"> <table id="GeneratingGrid_Test" class="table table-hover table-striped table-bordered grid" style="border-left: 1px solid #ddd;" cellspacing="0" width="100%"><thead><tr><th>Power Plant</th><th>City</th><th>County</th><th>State</th><th>NERC</th><th>Capacity MWs</th><th>Planned<br />Increases MWs</th><th>Primary Fuel</th><th>Sector</th></tr></thead><tbody id="GeneratingGrid_Test_tbody"></tbody></table></div>'
    //        $("#modal-GenUnitsbodyPlantOperator_Test").append(html);
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
    //        $("#GeneratingGrid_Test_tbody").html("");
    //        $("#GeneratingGrid_Test_tbody").html(html);
    //        $("#GenUnitsLoader_Test").hide();
    //        $("#modal-GenUnitsPlantsOperator_Test").css('height', '80%');
    //        $("#modal-GenUnitsbodyPlantOperator_Test").css('max-height', 'none');
    //        $("#modal-GenUnitsPlantsOperator_Test").on('show', function () {
    //            $(this).addClass("modalPlantOperator");
    //        })
    //        //$("#modal-GenUnitsPlantsOperator_Test").on('shown.bs.modal', function () {
    //        //    resize_Test_GenUnitsPlantOperatorPopup();
    //        //})
    //        $("#modal-GenUnitsPlantsOperator_Test").on('hidden.bs.modal', function () {
    //            $(this).removeClass("modalPlantOperator");
    //        })
    //        $("#modal-GenUnitsPlantsOperator_Test").modal('show');
    //    }
    //    else {
    //        // alert(this.responseText);
    //        //console.log(this.responseText);
    //    }
    //};
    //xmlHttp.open("GET", apiurl, true);
    //xmlHttp.send();



}

function Gen_Test_UnitsPlantModal(PowerID, CompanyID) {
    var URL = window.location.href;
    if (URL) {
        URL = URL.replace("GeneratingUnits.html", "PowerPlantdetail.html");
        URL = URL + "?p=" + PowerID + "&c=" + CompanyID + "&Type=GeneratingUnits";
        window.open(URL, '_blank', 'location=yes,height=600,width=1050,scrollbars=yes,status=yes');

    }
    //$("#GenUnitsLoader_Test").show();
    //var apiurl = AmazonAPiURL + "/api/CompanyProfile/GetPowerPlantByID?PowerID=" + PowerID + "&CompanyID=" + CompanyID;
    //var xmlHttp = new XMLHttpRequest();
    //xmlHttp.onreadystatechange = function () {
    //    if (this.readyState == 4 && this.status == 200) {

    //        var response = this.responseText;
    //        var Data = JSON.parse(response);
    //        Data = JSON.parse(Data);

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

    //        var html = '<div class="row-fluid"> <span class="PlantOperatorHeader" >' + Data.data.Name + '</span> </div><br />';
    //        html += ' <div class="row-fluid"> <div class="span12"> <div class="span4" id="Gnspan6_1"></div><div class="span4" id="GNspan6_2"></div><div class="span4" id="GNspan6_3"></div></div></div>';
    //        $("#modal-GenUnitsbodyPowerPlantPopup_Test").html(html);
    //        html = ''
    //        html = '<div class="left_box"><div class="row-fluid"><div class="span4"><b>Operating Utility</b></div><div class="span8">' + OperatingUtility + '</div></div>' +
    //            '<div class="row-fluid"><div class="span4"><b>Ownership Type:</b></div><div class="span8">' + OwnershipType + '</div></div>' +
    //            '  <div class="row-fluid"><div class="span4"><b>Country</b></div><div class="span8">' + Country + '</div></div>' +
    //            '<div class="row-fluid"><div class="span4"><b>City/State:</b></div><div class="span8">' + City + ', ' + Data.data.State + '</div></div>' +
    //            '<div class="row-fluid"><div class="span4"><b>County:</b></div><div class="span8">' + Data.data.County + '</div></div>' +
    //            '<div class="row-fluid"><div class="span4"><b>NERC Region:</b></div><div class="span8">' + NERC + '</div></div>' +
    //            ' <div class="row-fluid"> <div class="span4"><b>ISO/RTO:</b></div> <div class="span8">' + ISO + '</div></div>' +
    //            '<div class="row-fluid"><div class="span4"><b>Trans Facility Owner:</b></div><div class="span8">' + TransFacilityOwner + '</div></div></div>'
    //        $("#Gnspan6_1").html("");
    //        $("#Gnspan6_1").append(html);
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
    //        $("#GNspan6_2").html("");
    //        $("#GNspan6_2").append(html);
    //        html = '';
    //        html = '<div class="reg_bg" style="height: 350px; width: 100%"><div id="GUnitsTest_map_canvas" style="width: 100%; height: 100%;"></div></div>';
    //        $("#GNspan6_3").html("");
    //        $("#GNspan6_3").append(html);
    //        html = '';
    //        html = '<br /><span class="PlantOperatorHeader">Existing & Planned Unit Data</span><br /><br />';
    //        $("#modal-GenUnitsbodyPowerPlantPopup_Test").append(html);
    //        html = '';
    //        html = ' <div class="row-fluid PowerPlantUnitsContent">  <table id="GeneratingUnitsGrid_Test" class="table table-hover table-striped table-bordered grid" style="border-left: 1px solid #ddd;" cellspacing="0" width="100%"> <thead><tr><th>Generator</th><th>Prime Mover</th>' +
    //                '<th>NamePlate<br /> Capacity MWs</th><th>Summer<br /> Capabilitiy MWs</th><th>Status</th><th>Online<br />Year</th><th>Primary Fuel</th><th>Ownership</th></tr></thead> <tbody id="GeneratingUnitsGrid_Test_tbody"></tbody></table></div>';
    //        $("#modal-GenUnitsbodyPowerPlantPopup_Test").append(html);
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
    //                var Ownership = Data.data.PowerUnits[i].Ownership
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

    //                if (NamePlateCapacity) {
    //                    NamePlateCapacity = parseFloat(NamePlateCapacity)
    //                    NamePlateCapacity = NamePlateCapacity.toFixed(2);
    //                }
    //                if (SummerCapabilities) {
    //                    SummerCapabilities = parseFloat(SummerCapabilities)
    //                    SummerCapabilities = SummerCapabilities.toFixed(2);

    //                }

    //                html += '<tr><td>' + Generator + '</td><td>' + PrimeMover + '</td><td>' + NamePlateCapacity + '</td><td>' + SummerCapabilities + '</td><td>' + Status + '</td><td>' + OnlineYear +
    //                    '</td><td>' + PrimaryFuel + '</td><td>' + Ownership + '</td></tr>';
    //            }
    //        }
    //        $("#GeneratingUnitsGrid_Test_tbody").html("");
    //        $("#GeneratingUnitsGrid_Test_tbody").html(html);

    //        $("#GenUnitsLoader_Test").hide();
    //        $("#modal-GenUnitsPowerPlantPopup_Test").css('height', '80%');
    //        $("#modal-GenUnitsPowerPlantPopup_Test").css('max-height', 'none');
    //        $("#modal-GenUnitsPowerPlantPopup_Test").on('show', function () {
    //            $(this).addClass("modalPlantOperator");
    //        })
    //        $("#modal-GenUnitsPowerPlantPopup_Test").on('shown.bs.modal', function () {
    //            
    //            GUnitsTest_map_canvas_initialize_map(Data.data.latitude, Data.data.longitude);
    //            //resize_Test_GenUnitsPowerPlantPopup();
    //        })
    //        $("#modal-GenUnitsPowerPlantPopup_Test").on('hidden.bs.modal', function () {
    //            $("#main").css('margin-left', '0px');
    //            $(this).removeClass("modalPlantOperator");
    //        })
    //        //$("#modal-bodyPowerPlantPopup_Test").html(response);
    //        $("#modal-GenUnitsPowerPlantPopup_Test").modal('show');
    //        $("#main").css('margin-left', '0px');
    //    }
    //    else {
    //        // alert(this.responseText);
    //        //console.log(this.responseText);
    //    }
    //};
    //xmlHttp.open("GET", apiurl, true);
    //xmlHttp.send();


}

function resize_Test_GenUnitsPlantOperatorPopup() {
    var popupHeight = $("#modal-GenUnitsPlantsOperator_Test").height()
    if (popupHeight > 0) {
        var bodyMaxHeight = popupHeight - 50;
        if (bodyMaxHeight < 150) {
            bodyMaxHeight = 150;
        }
        $("#modal-GenUnitsPlantsOperator_Test .modal-body").css('max-height', bodyMaxHeight);

        var ActualBodyHeight = $("#modal-GenUnitsPlantsOperator_Test").height()
        if (ActualBodyHeight < bodyMaxHeight) {
            $("#modal-GenUnitsbodyPlantOperator_Test").css('height', ActualBodyHeight + 50);
        }
    }
}
function resize_Test_GenUnitsPowerPlantPopup() {
    var popupHeight = $("#modal-GenUnitsPowerPlantPopup_Test").height()
    if (popupHeight > 0) {
        var bodyMaxHeight = popupHeight - 50;
        if (bodyMaxHeight < 150) {
            bodyMaxHeight = 150;
        }
        $("#modal-GenUnitsPowerPlantPopup_Test .modal-body").css('max-height', bodyMaxHeight);

        var ActualBodyHeight = $("#modal-GenUnitsbodyPowerPlantPopup_Test").height()
        if (ActualBodyHeight < bodyMaxHeight) {
            $("#modal-GenUnitsPowerPlantPopup_Test").css('height', ActualBodyHeight + 50);
        }
    }
}


function Suggestive_GUT_PowerplantResults() {
    try {
        
        var apiurl = AmazonAPiURL + "/api/CompanyProfile/GetSuggestiveGeneratingUnitsResults";
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                response = JSON.parse(this.responseText);
                response = JSON.parse(response);
                if (response) {
                    autocomplete_Test_GUT(document.getElementById("Search_TestGUT"), response);
                }

            }
            else {
                // alert(this.responseText);
                // console.log(this.responseText);
            }
        };
        xmlHttp.open("GET", apiurl, true);
        xmlHttp.send();
    } catch (e) {
        console.log(e.message);
    }
}






function autocomplete_Test_GUT(inp, arr) {
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
        var j = 0;
        /*for each item in the array...*/
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
