var previousbaseLayer = "";
var DeviceType;
var clicked = false;
var newString = "";
var oldString = "";

$(document).ready(function () {
    initialize();

    setHeights();

    DeviceType = deviceDetection();
    $("#mainInfoBoxLoader").hide();

    /* added by hardik patel 28-july-2016 #US 826# */
    $.ajax({
        url: '../Map/GetUsersBookmarks',
        type: 'get',
        async: false,
        success: function (jsonData) {
            try {
                var data = JSON.parse(jsonData);
                for (x in data) {
                    addBookMark(data[x].ID, data[x].Name, "FromDb");
                }
            }
            catch (e) {
                console.log('catch block error: ' + e.message);
            }
            finally {
                hideLoading();
            }
        },
        error: function (e) {
            console.log("ajax call error: " + e.message);
        }
    });

    $("#chkHazMat").click(function () {
        //  setLayer();
    });
    $("#routeDestination").keypress(function (event) {
        if (event.keyCode == 13) {
            calcRoute();
        }
    });

    $("#addtext").click(function (e) {
        e.stopImmediatePropagation();
        addBookMark("", "", "AddNew");
        $(this).hide();
    });

    $("#measureimages td").click(function () {
        var measureID = $(this)[0].id;
        if ($(this).attr("class") != "measureimagebackground") {
            $(".measureimagebackground").removeClass("measureimagebackground");
            $(this).addClass("measureimagebackground");
            //  $(this).toggleClass("measureimagebackground test");
            if (measureID == "area") {
                $("#MeasureArea").show();
                $("#areaOption").show();
                $("#MeasureDistance").hide();
                $("#MeasureLocation").hide();
                $("#distanceOption").hide();
                $("#locationOption").hide();
                measureReset();
                setArea();
            }
            else if (measureID == "distance") {
                $("#MeasureDistance").show();
                $("#distanceOption").show();
                $("#MeasureArea").hide();
                $("#MeasureLocation").hide();
                $("#areaOption").hide();
                $("#locationOption").hide();
                measureReset();
                setDistance();
            }
            else if (measureID == "location") {
                $("#MeasureLocation").show();
                $("#locationOption").show();
                $("#MeasureArea").hide();
                $("#MeasureDistance").hide();
                $("#areaOption").hide();
                $("#distanceOption").hide();
                measureReset();
            }
        }
    });

    $("#MeasureReset").click(function () {
        measureReset();
    });

    $('.easyui-tree').tree({
        onCheck: function (node, checked) {
            removeInfoBox();
            setLayer();
        },
    });

    $(".galleryNode .mini").click(function (e) {
        showLoading();
        e.stopImmediatePropagation();
        var $this = $(this)[0];
        $(".selected").removeClass("selected");
        $(this).addClass("selected");
        var BaseMapId = parseInt($(this).attr("baseMapId"));
        var data = getBaseMap(BaseMapId);
        if (data != undefined &&
            data != null &&
            previousbaseLayer != data.Name) {
            previousbaseLayer = data.Name;
            $.post("../Map/SaveBaseMapChanged", { 'layerName': previousbaseLayer }, function (result) {
            });
        }
        if (newString != null && newString != "") {
            oldString = newString;
            newString = "";
        }
        setBasemap(data.Name, data.TileSources, data.IsExtendedWMS, data.BaseUri, data.Layers);
        newString = data.TileSources;
        hideLoading();
    });

    $("#locationOption").change(function () {
        if (lastLocation != undefined)
            setLocation(lastLocation);
    });

    $("#export").click(function (event) {
        var result = takeSnap();
        if (!result)
            event.preventDefault();
    });

    //$('#frmSearch').submit(function () {
    //    var searchText = ($('#search').val());
    //    geocode(searchText);
    //    return false;
    //});

    $('#measureData').click(function (event) {
        event.stopPropagation();
    });

    $("#bookmarkData").click(function (event) {
        event.stopPropagation();
    });

    $("#MeasureInfo").hide();

    $("#MeasureInfoIcon").click(function () {
        $("#MeasureInfo").toggle();
    });

    $('#mapA').on('click', function (event) {
        var isMeasureData = $("#measureData").parent(".dropdown").attr('class').indexOf("open") > -1;
        if (isMeasureData)
            event.stopPropagation();
    });

    $(".dropdown").click(function (event) {
        var measureData = $(this).children("#measureData")[0];
        if (measureData != undefined)
            measureReset();
        if (clicked == false) {
            clicked = true;
        }
        else {
            clicked = false;
        }
    });

    $("#btnClearFacility").click(function (event) {
        clearFacilitySearch();
    });

    $("#btnClearFacility").on("keypress", function (e) {
        if (e.keyCode === 13) {
            clearFacilitySearch();
            return false;
        }
    });

    $("#btnSearchFacility").click(function (event) {
        clearMarkers();
        searchFacility();
    });

    $("#btnSearchFacility").on("keypress", function (e) {
        if (e.keyCode === 13) {
            clearMarkers();
            searchFacility();
            return false;
        }
    });


    if ($("#txtSearchFacility") != undefined &&
        $("#txtSearchFacility") != null) {

        $("#txtSearchFacility").on("keypress", function (e) {
            if (e.keyCode === 13) {
                clearMarkers();
                searchFacility();
                return false;
            }
        });
    }

    var facilityCommoditiesSelector = "#ddlFacilityCommodities";
    var $facilityCommodities = $(facilityCommoditiesSelector).data("chosen");


    if ($facilityCommodities != undefined &&
       $facilityCommodities != null) {
        var $Container = $facilityCommodities.container;
        $Container.bind("keypress", function (event) {
            var charCode = event.charCode;
            var keyCode = event.keyCode;
            var character = String.fromCharCode(charCode);
            if (keyCode == 13) {
                clearMarkers();
                searchFacility();
                return false;
            }
        });
    }

    var facilityTypeSelector = "#ddlFacilityType";
    var $facilityType = $(facilityTypeSelector).data("chosen");

    if ($facilityType != undefined &&
        $facilityType != null) {
        var $Container = $facilityType.container;

        $Container.bind("keypress", function (event) {
            var charCode = event.charCode;
            var keyCode = event.keyCode;
            var character = String.fromCharCode(charCode);
            if (keyCode == 13) {
                clearMarkers();
                searchFacility();
                return false;
            }
        });
    }

    //Start - By Nikunj (Added for US 244 #30-12-2014#)
    $("#btnClearOilGas").click(function (event) {
        clearOilGasSearch();
    });

    $("#btnClearOilGas").on("keypress", function (e) {
        if (e.keyCode === 13) {
            clearOilGasSearch();
            return false;
        }
    });

    $("#btnSearchOilGas").click(function (event) {
        clearMarkers();
        searchOilGas();
    });

    $("#btnSearchOilGas").on("keypress", function (e) {
        if (e.keyCode === 13) {
            clearMarkers();
            searchOilGas();
            return false;
        }
    });


    if ($("#txtSearchOilGasOperator") != undefined &&
        $("#txtSearchOilGasOperator") != null) {

        $("#txtSearchOilGasOperator").on("keypress", function (e) {
            if (e.keyCode === 13) {
                clearMarkers();
                searchOilGas();
                return false;
            }
        });
    }

    if ($("#txtSearchOilGasCounty") != undefined &&
        $("#txtSearchOilGasCounty") != null) {

        $("#txtSearchOilGasCounty").on("keypress", function (e) {
            if (e.keyCode === 13) {
                clearMarkers();
                searchOilGas();
                return false;
            }
        });
    }

    var oilgasWellStatusSelector = "#ddlOilGasStatus";
    var $oilgasWellStatus = $(oilgasWellStatusSelector).data("chosen");


    if ($oilgasWellStatus != undefined &&
       $oilgasWellStatus != null) {
        var $Container = $oilgasWellStatus.container;
        $Container.bind("keypress", function (event) {
            var charCode = event.charCode;
            var keyCode = event.keyCode;
            var character = String.fromCharCode(charCode);
            if (keyCode == 13) {
                clearMarkers();
                searchOilGas();
                return false;
            }
        });
    }

    var oilgasWellTypeSelector = "#ddlOilGasType";
    var $oilgasWellType = $(oilgasWellTypeSelector).data("chosen");

    if ($oilgasWellType != undefined &&
        $oilgasWellType != null) {
        var $Container = $oilgasWellType.container;

        $Container.bind("keypress", function (event) {
            var charCode = event.charCode;
            var keyCode = event.keyCode;
            var character = String.fromCharCode(charCode);
            if (keyCode == 13) {
                clearMarkers();
                searchOilGas();
                return false;
            }
        });
    }
    //End - By Nikunj

    var fuelTypeSelector = "#ddlFuelType";
    var $fuelType = $(fuelTypeSelector).data("chosen");

    if ($fuelType != undefined ||
        $fuelType != null) {

        var $Container = $fuelType.container;
        $Container.bind("keypress", function (event) {

            var charCode = event.charCode;
            var keyCode = event.keyCode;
            var character = String.fromCharCode(charCode);
            if (keyCode == 13) {
                clearMarkers();
                searchPowerPlant();
                return false;
            }
        });
    }

    var primeMoverSelector = "#ddlPrimeMover";
    var $primeOver = $(primeMoverSelector).data("chosen");

    if ($primeOver != undefined &&
        $primeOver != null) {

        var $Container = $primeOver.container;
        $Container.bind("keypress", function (event) {

            var charCode = event.charCode;
            var keyCode = event.keyCode;
            var character = String.fromCharCode(charCode);
            if (keyCode == 13) {
                clearMarkers();
                searchPowerPlant();
                return false;
            }
        });
    }

    $("#btnClearPowerPlant").click(function (event) {
        clearPowerPlantSearch();
    });

    $("#btnClearPowerPlant").on("keypress", function (e) {
        if (e.keyCode === 13) {
            clearPowerPlantSearch();
            return false;
        }
    });

    $("#btnSearchPowerPlant").click(function (event) {
        clearMarkers();
        searchPowerPlant();
    });

    $("#btnSearchPowerPlant").on("keypress", function (e) {
        if (e.keyCode === 13) {
            clearMarkers();
            searchPowerPlant();
            return false;
        }
    });

    if ($("#txtSearchPowerPlant") != null &&
        $("#txtSearchPowerPlant") != undefined) {
        $("#txtSearchPowerPlant").on("keypress", function (e) {
            if (e.keyCode === 13) {
                clearMarkers();
                searchPowerPlant();
                return false;
            }
        });
    }

    $("#zoomSlider").bind("slider:changed", function (event, data) {
        mapA.setZoom(parseInt(data.value));
    });

    $("#zoomIn").click(function () {
        if (mapA.maxZoom != mapA.zoom)
            mapA.setZoom(mapA.zoom + 1);
    });

    $("#zoomOut").click(function () {
        if (mapA.minZoom != mapA.zoom)
            mapA.setZoom(mapA.zoom - 1);
    });

    $("#pantop").click(function () {
        mapA.panBy(0, -200); // (x,y) 
    });

    $("#panright").click(function () {
        mapA.panBy(200, 0); // (x,y) 
    });

    $("#panbottom").click(function () {
        mapA.panBy(0, 200); // (x,y) 
    });

    $("#panleft").click(function () {
        mapA.panBy(-200, 0); // (x,y) 
    });

    $("#toggle-overview").click(function () {
        $(this).toggleClass("open close");
        $("#overView_mapA").toggle();
        if (isOverViewMapVisible()) {
            rectangle.setBounds(mapA.getBounds());
            sub_map.setCenter(mapA.getCenter());
            sub_map.setZoom(mapA.zoom - 3);

            var mapTypeId = mapA.mapTypeId;
            sub_map.setMapTypeId(mapTypeId);
            if (mapTypeId == "basemap") {

                sub_map.mapTypes.set('basemap', baseMaplayersWMS)
                sub_map.setMapTypeId('basemap');

                var count = 0;
                if (baseMapLayer.length > 0) {
                    for (l in baseMapLayer) {
                        sub_map.overlayMapTypes.setAt(count, gettilelayer(baseMapLayer[l]));
                        count++;
                    }
                }
            }
        }
    });

    $("#routeOption .option").click(function (e) {
        if ($(this).hasClass("print")) {
            var exportDirection = escape($("#directions-content").html());
            if (exportDirection != "")
                setExportDirection();
            else
                e.preventDefault();
            //if (!directionsRenderer.getMap()) {
            //    e.preventDefault();
            //}
        }
        else if ($(this).hasClass("reverse")) {
            ReverseRoute();
        }
        else {
            $("#routeOption .option.selected").removeClass("selected");
            $(this).addClass("selected");
            if (directionsRenderer.getMap())
                getDirection();

        }
    });
    $("#routeOption .option.print").hide();
    //$(".btn.btn-primary.print").hide();
    $(".btn.btn-primary.print").click(function (e) {
        var exportDirection = escape($("#directions-content").html());
        if (exportDirection != "")
            setExportDirection();
        else
            e.preventDefault();
        //if (!directionsRenderer.getMap())
        //    e.preventDefault();
    });

    var scaleInterval = setInterval(function () {
        var scale = $(".gm-style-cc:not(.gmnoprint):contains(' km')");
        if (scale.length) {
            scale.click();
            clearInterval(scaleInterval);
        }
    }, 50);

    var myVar = setInterval(function () { myTimer() }, 20);

    $('a[data-toggle="tab"]').on('shown', function (e) {
        //e.target // activated tab || e.relatedTarget // previous tab
        if ($(e.target).attr("href") == "#searchDetail") {
            updateSearchDetailScroll();
        }
    });

});


