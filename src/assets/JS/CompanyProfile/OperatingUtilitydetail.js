// var AmazonAPiURL = 'https://avp8hf6otb.execute-api.us-east-1.amazonaws.com/Prod';
var AmazonAPiURL = 'https://nqzkggqnbb.execute-api.us-east-1.amazonaws.com/Prod';
AmazonAPiURL = "https://node.envisionmaps.net"
$(window).load(function () {

    var qs = getQueryStrings();
    var id = 0;
    if (qs) {
        id = qs["t"];
    }
    if (id) {
        OpenPlantOperatorModal_Test(id)
    }
    else {
        ShowEmptyPlantOperator();
        $("#powerPlantsTestLoader").hide();
    }
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

function OpenPlantOperatorModal_Test(CompanyID) {

    $("#powerPlantsTestLoader").show();
    var apiurl = AmazonAPiURL + "/api/PowerPlants/GetPlantOperatorByID?CompanyID=" + CompanyID
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {            
            var response = this.responseText;
            var Data = JSON.parse(response);
            if (Data._Issuccess) {
                var powerData =Data.GetPlantOperatorByIDData
                $("#modal-bodyPlantOperator_Test").html("");
                var TotalCapacity = 0;
                var html = '<div class="row-fluid"><span class="PlantOperatorHeader">' + powerData.CompanyName + '</span></div><br/>'


                var CompType =powerData.CompanyType;
                if (CompType == null || CompType == 'null') {
                    CompType = '';
                }
                //html += '<div class="row-fluid"><div class="span12" id="span121"><div class="span6"><span class="PlantOperatorSubHeader">Contact Details</span><br> <br><div class="Contact_box">' +
                //       '<div class="row-fluid"><div class="span4"><b>Physical Address 1 :</b></div><div class="span8">' +powerData.PhysicalAddress1 + '</div></div>' +
                //       '<div class="row-fluid"><div class="span4"><b>Physical Address 2 :</b></div><div class="span8">' +powerData.PhysicalAddress2 + '</div></div>' +
                //       '<div class="row-fluid"><div class="span4"><b>City/State/Zip :</b></div><div class="span8">' +powerData.City + ',' +powerData.State + ',' +powerData.Zip + '</div></div>' +
                //       '<div class="row-fluid"><div class="span4"><b>Country :</b></div><div class="span8">' +powerData.Country + '</div></div>' +
                //       '<div class="row-fluid"><div class="span4"><b>Company Type:</b></div><div class="span8">' + CompType + '</div></div><div class="row-fluid"><div class="span4"><b>Parent Company:</b></div><div class="span8">' +powerData.ParentCompany + '</div></div></div></div>'
                //$("#modal-bodyPlantOperator_Test").html(html);
                var htmlAddress2 = '';
                if (powerData.PhysicalAddress2) {
                    htmlAddress2 = '<br/>' +powerData.PhysicalAddress2
                }
                html += '<div class="row-fluid"><div class="span12" id="span121"><div class="span6"><span class="PlantOperatorSubHeader">Contact Details</span><br> <br><div class="Contact_box">' +
                    '<div class="row-fluid"><div class="span4"><b>Address</b></div><div class="span8">' +powerData.PhysicalAddress1 + htmlAddress2 + '<br/>' +powerData.City + ', ' +powerData.State + ' ' +powerData.Zip + '<br/>' +powerData.Country +
                    '</div></div><div class="row-fluid"><div class="span4"><b>Company Type:</b></div><div class="span8">' + CompType + '</div></div><div class="row-fluid"><div class="span4"><b>Parent Company:</b></div><div class="span8">' +powerData.ParentCompany + '</div></div></div></div>'
                $("#modal-bodyPlantOperator_Test").html(html);
                html = '';

                html = '<div class="span6"><span class="PlantOperatorSubHeader">Operating Summary</span><br/><br/><div class="Operator_box"><div class="row-fluid"><div class="span6"><b>Operating Capacity</b></div>' +
                    '<div class="span3"><b>MWs</b></div></div>'

                if (Data.Capacity.length > 0) {
                    for (var i = 0; i < Data.Capacity.length; i++) {
                        TotalCapacity = Data.Capacity[i].Value + TotalCapacity;
                        var Keyval = Data.Capacity[i].Value;
                        if (Keyval) {
                            Keyval = Keyval.toFixed(2);
                        }
                        html += '<div class="row-fluid"><div class="span6"><b>' + Data.Capacity[i].Key + '</b></div><div class="span3">' + Keyval + '</div><div class="span3"></div></div>'
                    }
                }

                html += '<div class="row-fluid"><div class="span6"><b>Total Capacity:</b></div>'
                if (TotalCapacity > 0) {
                    html += '<div class="span3">' + TotalCapacity.toFixed(2) + '</div>'
                } else {
                    html += '<div class="span3"></div>'
                }
                html += '<div class="span3"></div></div></div>'
                $("#span121").append(html);
                html = '';

                html = '<br /><span class="PlantOperatorSubHeader">Plant Data</span><br /><br />';
                html += '<div class="row-fluid PlantOperatorContent"> <table id="PlantOperatorGrid_Test" class="table table-hover table-striped table-bordered grid" style="border-left: 1px solid #ddd;" cellspacing="0" width="100%"><thead><tr><th>Power Plant</th><th>City</th><th>County</th><th>State</th><th>NERC</th><th>Capacity MWs</th><th>Planned<br />Increases MWs</th><th>Primary Fuel</th><th>Sector</th></tr></thead><tbody id="PlantOperatorGrid_tbody"></tbody></table></div>'
                $("#modal-bodyPlantOperator_Test").append(html);
                if (powerData.Plants.length > 0) {
                    html = '';
                    for (var i = 0; i <powerData.Plants.length; i++) {
                        var PlannedIncreasesMWs = powerData.Plants[i].PlannedIncreasesMWs
                        if (PlannedIncreasesMWs == null || PlannedIncreasesMWs == 'null') {
                            PlannedIncreasesMWs = ''
                        }
                        var Sector =powerData.Plants[i].Sector;
                        var PrimaryFuel =powerData.Plants[i].PrimaryFuel;
                        if (!Sector)
                            Sector = '';
                        if (!PrimaryFuel)
                            PrimaryFuel = '';
                        var CapacityMWs =powerData.Plants[i].CapacityMWs
                        var NERC =powerData.Plants[i].NERC
                        if (CapacityMWs) {
                            CapacityMWs = parseFloat(CapacityMWs)
                            CapacityMWs = CapacityMWs.toFixed(2);
                        }
                        else {
                            CapacityMWs = '';
                        }
                        if (NERC) {
                            //  NERC = parseFloat(NERC)
                            // NERC = NERC.toFixed(2);
                        }
                        else {
                            NERC = '';
                        }
                        html += '<tr><td>' +powerData.Plants[i].PlantName + '</td><td>' +powerData.Plants[i].City + '</td><td>' +powerData.Plants[i].County + '</td><td>' +powerData.Plants[i].State + '</td><td>' + NERC + '</td><td>' + CapacityMWs + '</td><td>' + PlannedIncreasesMWs + '</td><td>' + PrimaryFuel + '</td><td>' + Sector + '</td></tr>';
                    }
                }
                $("#PlantOperatorGrid_tbody").html("");
                $("#PlantOperatorGrid_tbody").html(html);
                $("#powerPlantsTestLoader").hide();
                $("#modal-PlantsOperator_Test").css('height', '80%');
                $("#modal-bodyPlantOperator_Test").css({ 'max-height': 'none', 'border': '1px solid #CBCBCB', 'margin-left': '1%', 'margin-right': '1%', 'border-radius': '4px' });

                //$("#modal-PlantsOperator_Test").on('show', function () {
                //    $(this).addClass("modalPlantOperator");
                //})
                ////$("#modal-PlantsOperator_Test").on('shown.bs.modal', function () {
                ////    resizePlantOperatorPopup_Test();
                ////})
                //$("#modal-PlantsOperator_Test").on('hidden.bs.modal', function () {
                //    $(this).removeClass("modalPlantOperator");
                //})
                //$("#modal-PlantsOperator_Test").modal('show');
            }
            else {
                // alert(this.responseText);
                //console.log(this.responseText);
            }
        }
    };
    xmlHttp.open("GET", apiurl, true);
    xmlHttp.send();
}


function ShowEmptyPlantOperator() {
    try {

        $("#modal-bodyPlantOperator_Test").html("");
        var TotalCapacity = 0;
        var html = '<div class="row-fluid"><span class="PlantOperatorHeader"></span></div><br/>'


        html += '<div class="row-fluid"><div class="span12" id="span121"><div class="span6"><span class="PlantOperatorSubHeader">Contact Details</span><br> <br><div class="Contact_box">' +
            '<div class="row-fluid"><div class="span4"><b>Address</b></div><div class="span8">' + '<br/>' + ', ' + ' ' + '<br/>' +
            '</div></div><div class="row-fluid"><div class="span4"><b>Company Type:</b></div><div class="span8">' + '</div></div><div class="row-fluid"><div class="span4"><b>Parent Company:</b></div><div class="span8">' + '</div></div></div></div>'
        $("#modal-bodyPlantOperator_Test").html(html);
        html = '';

        html = '<div class="span6"><span class="PlantOperatorSubHeader">Operating Summary</span><br/><br/><div class="Operator_box"><div class="row-fluid"><div class="span6"><b>Operating Capacity</b></div>' +
            '<div class="span3"><b>MWs</b></div></div>'


        html += '<div class="row-fluid"><div class="span6"><b>' + '</b></div><div class="span3">' + '</div><div class="span3"></div></div>'

        html += '<div class="row-fluid"><div class="span6"><b>Total Capacity:</b></div>'
        if (TotalCapacity > 0) {
            html += '<div class="span3">' + '</div>'
        } else {
            html += '<div class="span3"></div>'
        }
        html += '<div class="span3"></div></div></div>'
        $("#span121").append(html);
        html = '';

        html = '<br /><span class="PlantOperatorSubHeader">Plant Data</span><br /><br />';
        html += '<div class="row-fluid PlantOperatorContent"> <table id="PlantOperatorGrid_Test" class="table table-hover table-striped table-bordered grid" style="border-left: 1px solid #ddd;" cellspacing="0" width="100%"><thead><tr><th>Power Plant</th><th>City</th><th>County</th><th>State</th><th>NERC</th><th>Capacity MWs</th><th>Planned<br />Increases MWs</th><th>Primary Fuel</th><th>Sector</th></tr></thead><tbody id="PlantOperatorGrid_tbody"></tbody></table></div>'
        $("#modal-bodyPlantOperator_Test").append(html);

        html += '<tr><td>' + '</td><td>' + '</td><td>' + '</td><td>' + '</td><td>' + '</td><td>' + '</td><td>' + '</td><td>' + '</td><td>' + '</td></tr>';

        $("#PlantOperatorGrid_tbody").html("");
        $("#PlantOperatorGrid_tbody").html(html);
        $("#modal-PlantsOperator_Test").css('height', '80%');
        $("#modal-bodyPlantOperator_Test").css('max-height', 'none');

    } catch (e) {
        console.log(e.message);
    }
}