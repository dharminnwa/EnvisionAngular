// var AmazonAPiURL = 'https://avp8hf6otb.execute-api.us-east-1.amazonaws.com/Prod';
var AmazonAPiURL = 'https://nqzkggqnbb.execute-api.us-east-1.amazonaws.com/Prod';
AmazonAPiURL = "https://node.envisionmaps.net";
var type = '';
$(window).load(function () {
    var qs = getQueryStrings();
    var PowerID = 0;
    var CompanyID = 0;
    if (qs) {
        PowerID = qs["p"];
        CompanyID = qs["c"];
        type = qs["Type"];
    }
    if (PowerID && CompanyID) {
        OpenPlantModal_Test(PowerID, CompanyID)
    }
    else {
        ShowEmpty();
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

function OpenPlantModal_Test(PowerID, CompanyID) {
    $("#powerPlantsTestLoader").show();
    PowerID = parseInt(PowerID);
    CompanyID = parseInt(CompanyID);
    $.ajax({
        type: "GET",
        url: AmazonAPiURL + "/api/PowerPlants/GetPowerPlantByID?PowerID=" + PowerID + "&CompanyID=" + CompanyID,
        //contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response._Issuccess) {
                var Data = response.GetPowerPlantByIDData;
                var OperatingUtility = '';
                var OwnershipType = '';
                var Country = '';
                var City = '';
                var NERC = '';
                var ISO = '';
                var TransFacilityOwner = '';
                if (Data.OperatingUtility) {
                    OperatingUtility = Data.OperatingUtility
                }
                if (Data.OwnershipType) {
                    OwnershipType = Data.OwnershipType
                }
                if (Data.Country) {
                    Country = Data.Country
                }
                if (Data.City) { City = Data.City; }
                if (Data.NERC) { NERC = Data.NERC }
                if (Data.ISO) { ISO = Data.ISO }
                if (Data.TransFacilityOwner) { TransFacilityOwner = Data.TransFacilityOwner }
                //var html = '<div class="row-fluid"> <span class="PlantOperatorHeader" id="PlantOperatorHeaderName"></span> </div><br />';
                //html += ' <div class="row-fluid"> <div class="span12"> <div class="span4" id="span6_1"></div><div class="span4" id="span6_2"></div><div class="span4" id="span6_3"></div></div></div>';
                //$("#modal-bodyPowerPlantPopup_Test").html(html);
                //var html = '<div class="row-fluid"> <span class="PlantOperatorHeader" id="PlantOperatorHeaderName">' + Data.Name + '</span> </div><br />';
                //html += ' <div class="row-fluid"> <div class="span12"> <div class="span4" id="span6_1"></div><div class="span4" id="span6_2"></div><div class="span4" id="span6_3"></div></div></div>';
                //$("#modal-bodyPowerPlantPopup_Test").html(html);
                $("#PlantOperatorHeaderName").html(Data.Name);                
                html = ''
                html = '<div class="left_box"><div class="row-fluid"><div class="span4"><b>Operating Utility</b></div><div class="span8">' + OperatingUtility + '</div></div>' +
                    '<div class="row-fluid"><div class="span4"><b>Ownership Type:</b></div><div class="span8">' + OwnershipType + '</div></div>' +
                    '  <div class="row-fluid"><div class="span4"><b>Country</b></div><div class="span8">' + Country + '</div></div>' +
                    '<div class="row-fluid"><div class="span4"><b>City/State:</b></div><div class="span8">' + City + ', ' + Data.State + '</div></div>' +
                    '<div class="row-fluid"><div class="span4"><b>County:</b></div><div class="span8">' + Data.County + '</div></div>';
                if (type == "Power") {
                    html += '<div class="row-fluid"><div class="span4"><b>EIA Plant Code:</b></div><div class="span8">' + Data.PowerEIAPlantCode + '</div></div>'
                }
                html += '<div class="row-fluid"><div class="span4"><b>NERC Region:</b></div><div class="span8">' + NERC + '</div></div>' +
                    ' <div class="row-fluid"> <div class="span4"><b>ISO/RTO:</b></div> <div class="span8">' + ISO + '</div></div>' +
                    '<div class="row-fluid"><div class="span4"><b>Trans Facility Owner:</b></div><div class="span8">' + TransFacilityOwner + '</div></div></div>'
                $("#span6_1").html("");
                $("#span6_1").append(html);
                var HeatRate = Data.HeatRate;
                var PrimaryFuel = Data.PrimaryFuel;
                var WaterSource = Data.WaterSource;
                var RegulatoryStatus = Data.RegulatoryStatus;
                var Sector = Data.Sector;
                var CapacityFactor = Data.CapacityFactor;
                var Capacity = Data.Capacity
                if (HeatRate == null || HeatRate == 'null')
                    HeatRate = '';
                if (PrimaryFuel == null || PrimaryFuel == 'null')
                    PrimaryFuel = '';
                if (WaterSource == null || WaterSource == 'null')
                    WaterSource = '';
                if (RegulatoryStatus == null || RegulatoryStatus == 'null')
                    RegulatoryStatus = '';
                if (Sector == null || Sector == 'null')
                    Sector = '';
                if (CapacityFactor == null || CapacityFactor == 'null')
                    CapacityFactor = '';
                if (Capacity == null || Capacity == 'null')
                    Capacity = '';
                if (HeatRate) {
                    HeatRate = HeatRate.toFixed(2)
                }
                html = '';
                html = '  <div class="right_box"> <div class="row-fluid"><div class="span4"><b>Capacity (MWs):</b></div><div class="span8">' + Capacity + '</div></div>' +
                    '<div class="row-fluid"><div class="span4"><b>Capacity Factor:</b></div><div class="span8">' + CapacityFactor + '</div></div>' +
                    '<div class="row-fluid"><div class="span4"><b>Avg. Heat Rate (Btu/kWh):</b></div><div class="span8">' + HeatRate + '</div></div>' +
                    '<div class="row-fluid"><div class="span4"><b>Primary Fuel:</b></div><div class="span8">' + PrimaryFuel + '</div></div>' +
                    ' <div class="row-fluid"><div class="span4"><b>Water Source:</b></div><div class="span8">' + WaterSource + '</div></div>' +
                    '<div class="row-fluid"><div class="span4"><b>Regulatory Status:</b></div><div class="span8">' + RegulatoryStatus + '</div></div>' +
                    '<div class="row-fluid"><div class="span4"><b>Sector:</b></div><div class="span8">' + Sector + '</div></div></div>';
                $("#span6_2").html("");
                $("#span6_2").append(html);
                //html = '';
                //html = '<div class="reg_bg" style="height: 365px; width: 98%"><div id="Test_map_canvas" style="width: 100%; height: 100%;"></div></div>';
                // $("#span6_3").html("");
                //$("#span6_3").append(html);
                html = '';
                $("#TestLoadTable").html("");
                html = '<br /><span class="PlantOperatorHeader">Existing & Planned Unit Data</span><br /><br />';
                $("#TestLoadTable").append(html);
                html = '';
                html = ' <div class="row-fluid PowerPlantUnitsContent">  <table id="PowerPlantUnitsGrid_Test" class="table table-hover table-striped table-bordered grid" style="border-left: 1px solid #ddd;" cellspacing="0" width="100%"> <thead><tr><th>Generator</th><th>Prime Mover</th>' +
                    '<th>NamePlate<br /> Capacity MWs</th>';
                if (type == "Power") {
                    html += '<th>Proposed<br /> Capacity  MWs</th>'
                } else {
                    html += '<th>Summer<br /> Capacity  MWs</th>'
                }
                html += '<th>Status</th><th>Online<br />Year</th><th>Primary Fuel</th>';
                if (type != "Power") {
                    html += '<th>Ownership</th>';
                }
                html += '</tr></thead> <tbody id="PowerPlantUnitsGrid_Test_tbody"></tbody></table></div>';
                $("#TestLoadTable").append(html);
                html = '';
                if (Data.PowerUnits.length > 0) {
                    for (var i = 0; i < Data.PowerUnits.length; i++) {
                        var Generator = Data.PowerUnits[i].Generator;
                        var PrimeMover = Data.PowerUnits[i].PrimeMover;
                        var NamePlateCapacity = Data.PowerUnits[i].NamePlateCapacity;
                        var SummerCapabilities = Data.PowerUnits[i].SummerCapabilities;
                        var Status = Data.PowerUnits[i].Status;
                        var OnlineYear = Data.PowerUnits[i].OnlineYear;
                        var PrimaryFuel = Data.PowerUnits[i].PrimaryFuel;
                        var Ownership = Data.PowerUnits[i].Ownership;
                        var ProposedCapacity = Data.PowerUnits[i].ProposedCapacity;
                        if (Generator == null || Generator == 'null')
                            Generator = '';
                        if (PrimeMover == null || PrimeMover == 'null')
                            PrimeMover = '';
                        if (NamePlateCapacity == null || NamePlateCapacity == 'null')
                            NamePlateCapacity = '';
                        if (SummerCapabilities == null || SummerCapabilities == 'null')
                            SummerCapabilities = '';
                        if (Status == null || Status == 'null')
                            Status = '';
                        if (OnlineYear == null || OnlineYear == 'null')
                            OnlineYear = '';
                        if (PrimaryFuel == null || PrimaryFuel == 'null')
                            PrimaryFuel = '';
                        if (Ownership == null || Ownership == 'null')
                            Ownership = '';
                        if (ProposedCapacity == null || ProposedCapacity == 'null')
                            ProposedCapacity = '';
                        if (NamePlateCapacity) {
                            NamePlateCapacity = parseFloat(NamePlateCapacity)
                            NamePlateCapacity = NamePlateCapacity.toFixed(2);
                        }
                        if (SummerCapabilities) {
                            SummerCapabilities = parseFloat(SummerCapabilities)
                            SummerCapabilities = SummerCapabilities.toFixed(2);

                        }
                        if (ProposedCapacity) {
                            ProposedCapacity = parseFloat(ProposedCapacity)
                            ProposedCapacity = ProposedCapacity.toFixed(2);

                        }

                        html += '<tr><td>' + Generator + '</td><td>' + PrimeMover + '</td><td>' + NamePlateCapacity + '</td>'
                        if (type == "Power") {
                            html += '<td>' + ProposedCapacity + '</td>';
                        } else {
                            html += '<td>' + SummerCapabilities + '</td>';
                        }

                        html += '<td>' + Status + '</td><td>' + OnlineYear + '</td><td>' + PrimaryFuel + '</td>';
                        if (type != "Power") {
                            html += '<td>' + Ownership + '</td>';
                        }
                        html += '</tr>';
                    }
                }
                $("#PowerPlantUnitsGrid_Test_tbody").html("");
                $("#PowerPlantUnitsGrid_Test_tbody").html(html);

                $("#powerPlantsTestLoader").hide();
                $("#modal-PowerPlantPopup_Test").css('height', '80%');
                $("#modal-PowerPlantPopup_Tes").css('max-height', 'none');
                //$("#modal-PowerPlantPopup_Test").on('show', function () {
                //    $(this).addClass("modalPlantOperator");
                //    // $("#Test_map_canvas").empty();

                //})
                //  $("#modal-PowerPlantPopup_Test").on('shown.bs.modal', function () {
                PowerPlantTest_initialize_map(Data.latitude, Data.longitude);
                // resizePowerPlantPopup_Test();
                // })
                // $("#modal-PowerPlantPopup_Test").on('hidden.bs.modal', function () {
                //     $(this).removeClass("modalPlantOperator");
                // })
                //$("#modal-bodyPowerPlantPopup_Test").html(response);
                //  $("#modal-PowerPlantPopup_Test").modal('show');
                $("#main").css('margin-left', '0px');
                // $("#Test_map_canvas").html("");
            }
        },
        failure: function (response) {

        }
    });
}

function ShowEmpty() {
    try {
        $("#PlantOperatorHeaderName").html();
        html = ''
        html = '<div class="left_box"><div class="row-fluid"><div class="span4"><b>Operating Utility</b></div><div class="span8">' + '</div></div>' +
            '<div class="row-fluid"><div class="span4"><b>Ownership Type:</b></div><div class="span8">' + '</div></div>' +
            '  <div class="row-fluid"><div class="span4"><b>Country</b></div><div class="span8">' + '</div></div>' +
            '<div class="row-fluid"><div class="span4"><b>City/State:</b></div><div class="span8">' + ', ' + '</div></div>' +
            '<div class="row-fluid"><div class="span4"><b>County:</b></div><div class="span8">' + '</div></div>' +
            '<div class="row-fluid"><div class="span4"><b>EIA Plant Code:</b></div><div class="span8">' + '</div></div>' +
            '<div class="row-fluid"><div class="span4"><b>NERC Region:</b></div><div class="span8">' + '</div></div>' +
            ' <div class="row-fluid"> <div class="span4"><b>ISO/RTO:</b></div> <div class="span8">' + '</div></div>' +
            '<div class="row-fluid"><div class="span4"><b>Trans Facility Owner:</b></div><div class="span8">' + '</div></div></div>'
        $("#span6_1").html("");
        $("#span6_1").append(html);

        html = '';
        html = '  <div class="right_box"> <div class="row-fluid"><div class="span4"><b>Capacity (MWs):</b></div><div class="span8">' + '</div></div>' +
            '<div class="row-fluid"><div class="span4"><b>Capacity Factor:</b></div><div class="span8">' + '</div></div>' +
            '<div class="row-fluid"><div class="span4"><b>Avg. Heat Rate (Btu/kWh):</b></div><div class="span8">' + '</div></div>' +
            '<div class="row-fluid"><div class="span4"><b>Primary Fuel:</b></div><div class="span8">' + '</div></div>' +
            ' <div class="row-fluid"><div class="span4"><b>Water Source:</b></div><div class="span8">' + '</div></div>' +
            '<div class="row-fluid"><div class="span4"><b>Regulatory Status:</b></div><div class="span8">' + '</div></div>' +
            '<div class="row-fluid"><div class="span4"><b>Sector:</b></div><div class="span8">' + '</div></div></div>';
        $("#span6_2").html("");
        $("#span6_2").append(html);
        //html = '';
        //html = '<div class="reg_bg" style="height: 365px; width: 98%"><div id="Test_map_canvas" style="width: 100%; height: 100%;"></div></div>';
        // $("#span6_3").html("");
        //$("#span6_3").append(html);
        html = '';
        $("#TestLoadTable").html("");
        html = '<br /><span class="PlantOperatorHeader">Existing & Planned Unit Data</span><br /><br />';
        $("#TestLoadTable").append(html);
        html = '';
        html = ' <div class="row-fluid PowerPlantUnitsContent">  <table id="PowerPlantUnitsGrid_Test" class="table table-hover table-striped table-bordered grid" style="border-left: 1px solid #ddd;" cellspacing="0" width="100%"> <thead><tr><th>Generator</th><th>Prime Mover</th>' +
            '<th>NamePlate<br /> Capacity MWs</th><th>Proposed<br /> Capacity  MWs</th><th>Status</th><th>Online<br />Year</th><th>Primary Fuel</th></tr></thead> <tbody id="PowerPlantUnitsGrid_Test_tbody"></tbody></table></div>';
        $("#TestLoadTable").append(html);
        html = '';
        html += '<tr><td>' + '</td><td>' + '</td><td>' + '</td><td>' + '</td><td>' + '</td><td>' +
            '</td><td>' + '</td></tr>';
        $("#PowerPlantUnitsGrid_Test_tbody").html("");
        $("#PowerPlantUnitsGrid_Test_tbody").html(html);

        $("#powerPlantsTestLoader").hide();
        $("#modal-PowerPlantPopup_Test").css('height', '80%');
        $("#modal-PowerPlantPopup_Tes").css('max-height', 'none');
    } catch (e) {
        console.log(e.message);
    }
}