function myTimer() {
    if ($("#left").is(":visible")) {
        $('.gm-style-cc').css('right', '530px');
    }
    else {
        $('.gm-style-cc').css('right', '180px');
    }
    $('.gm-style-cc').css('bottom', '30px');
    //alert("call");
}

function isOverViewMapVisible() {
    return $("#overView_mapA").is(":visible");
}


function setExportDirection() {
    var map_center = new google.maps.LatLng(39.46, -95.63);
    $("#dynamicDiv").html("");
    $("#dynamicDiv").css("page-break-before", "auto");
    $("#dynamicDiv").css("page-break-after", "always");
    var mainContentDiv = $('<div/>');//.attr('width','100%');
    mainContentDiv.attr('id', 'contentDiv');//.attr('style','padding:20px');
    mainContentDiv.appendTo("#dynamicDiv");
    var $div = $('<div/>').append($("#directions-content").html());
    $div.css("page-break-after", "always");
    //$("#directions-content").appendTo("#dynamicDiv");
    $div.attr('style', 'padding:20px;width:100%');
    $div.appendTo(mainContentDiv);
    var mapAdiv = $('<div/>');
    mapAdiv.css("page-break-before", "always");
    mapAdiv.css("page-break-after", "always");


    var divdistance = $('<div/>').attr('style', 'font-weight: bolder;font-size: 25px;padding:20px');
    divdistance.css("page-break-before", "always");
    divdistance.append("Route: " + $('.adp-summary').html());
    divdistance.appendTo(mapAdiv);

    var waypts = [];
    for (var i = 1; i < waypoints.length - 1; i++) {
        if (waypoints[i] != null && waypoints[i]["place"] != "" && waypoints[i]["place"] != undefined) {
            waypts.push({
                location: waypoints[i]["place"],
                stopover: true
            });
        }
    }

    var directionsRequest = {};

    directionsRequest.origin = waypoints[0]["latLng"];
    directionsRequest.destination = waypoints[waypoints.length - 1]["latLng"];
    directionsRequest.travelMode = getTravelMode();
    directionsRequest.waypoints = waypts;
    optimizeWaypoints: true,
    directionsService.route(directionsRequest, function (result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            // console.log("status");
            var path = result.routes[0].overview_path;
            mapAdiv.attr('style', 'padding:20px;width:100%');
            url = "http://maps.googleapis.com/maps/api/staticmap?"
            url += "size=800x800";
            url += "&maptype=roadmap";
            var lbl = 26;
            for (i = 1; i <= waypoints.length; i++) {
                var Loc = waypoints[i - 1];
                var c = indexToChar(lbl);
                lbl++;
                url += "&markers=color:green|label:" + c + "|" + Loc.latLng.lat() + "," + Loc.latLng.lng();

            }

            url += "&path=color:0x6EB4F3|weight:5";
            url += "%7" + "Cenc:" + google.maps.geometry.encoding.encodePath(path);
            //console.log(google.maps.geometry.encoding.encodePath(path));
            //console.log(url);

            //var polyLatLngs = [];
            //for (var j = 0; j < poly.getVertexCount() ; j++) {
            //    polyLatLngs.push(poly.getVertex(j).lat().toFixed(5) + "," + poly.getVertex(j).lng().toFixed(5));
            //}
            //console.log(polyLatLngs);
            // console.log(routeDirectionsLocations.join("|"));

            url += "&sensor=false&client=gme-pennwellcorporation&signature=hl4KxdA-647HX7JjUACvDuyf1l0=";
            //  console.log(url);
            mapAdiv.append("<img height=700px width=1045px src=" + url + ">");
            mapAdiv.appendTo("#dynamicDiv");

            var clearContentDiv = $('<div/>');
            clearContentDiv.css('clear', 'both');
            clearContentDiv.appendTo("#dynamicDiv");

            var mapsDiv = $('<div/>').css("page-break-before", "always");
            mapsDiv.attr('id', 'mapsDiv');
            mapsDiv.appendTo("#dynamicDiv");
            var mapsTable = $('<table/>');
            mapsTable.appendTo("#mapsDiv");

            var k = 0;
            //var tr = $('<tr/>');
            var trs = '<tr>';

            lbl = 26;
            for (i = 1; i <= waypoints.length; i++) {

                var mapLocation = waypoints[i - 1];
                var map_center = new google.maps.LatLng(mapLocation.latLng.lat(), mapLocation.latLng.lng());
                if (i % 2 == 1) {
                    //mapsTable.append('<tr/>');
                    trs += '</tr><tr>';
                }
                var c = indexToChar(lbl);
                lbl++;
                //var td = $('<td/>').append($('<div/>').text(c+ " : "+waypoints[i - 1].place));
                trs += ('<td style="padding:20px"><div style="font-weight: bolder;font-size: 25px">' + c + " : " + waypoints[i - 1].place) + '</div>';
                //td.append("<img src=http://maps.googleapis.com/maps/api/staticmap?center=" + mapLocation.latLng.lat() + "," + mapLocation.latLng.lng() + "&maptype=roadmap&zoom=5&size=500x500&sensor=false>");
                trs += "<img src=http://maps.googleapis.com/maps/api/staticmap?center=" + "&markers=color:green|label:" + c + "|" + mapLocation.latLng.lat() + "," + mapLocation.latLng.lng() + "&maptype=roadmap&zoom=" + mapA.getZoom() + "&size=500x500&client=gme-pennwellcorporation&signature=hl4KxdA-647HX7JjUACvDuyf1l0=&sensor=false></td>";
                //td.appendTo(tr);

                //var $div = $('<div />').appendTo('#dynamicDiv');
                //var $div = $('<div/>').appendTo(td);

                //$div.attr('id', 'mapData' + i);
                //$div.css('height', '250px');
                //$div.css('width', '250px');
                //$div.css('position', 'relative');

                //var mapOptions = {
                //    center: map_center,
                //    zoom: 5,
                //    mapTypeControl: false,
                //    visualRefresh: false,
                //    disableDefaultUI: false,
                //    scrollwheel: false,
                //    scaleControl: false,
                //    panControl: false,
                //    zoomControl: false,
                //    streetViewControl: false,
                //    rotateControl: false,
                //};
                //var mapData = new google.maps.Map(document.getElementById("mapData" + i),
                //mapOptions);      
                //google.maps.event.trigger(mapData, "load");
                //google.maps.event.addListener(mapData, "idle", function () {
                k++;
                if (parseInt(k) == waypoints.length) {
                    trs += '</tr>';
                    mapsTable.append(trs);

                    //    var $div = $('<div />').appendTo('#dynamicDiv');
                    //  var $div = $('<div/>').appendTo(td);

                    //$div.attr('id', 'mapData');
                    //$div.css('height', '250px');
                    //$div.css('width', '250px');
                    //$div.css('position', 'relative');

                    //var mapOptions = {
                    //    center: map_center,
                    //    zoom: 5,
                    //    mapTypeControl: false,
                    //    visualRefresh: false,
                    //    disableDefaultUI: false,
                    //    scrollwheel: false,
                    //    scaleControl: false,
                    //    panControl: false,
                    //    zoomControl: false,
                    //    streetViewControl: false,
                    //    rotateControl: false,
                    //};
                    //var mapData = new google.maps.Map(document.getElementById("mapData"),
                    //mapOptions);
                    //google.maps.event.trigger(mapData, "load");
                    //google.maps.event.addListener(mapData, "idle", function () {
                    var dataValue = escape($("#dynamicDiv").html());
                    //console.log($("#dynamicDiv").html());
                    // console.log("before post");
                    $.ajax({
                        type: "POST",
                        url: "setExportDirection",
                        data: { 'exportDirection': dataValue },
                        async: false
                    }).done(function (msg) {
                        // console.log("complete post");
                        window.open("/Map/ExportDirection", "_blank");
                    });
                    //});
                }
                //});
            }
        }
    });


    //var table = $('<table/>');
    //table.appendTo('#contentDiv');
    //var rowDirec = $('<tr/>');
    //rowDirec.appendTo(table);
    //var tdDirec = $('<td/>');
    //$("#contentDiv").append($('#directions-content').html());
    //tdDirec.appendTo(rowDirec);


}
function indexToChar(number) {
    if (number >= 0 && number <= 25) // a-z
        number = number + 97;
    else if (number >= 26 && number <= 51) // A-Z
        number = number + (65 - 26);
    else
        return false; // range error
    return String.fromCharCode(number);
}

function saveMapToDataUrl() {

    var element = $("#mapA");

    html2canvas(element, {
        useCORS: true,
        onrendered: function (canvas) {
            var dataUrl = canvas.toDataURL("image/png");

            // DO SOMETHING WITH THE DATAURL
            // Eg. write it to the page
            document.write('<img src="' + dataUrl + '"/>');
        }
    });
}

$(window).resize(function () {
    setHeights();
    setMapSize();
});

function setHeights() {
    $("#map-canvas").height($(window).height() - 40);
    $("#mapA").height($(window).height() - 14);
}

function setMapSize() {
    var width = $(window).width();
    $("#mapA").css("width", width);
    $("#map-canvas").css("width", width);
    //console.log(width);
}

function setZoom() {
    var val = mapA.zoom;

    $("#mapzoom").html(val);
    $("#zoomSlider").simpleSlider("setValue", val);
}

function clearFacilitySearch() {
    $("#txtSearchFacility").val("");
    $("#ddlFacilityType").val("").trigger("liszt:updated");
    $("#ddlFacilityCommodities").val("").trigger("liszt:updated");
    $("#facilityMessage").hide();
    clearMarkers();
}

//Start - By Nikunj (Added for US 244 #30-12-2014#)
function clearOilGasSearch() {
    $("#txtSearchOilGasOperator").val("");
    $("#ddlOilGasState").val("").trigger("liszt:updated");
    $("#txtSearchOilGasCounty").val("");
    $("#ddlOilGasStatus").val("").trigger("liszt:updated");
    $("#ddlOilGasType").val("").trigger("liszt:updated");
    $("#oilgasMessage").hide();
    clearMarkers();
}
//End - By Nikunj

function clearPowerPlantSearch() {
    $("#txtSearchPowerPlant").val("");
    $("#ddlFuelType").val("").trigger("liszt:updated");
    $("#ddlPrimeMover").val("").trigger("liszt:updated");
    $("#powerPlantMessage").hide();
    clearMarkers();
}

function clearMarkers() {
    for (var i = 0; i < searchMarkers.length; i++) {
        searchMarkers[i].setMap(null);
    }
    searchMarkers = [];

    clearSearchResult();
    clearSearchDetail();

}

function clearSearchResult() {
    $("#searchResultContent").html("");
}

function clearSearchDetail() {
    $("#searchDetailContent").html("");
}

function updateSearchDetailScroll() {
    $("#searchDetail").animate({ height: ($("#searchDetail").height()) }, "slow", function () {
        $(this).mCustomScrollbar("update");
    });
}

function updateSearchResultScroll() {
    $("#searchResult").animate({ height: $("#searchResult").height() }, "slow", function () {
        $(this).mCustomScrollbar("update");
    });
}

function updateRouteScroll() {
    $("#Routes").animate({ height: ($("#Routes").height()) }, "slow", function () {
        $(this).mCustomScrollbar("update");
        var lastMarker = $("#directions-content .adp .adp-marker:visible").last();
        if (lastMarker.attr("src") != undefined) {
            var src = lastMarker.attr("src").replace("waypoint-b", "waypoint-a");
            lastMarker.attr("src", src);
        }
    });
}

function removeInfoBox() {
    $(".infoBox").remove();
}

function showLoading() {
    $("#page_loading").show();
    $("#page_loading").fadeIn(500);
}

function hideLoading() {
    $("#page_loading").fadeOut(3000);
    $("#page_loading").hide();
}

//Bookmark Menu Functions

function addBookMark(counter, value, type) {
    var bookmarkTextBoxes = $("#bookmarkTextBoxes");
    var addtext = $("#addtext");
    var div = $("<div>");
    div.css("height", "25px");
    div.css("padding-top", "2px");
    div.css("cursor", "pointer");
    div.attr("id", "d" + counter);
    div.attr("dbid", counter);
    div.appendTo(bookmarkTextBoxes);

    var textbox = $("<input>");
    textbox.attr("type", "textbox");
    textbox.attr("id", "Text_" + counter);
    textbox.attr("value", value);
    textbox.attr("dbid", counter);
    textbox.css("width", "190px");     //modified by arpita
    textbox.click(function (e) {
        e.stopImmediatePropagation();
    });

    //var autocomplete = new google.maps.places.Autocomplete(textbox[0], {
    //    types: ["geocode"]
    //});
    //autocomplete.bindTo('bounds', mapA);

    //google.maps.event.addListener(autocomplete, 'place_changed', function (event) {
    //    var place = autocomplete.getPlace();
    //    var latLng = place.geometry.location;
    //    saveBookmark(latLng, place.formatted_address, counter);
    //});

    textbox.keypress(function (event) {
        handle(event, $(this))
    });
    textbox.appendTo(div);

    var link = $("<a>");
    link.css("padding", "5px");
    link.css("cursor", "pointer");
    link.css("margin-right", "14px");
    link.css("text-decoration", "none");
    link.css("color", "black");
    link.css("font-size", "15px");
    link.attr("id", "Bookmark_" + counter);
    link.attr("value", value);
    link.attr("dbid", counter);
    link.click(function () {
        //codeAddress(value);
        //geocode(link.attr("value"));
        var BookmarkID = parseInt($(this).attr("dbid"));
        $.post("../Map/GetBookmark", { "BookmarkID": BookmarkID }, function (result) {
            var data = JSON.parse(result);
            var center = new google.maps.LatLng(data.Latitude, data.Longitude);
            var zoom = data.ZoomLevel;
            mapA.setCenter(center);
            mapA.setZoom(zoom);
            //console.log(data);
        })
    });
    link.html(value.length > 18 ? value.substr(0, 16) + "..." : value);
    link.appendTo(div);

    var imgClose = $("<img>");
    imgClose.attr("id", "Close_" + counter);

    imgClose.attr("src", "../Images/1379343281_cross_circle_frame.png");
    imgClose.css("margin-top", "2px");
    imgClose.attr("title", "Remove");
    imgClose.css("float", "right");
    imgClose.attr("dbid", counter);
    imgClose.click(function () {
        if (link.is(":visible")) {
            showLoading();
            var BookmarkID = $(this).attr("dbid");
            $.get("../Map/DeleteBookmark", { 'BookmarkID': BookmarkID }, function (result) {
                div.remove();
                hideLoading();
            });
        }
        else {
            if (counter == "")
                div.remove();
            else {
                link.show();
                imgEdit.show();
                textbox.hide();
            }
        }
        addtext.show();
    });
    imgClose.appendTo(div);
    var imgEdit = $("<img>");
    imgEdit.attr("id", "Edit_" + counter);
    imgEdit.attr("src", "../Images/Edit_icon.png");
    imgEdit.attr("title", "Edit");
    imgEdit.css("height", "16px");
    imgEdit.css("float", "right");
    imgEdit.css("margin-right", "3px");
    imgEdit.css("margin-top", "3px");
    imgEdit.attr("dbid", counter);
    imgEdit.click(function () {
        link.hide();
        imgEdit.hide();
        textbox.show();
        addtext.hide();
    });
    imgEdit.appendTo(div);

    if (type == "FromDb")
        textbox.hide();
    else if (type = "AddNew") {
        link.hide();
        imgEdit.hide();
    }
}

function removediv(item) {
    var ID = item.id;
    var number = ID.substr(ID.indexOf('_') + 1);
    $("#d" + number).remove();
}

function handle(e, sender) {
    //alert(e.keyCode);
    var id = sender.attr("dbid");
    if (e.keyCode === 13) {
        var textValue = $("#Text_" + id).val();
        if (textValue != "") {
            saveBookmark(textValue, id);
        }
        else
            alert("Bookmark Name Required !!");
    }
    return false;
}

function saveBookmark(address, id) {
    //geocoder.geocode({
    //    'address': address,
    //    'partialmatch': true
    //}, function (results, status) {
    //    if (status == 'OK' && results.length > 0) {
    //        //mapA.fitBounds(results[0].geometry.viewport);
    //        //mapA.setCenter(results[0].geometry.location);
    var lat = mapA.getCenter().lat();
    var lng = mapA.getCenter().lng();
    var zoom = mapA.zoom;
    showLoading();
    $.post("../Map/SaveBookmark", { 'id': id, 'Bookmark': address, 'lat': lat, 'lng': lng, 'zoom': zoom }, function (dbID) {
        if (dbID != "") {
            var d = $("#d" + id);
            var Text = $("#Text_" + id);
            var Bookmark = $("#Bookmark_" + id);
            var Close = $("#Close_" + id);
            var Edit = $("#Edit_" + id);
            var addtext = $("#addtext");

            id = dbID;
            var value = address;

            d.attr("id", "d" + id);
            Text.attr("id", "Text_" + id);
            Bookmark.attr("id", "Bookmark_" + id);
            Close.attr("id", "Close_" + id);
            Edit.attr("id", "Edit_" + id);

            d.attr("dbid", id);
            Text.attr("dbid", id);
            Bookmark.attr("dbid", id);
            Close.attr("dbid", id);
            Edit.attr("dbid", id);

            Bookmark.attr("value", value);
            Bookmark.html(value.length > 18 ? value.substr(0, 16) + "..." : value);
            Text.hide();
            Bookmark.show();
            Close.show();
            Edit.show();
            addtext.show();

            hideLoading();
        }
        else {
            res = "Error Occured !!";
            alert(res);
        }
    });
    //    }
    //    else {
    //        alert("BookMark is invalid");
    //    }
    //});
}

//function saveBookmark(location,address, id) {
//    var lat = location.lat();
//    var lng = location.lng();
//    var zoom = mapA.zoom;
//    showLoading();
//    $.post("../Map/SaveBookmark", { 'id': id, 'Bookmark': address, 'lat': lat, 'lng': lng, 'zoom': zoom }, function (dbID) {
//        if (dbID != "") {
//            var d = $("#d" + id);
//            var Text = $("#Text_" + id);
//            var Bookmark = $("#Bookmark_" + id);
//            var Close = $("#Close_" + id);
//            var Edit = $("#Edit_" + id);
//            var addtext = $("#addtext");

//            id = dbID;
//            var value = address;

//            d.attr("id", "d" + id);
//            Text.attr("id", "Text_" + id);
//            Bookmark.attr("id", "Bookmark_" + id);
//            Close.attr("id", "Close_" + id);
//            Edit.attr("id", "Edit_" + id);

//            d.attr("dbid", id);
//            Text.attr("dbid", id);
//            Bookmark.attr("dbid", id);
//            Close.attr("dbid", id);
//            Edit.attr("dbid", id);

//            Bookmark.attr("value", value);
//            Bookmark.html(value.length > 18 ? value.substr(0, 16) + "..." : value);
//            Text.hide();
//            Bookmark.show();
//            Close.show();
//            Edit.show();
//            addtext.show();

//            hideLoading();
//        }
//        else {
//            res = "Error Occured !!";
//            alert(res);
//        }
//    });
//}

//function geocode(address) {
//    //alert(address);
//    geocoder.geocode({
//        'address': address,
//        'partialmatch': true
//    }, function (results, status) {
//        if (status == 'OK' && results.length > 0) {
//            mapA.fitBounds(results[0].geometry.viewport);
//            //mapA.setCenter(results[0].geometry.location);
//        } else {
//        }
//    });
//}

// Measure Menu Functions

function ddlareaChage(item) {
    if (item.id == "areaOption") {
        Measurement.Areaunit = item.value;
        setArea();
    }
    else if (item.id == "distanceOption") {
        Measurement.DistanceUnit = item.value;
        setDistance();
    }
}

function setArea() {
    var val = Measurement.value;
    if (Measurement.Areaunit == "Acres")
        val = (val * 0.00024711);
    if (Measurement.Areaunit == "Sq-Miles")
        val = (val * (3.861 / 10000000)).toFixed(2);
    if (Measurement.Areaunit == "Sq-Kilometers")
        val = (val / (1000 * 1000));
    if (Measurement.Areaunit == "Hectares")
        val = (val / (10000));
    if (Measurement.Areaunit == "Sq-Yards")
        val = (val * 1.196);
    if (Measurement.Areaunit == "Sq-Feet")
        val = (val * 10.7639);
    jQuery("#areameasure").text(format(val, 2) + " " + Measurement.Areaunit);
}

function setDistance() {
    var val = Measurement.value.toFixed(2);
    if (Measurement.DistanceUnit == "Miles")
        val = (val * 0.0006213);
    if (Measurement.DistanceUnit == "Kilometers")
        val = (val * 0.001);
    if (Measurement.DistanceUnit == "Feet")
        val = (val * 3.28084);
    if (Measurement.DistanceUnit == "Meters")
        val = (val * 1);
    if (Measurement.DistanceUnit == "Yards")
        val = (val * 1.09361);
    jQuery("#distancemeasure").text(format(val, 2) + " " + Measurement.DistanceUnit);
}
function deviceDetection() {
    var osVersion,
    device,
    deviceType,
    userAgent,
    isSmartphoneOrTablet;

    device = (navigator.userAgent).match(/Android|iPhone|iPad|iPod/i);

    if (/Android/i.test(device)) {
        if (!/mobile/i.test(navigator.userAgent)) {
            deviceType = 'tablet';
        } else {
            deviceType = 'phone';
        }

        osVersion = (navigator.userAgent).match(/Android\s+([\d\.]+)/i);
        osVersion = osVersion[0];
        osVersion = osVersion.replace('Android ', '');

    } else if (/iPhone/i.test(device)) {
        deviceType = 'phone';
        osVersion = (navigator.userAgent).match(/OS\s+([\d\_]+)/i);
        osVersion = osVersion[0];
        osVersion = osVersion.replace(/_/g, '.');
        osVersion = osVersion.replace('OS ', '');

    } else if (/iPad/i.test(device)) {
        deviceType = 'tablet';
        osVersion = (navigator.userAgent).match(/OS\s+([\d\_]+)/i);
        osVersion = osVersion[0];
        osVersion = osVersion.replace(/_/g, '.');
        osVersion = osVersion.replace('OS ', '');
    }
    isSmartphoneOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    userAgent = navigator.userAgent;

    return {
        'isSmartphoneOrTablet': isSmartphoneOrTablet,
        'device': device,
        'osVersion': osVersion,
        'userAgent': userAgent,
        'deviceType': deviceType
    };
}