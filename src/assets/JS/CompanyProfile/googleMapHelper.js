var geocoder;
var map;
//var infowindow = new google.maps.InfoWindow();
var infowindow;
var marker;
var lat;
var lng;
var map_center = new google.maps.LatLng(39.46, -95.63);
var map_center;
var mapType;
var newMarker;
var Layers = [];
var newMarkerLatLng;
var i = 0;

var energyLayer = [];
//var baseURL = "http://m.mapsearch360.com/envision/BaseMaps/";
var baseURL = "http://54.225.240.244:8080/envision/BaseMaps/";
var isClickedOnLayer = false;

function GUnitsTest_map_canvas_initialize_map(txt_lat, txt_long) {
    
    lat = parseFloat(txt_lat);
    lng = parseFloat(txt_long);
    //map_center = new google.maps.LatLng(39.46, -95.63);
    geocoder = new google.maps.Geocoder();
    if (lat > 0) {
        map_center = new google.maps.LatLng(lat, lng);
        mapType = google.maps.MapTypeId.HYBRID;
    }
    var mapOptions = {
        zoom: 13,
        draggableCursor: 'default',
        center: map_center,
        mapTypeId: mapType,
        streetViewControl: false,
        // mapTypeId: google.maps.MapTypeId.HYBRID,
    };

    map = new google.maps.Map(document.getElementById("GUnitsTest_map_canvas"), mapOptions);

    infowindow = new google.maps.InfoWindow();

    if (lat > 0) {
        map.setZoom(18);
        marker = new google.maps.Marker({
            position: map_center,
            map: map,
            draggable: true
        });
        google.maps.event.addListener(marker, 'dragend', function () {
            getConfirmBox();
        });
        getInfoWindow();
    }
    else
        map.setZoom(4);

    var contextMenuOptions = {};
    contextMenuOptions.classNames = { menu: 'context_menu', menuSeparator: 'context_menu_separator' };

    var menuItems = [];
    menuItems.push({ className: 'context_menu_item', eventName: 'setLocation_click', id: 'setLocation', label: 'Set Location here' });
    contextMenuOptions.menuItems = menuItems;
    var contextMenu = new ContextMenu(map, contextMenuOptions);

    google.maps.event.addListener(map, 'rightclick', function (location) {
        contextMenu.show(location.latLng);
    });
    google.maps.event.addListener(map, "click", function (location) {
        //console.log(location);
        //;
        contextMenu.show(location.latLng);
        var Latitude = location.latLng.lat().toFixed(6);
        var Longitude = location.latLng.lng().toFixed(6);



        if (energyLayer.length > 0 && !isClickedOnLayer) {
            isClickedOnLayer = true;
            removeInfoBox();
            var x = parseInt(location.pixel.x);
            var y = parseInt(location.pixel.y);
            var height = $("#GUnitsTest_map_canvas").height();
            var width = $("#GUnitsTest_map_canvas").width();
            var infoData = setInfoLayer(map, location, x, y, height, width);
            if (infoData.length > 0) {
                var $mainInfoDiv = setInfoBox(map, true, infoData);
                $(document.createElement('div')).addClass('pointer bottomLeft').appendTo($mainInfoDiv);
                //;
                var myOptions =
                    {
                        content: $mainInfoDiv[0]
                       , disableAutoPan: false
                       , maxWidth: 0
                       , pixelOffset: new google.maps.Size(0, 44)
                       , position: location.latLng
                       , isHidden: false
                       , pane: "floatPane"
                       , zIndex: 999999
                       , width: "350px"
                       , opacity: 1.0
                       , enableEventPropagation: false
                       , closeBoxURL: "../Images/433-x.png"
                       , closeBoxMargin: "5px 5px 5px 2px"
                       , infoBoxClearance: new google.maps.Size(60, 60)
                    };
                //;
                var ibLabel = new InfoBox(myOptions);
                google.maps.event.addListener(ibLabel, 'closeclick', function (event) {
                    this.close();
                    google.maps.event.trigger(map, 'resize');

                });
                ibLabel.open(map);

            }
            //hideLoading();
            isClickedOnLayer = false;
        }
    });
    google.maps.event.addListener(map, 'zoom_changed', function () {
        var Latitude = map_center.lat().toFixed(6);
        var Longitude = map_center.lng().toFixed(6);
    });

    google.maps.event.addListener(contextMenu, 'menu_item_selected', function (latLng, eventName) {
        switch (eventName) {
            case 'setLocation_click':
                //newMarkerLatLng = latLng;
                //getConfirmBox();
                setMarkerLocation(latLng);
                break;
        }
    });
}


function PowerPlantTest_initialize_map(txt_lat, txt_long) {
    
    lat = parseFloat(txt_lat);
    lng = parseFloat(txt_long);
    //map_center = new google.maps.LatLng(39.46, -95.63);
    geocoder = new google.maps.Geocoder();
    if (lat > 0) {
        map_center = new google.maps.LatLng(lat, lng);
        mapType = google.maps.MapTypeId.HYBRID;
    }
    var mapOptions = {
        zoom: 13,
        draggableCursor: 'default',
        center: map_center,
        mapTypeId: mapType,
        streetViewControl: false,
        // mapTypeId: google.maps.MapTypeId.HYBRID,
    };

    map = new google.maps.Map(document.getElementById("Test_map_canvas"), mapOptions);

    infowindow = new google.maps.InfoWindow();

    if (lat > 0) {
        map.setZoom(18);
        marker = new google.maps.Marker({
            position: map_center,
            map: map,
            draggable: true
        });
        google.maps.event.addListener(marker, 'dragend', function () {
            getConfirmBox();
        });
        getInfoWindow();
    }
    else
        map.setZoom(4);

    var contextMenuOptions = {};
    contextMenuOptions.classNames = { menu: 'context_menu', menuSeparator: 'context_menu_separator' };

    var menuItems = [];
    menuItems.push({ className: 'context_menu_item', eventName: 'setLocation_click', id: 'setLocation', label: 'Set Location here' });
    contextMenuOptions.menuItems = menuItems;
    var contextMenu = new ContextMenu(map, contextMenuOptions);

    google.maps.event.addListener(map, 'rightclick', function (location) {
        contextMenu.show(location.latLng);
    });
    google.maps.event.addListener(map, "click", function (location) {
        //console.log(location);
        //;
        contextMenu.show(location.latLng);
        var Latitude = location.latLng.lat().toFixed(6);
        var Longitude = location.latLng.lng().toFixed(6);



        if (energyLayer.length > 0 && !isClickedOnLayer) {
            isClickedOnLayer = true;
            removeInfoBox();
            var x = parseInt(location.pixel.x);
            var y = parseInt(location.pixel.y);
            var height = $("#Test_map_canvas").height();
            var width = $("#Test_map_canvas").width();
            var infoData = setInfoLayer(map, location, x, y, height, width);
            if (infoData.length > 0) {
                var $mainInfoDiv = setInfoBox(map, true, infoData);
                $(document.createElement('div')).addClass('pointer bottomLeft').appendTo($mainInfoDiv);
                //;
                var myOptions =
                    {
                        content: $mainInfoDiv[0]
                       , disableAutoPan: false
                       , maxWidth: 0
                       , pixelOffset: new google.maps.Size(0, 44)
                       , position: location.latLng
                       , isHidden: false
                       , pane: "floatPane"
                       , zIndex: 999999
                       , width: "350px"
                       , opacity: 1.0
                       , enableEventPropagation: false
                       , closeBoxURL: "../Images/433-x.png"
                       , closeBoxMargin: "5px 5px 5px 2px"
                       , infoBoxClearance: new google.maps.Size(60, 60)
                    };
                //;
                var ibLabel = new InfoBox(myOptions);
                google.maps.event.addListener(ibLabel, 'closeclick', function (event) {
                    this.close();
                    google.maps.event.trigger(map, 'resize');

                });
                ibLabel.open(map);

            }
            //hideLoading();
            isClickedOnLayer = false;
        }
    });
    google.maps.event.addListener(map, 'zoom_changed', function () {
        var Latitude = map_center.lat().toFixed(6);
        var Longitude = map_center.lng().toFixed(6);
    });

    google.maps.event.addListener(contextMenu, 'menu_item_selected', function (latLng, eventName) {
        switch (eventName) {
            case 'setLocation_click':
                //newMarkerLatLng = latLng;
                //getConfirmBox();
                setMarkerLocation(latLng);
                break;
        }
    });

}


$(document).on("click","button[title='Toggle fullscreen view']",function () {
    
    $("#main").css('margin-left', '0px');
});



function getInfoWindow() {
    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                infowindow.setContent(results[1].formatted_address);
                infowindow.open(map, marker);
            }
        } else {
        }
    });
}

function getConfirmBox() {
    //$('#modal-Confirm').modal('show');
}

function getNewConfirmBox() {
    i++;
    //$('#modal-NewConfirm').modal('show');
}

function setMarkerLocation(latLng) {
    geocoder.geocode({ 'latLng': latLng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                var address = results[0].formatted_address;
                if (newMarker != undefined)
                    newMarker.setMap(null);
                if (marker != undefined)
                    marker.setMap(null);
                newMarker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    draggable: true
                });
                google.maps.event.addListener(newMarker, 'dragend', function () {
                    if (marker != undefined)
                        marker.setMap(null);

                    getNewConfirmBox();
                });
                getConfirmBox();
                // setTextboxValue(newMarker.position.lat().toFixed(6), newMarker.position.lng().toFixed(6), latLng)
            }
            else {
                alert("Invalid Location!");
            }
        }
        else {
            alert("Invalid Location!");
        }
    });
}

function getEnergyLayers(Layers, type) {
    var energyLayer = [];
    var dataUrl;
    if (type == "Facility")
        dataUrl = "FacilityDetail.aspx/getLayerInformation";
    if (type == "Power")
        dataUrl = "PowerDetail.aspx/getLayerInformation";
    if (Layers.length > 0) {
        var JoinLayers = Layers.join(",");
        $.ajax({
            type: "POST",
            url: dataUrl,
            data: '{ "Layers":"' + JoinLayers + '"}',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            cache: false,
            success: function (result) {
                //console.log(result.d);
                //var dataString = JSON.stringify(result.d);
                var data = JSON.parse(result.d);
                for (x in data) {
                    var layer = data[x].layerName;
                    var isInfoBox = data[x].isInfoBox;
                    var layerType = data[x].layerType;
                    var filter = data[x].cql_filter;
                    var cql_filter = "";

                    if (filter != null && filter.length > 0) {
                        for (y in filter) {
                            var obj = filter[y];
                            var values = obj.values;
                            if (values != null && values.length > 0) {
                                for (z in values) {
                                    if (z == 0) {
                                        if (cql_filter != "")
                                            cql_filter += " or ";
                                        cql_filter += obj.attribute + " IN (";
                                    }
                                    else
                                        cql_filter += ",";
                                    cql_filter += "'" + values[z] + "'";
                                    if (z == values.length - 1)
                                        cql_filter += ")";
                                }
                            }
                        }
                    }
                    energyLayer.push({ "layer": layer, "cql_filter": cql_filter, "layerType": layerType, "filter": filter, "isInfoBox": isInfoBox });
                }

            },
        });
    }
    else {
    }
    return energyLayer;
}

function setWMSlayer(layer, cql_filter) {
    var wmsOptions = {
        alt: layer,
        getTileUrl: function (tile, zoom) { return WMStileUrl(layer, "", tile, zoom, cql_filter) },
        isPng: false,
        maxZoom: 17,
        minZoom: 1,
        name: layer,
        tileSize: new google.maps.Size(256, 256)
    };
    var openlayersWMS = new google.maps.ImageMapType(wmsOptions);
    return openlayersWMS;
}

function WMStileUrl(layer, style, tile, zoom, CQL_FILTER) {
    //var baseURL = "http://m.mapsearch360.com/envision/BaseMaps/";
    var projection = window.map.getProjection();
    var zpow = Math.pow(2, zoom);
    var ul = new google.maps.Point(tile.x * 256.0 / zpow, (tile.y + 1) * 256.0 / zpow);
    var lr = new google.maps.Point((tile.x + 1) * 256.0 / zpow, (tile.y) * 256.0 / zpow);
    var ulw = projection.fromPointToLatLng(ul);
    var lrw = projection.fromPointToLatLng(lr);
    var version = "1.3.0";
    var request = "GetMap";
    var format = "image%2Fpng";
    var layers = "BaseMaps%3A" + layer;
    var crs = "EPSG:4326";
    var bbox = ulw.lat() + "," + ulw.lng() + "," + lrw.lat() + "," + lrw.lng();
    var service = "WMS";
    var width = "256";
    var height = "256";
    var styles = style;
    var transparent = "true";
    var url = baseURL + "wms?Layers=" + layers + "&version=" + version + "&EXCEPTIONS=INIMAGE" + "&Service=" + service + "&request=" + request + "&Styles=" + styles + "&format=" + format + "&CRS=" + crs + "&BBOX=" + bbox + "&width=" + width + "&height=" + height + "&isBaseLayer=True&TRANSPARENT=" + transparent;
    if (CQL_FILTER != "")
        url += "&CQL_FILTER=" + CQL_FILTER;
    return url;
}

function removeLayer() {
    map.overlayMapTypes.clear();
}

function btnNoClick() {
    if (i == 0) {
        if (marker != undefined) {
            marker.setMap(map);
            marker.setPosition(map_center);
            getInfoWindow();
        }
    }
    if (newMarker != undefined) {
        newMarker.setPosition(newMarkerLatLng);
    }
}

function btnNewNoClick() {
    if (newMarker != undefined) {
        newMarker.setPosition(newMarkerLatLng);
    }
}

function SaveLatLong(Lati, Longi, type, ID) {
    var dataUrl;
    if (type == "Facility")
        dataUrl = "FacilityDetail.aspx/SaveLatLng";
    if (type == "Power")
        dataUrl = "PowerDetail.aspx/SaveLatLng";

    $.ajax({
        type: "POST",
        url: dataUrl,
        data: '{ "Lati":"' + Lati + '","Longi":"' + Longi + '","ID":"' + ID + '"}',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        cache: false,
        success: function (result) {
        }
    });
}

//new code
function removeInfoBox() {
    $(".infoBox").remove();
}
function getBbox(mapA, center, x, y) {
    var zoom = mapA.getZoom();
    var scale = Math.pow(2, zoom);
    var proj = mapA.getProjection();
    var wc = proj.fromLatLngToPoint(center);
    var bounds = new google.maps.LatLngBounds();
    var sw = new google.maps.Point(wc.x - (4 / scale), wc.y - (4 / scale));
    var swPro = proj.fromPointToLatLng(sw);
    bounds.extend(swPro);
    var ne = new google.maps.Point(wc.x + (4 / scale), wc.y + (4 / scale));
    var nePro = proj.fromPointToLatLng(ne);
    bounds.extend(nePro);
    //var Bbox = [];
    //Bbox.push(proj.fromPointToLatLng(new google.maps.Point(wc.x - (0.000001 / scale), wc.y)).lng());
    //Bbox.push(proj.fromPointToLatLng(new google.maps.Point(wc.x, wc.y + (0.000001 / scale))).lat());
    //Bbox.push(proj.fromPointToLatLng(new google.maps.Point(wc.x + (0.000001 / scale), wc.y)).lng());
    //Bbox.push(proj.fromPointToLatLng(new google.maps.Point(wc.x, wc.y - (0.000001 / scale))).lat);
    var Bbox = swPro.lng() + "," + nePro.lat() + "," + nePro.lng() + "," + swPro.lat();
    //var Bbox = bounds.getSouthWest().lng() + "," + bounds.getSouthWest().lat() + "," + bounds.getNorthEast().lng() + "," + bounds.getNorthEast().lat();
    //var opts = {
    //    bounds: bounds,
    //    map: mapA,
    //    editable: false
    //}
    //var rect = new google.maps.Rectangle(opts);
    //return Bbox.join(",");

    return Bbox;
}
function setInfoLayer(mapA, location, x, y, height, width) {
    //showLoading();
    var infoData = [];
    var infodata = getInfoBoxData(mapA, infoData, 0, location, x, y, height, width);
    return infodata;
}
function getInfoBoxData(mapA, infoData, index, location, x, y, height, width) {
    if (index < energyLayer.length) {
        var bbox = getBbox(mapA, location.latLng, x, y);
        if (energyLayer[index]["isInfoBox"]) {
            var layer = energyLayer[index]["layer"];
            var filter = energyLayer[index]["filter"];
            var CQL_FILTER = [];
            for (var x in filter) {
                CQL_FILTER.push({ "attribute": filter[x]["attribute"], "values": filter[x]["values"], "wmsGraphics": filter[x]["wmsGraphics"] })
            }
            //console.log(layer);
            //console.log(bbox);
            //console.log(JSON.stringify(CQL_FILTER));

            var layerType = energyLayer[index]["layerType"];
            var tempdata = "{ 'layer' : '" + layer + "', 'bbox' : '" + bbox + "', 'CQL_FILTER' : '" + JSON.stringify(CQL_FILTER) + "' }";

            $.ajax({
                type: "POST",
                url: "PowerDetail.aspx/getInfoBoxData",
                data: tempdata,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async: false,
                cache: false,
            }).success(function (result) {
                //console.log(result.d);
                var features = JSON.parse(result.d);
                //console.log(features);
                if (features.length > 0) {
                    for (var x in features) {
                        //var data = features[x]["properties"];
                        //data = data[layer];
                        var data = features[x];
                        if (data != undefined) {
                            if (data.FACTYPE == "Refinery") {
                                data.CAPACITY = data.CAPACITY + " " + "(b/cd)";
                            }
                            //console.log(filter);
                            var info = { "layer": layer, "data": data, "layerType": layerType, "filter": filter };
                            infoData.push(info);
                        }
                    }
                }
                getInfoBoxData(mapA, infoData, index + 1, location, bbox, x, y, height, width);
            });
        }
        else
            getInfoBoxData(mapA, infoData, index + 1, location, bbox, x, y, height, width);
    }
    return infoData;
}
function setInfoBox(zoom, isWizard, infoData) {
    var $mainInfoDiv = $('<div>');
    $mainInfoDiv.addClass("maininfodiv");
    infoData = infoData.reverse();
    var Table = [];

    for (x in infoData) {

        var layer = infoData[x].layer;
        var data = infoData[x].data;
        var layerType = infoData[x].layerType;
        var filter = infoData[x].filter;

        var style = "";
        var wmsGraphics = "";
        //;

        if (infoData[x].style != undefined && infoData[x].style != "")
            style = infoData[x].style;

        if (infoData[x].wmsGraphic != undefined && infoData[x].wmsGraphic != "")
            wmsGraphics = infoData[x].wmsGraphic;

        for (x in filter) {
            var temp = filter[x];
            var index = temp.values.indexOf(data[temp.attribute]);
            if (index > -1) {
                style = temp.styles[index];
                wmsGraphics = temp.wmsGraphics[index];
                break;
            }
        }
        //console.log(style);
        //console.log(wmsGraphics);

        if (layerType == "pipeline") {
            Table.push(makePipelineTableHTML(isWizard, data, style, wmsGraphics));
        }
        else if (layerType == "facility") {
            Table.push(makeFacilityTableHTML(isWizard, data, style, wmsGraphics));
        }
        else if (layerType == "interconnect") {
            Table.push(makeInterconnectTableHTML(isWizard, data, style, wmsGraphics));
        }
        else if (layerType == "survey") {
            if (mapA.zoom > 7) {
                var title = "&nbsp;";
                if (layer == "us_land_survey")
                    title = "US Land Survey";
                Table.push(makeSurveyTableHTML(isWizard, title, data, style, wmsGraphics));
            }
        }
        else if (layerType == "powerline") {
            Table.push(makePowerlineTableHTML(isWizard, data, style, wmsGraphics));
        }
        else if (layerType == "powerplant") {
            Table.push(makePowerplantTableHTML(isWizard, data, style, wmsGraphics));
        }
        else if (layerType == "proposed") {
            Table.push(makeProposedTableHTML(isWizard, data, style, wmsGraphics));
        }
        else if (layerType == "serviceTerritories") {
            Table.push(makeServiceTerritoriesTableHTML(isWizard, data, style, wmsGraphics));
        }
        else if (layerType == "substation") {
            Table.push(makeSubstationTableHTML(isWizard, data, style, wmsGraphics));
        }
        else if (layerType == "powerNERC") {
            Table.push(makeNERCregionTableHTML(isWizard, data, style, wmsGraphics, "NERC"));
        }
        else if (layerType == "powerISO") {
            Table.push(makeNERCregionTableHTML(isWizard, data, style, wmsGraphics, "ISO"));
        }
        if (x > 0)
            Table[x].hide();
    }

    if (Table.length > 0) {
        for (x in Table)
            $(Table[x]).appendTo($mainInfoDiv);

        if (!isWizard)
            $("<div>").addClass("infoAction").append(getDirectionTable()).appendTo($mainInfoDiv);

        //$(document.createElement('div')).addClass('pointer bottomLeft').appendTo($mainInfoDiv);

        var $footerDiv = $('<div>');
        $footerDiv.addClass("infoFooter");

        var $upgrade = "<a href=\"http://www.mapsearch.com/envision.html?cmpid=mapwidget\" target=\"_blank\">Upgrade to View more data</a>";
        if (infoData.length > 1 && isWizard == true) {
            $("<div>").addClass("upgradeSmall").append($upgrade).appendTo($footerDiv);
        }
        else {
            $("<div>").addClass("upgrade").append($upgrade).appendTo($footerDiv);
        }

        $footerDiv.appendTo($mainInfoDiv);

        if (infoData.length > 1) {

            var $pager = $('<div>');
            $pager.addClass("infoPager");

            var $span = $("<span>");

            var $next = $("<div>");
            $next.addClass("arrow next");

            var $prev = $("<div>");
            $prev.addClass("arrow prev");

            $prev.appendTo($pager);
            $span.appendTo($pager);
            $next.appendTo($pager);

            $pager.appendTo($footerDiv);


            setInfoPager(1, $prev, $next, $span, infoData, $mainInfoDiv);

            $next.click(function () {
                var current = parseInt($span.attr("current"));
                if (current < infoData.length) {
                    current++;
                    setInfoPager(current, $prev, $next, $span, infoData, $mainInfoDiv);
                }
            });

            $prev.click(function () {
                var current = parseInt($span.attr("current"));
                if (current > 1) {
                    current--;
                    setInfoPager(current, $prev, $next, $span, infoData, $mainInfoDiv);
                }
            });

        }
    }

    return $mainInfoDiv;
}

function setInfoPager(current, $prev, $next, $span, infoData, $maininfodiv) {
    $next.removeClass("disable");
    $prev.removeClass("disable");
    $span.attr("current", current);
    $span.html("Feature " + current + " of " + infoData.length);
    if (current == infoData.length)
        $next.addClass("disable");
    else if (current == 1)
        $prev.addClass("disable");

    var infoDiv = $maininfodiv.children(".infoDiv");
    if (infoDiv.length > 0) {
        for (var x = 0; x < infoDiv.length; x++) {
            if (parseInt(x) + 1 == current)
                $(infoDiv[x]).show();
            else
                $(infoDiv[x]).hide();
        }
    }
}


function getInfoCol(x, val) {
    var $infoCol = $("<div>");
    $infoCol.addClass('infocol');

    if (val == "" || val == undefined || parseFloat(val) == 0)
        val = "N/A";
    else if (!isNaN(val))
        val = format(val, 2);

    var val = "<p class='val'>" + val + "</p>";
    $infoCol.html(toProperCase(x.replace("_", " ")) + ": " + val);
    return $infoCol;
}

function getInfoRow(myArray, colspan) {
    var $infoRow = $("<tr>");
    jQuery.each(myArray, function (i, x) {
        var $infoCol = $("<td>");
        if (colspan > 0)
            $infoCol.attr("colspan", colspan);
        $infoCol.append(getInfoCol(i, x));
        $infoRow.append($infoCol);
    });
    return $infoRow;
}


function makePipelineTableHTML(isWizard, myArray, style, wmsGraphics) {

    var $infoDiv = $("<div>");
    $infoDiv.addClass('infoDiv');

    var title = myArray["SYSTEM"];
    if (title == undefined)
        title = "&nbsp;";
    var $infoTitle = $("<div>");
    $infoTitle.addClass('infoTitle');

    var $title = $("<div>");
    $title.addClass("title");
    $title.html(title);
    $infoTitle.append($title);

    var $indicator = $("<div>");
    $indicator.addClass("indicator");
    if (wmsGraphics == "triangle") {
        $indicator.addClass("svgIndicator");
        var html = getSvgTriangle(style);
        $indicator.html(html);
    }
    else {
        if (wmsGraphics != "")
            $indicator.addClass(wmsGraphics);
        if (style != "")
            $indicator.attr("style", style);
    }
    $infoTitle.append($indicator);
    $infoDiv.append($infoTitle);

    //if (!isWizard) {
    var $infoTable = $("<table>");
    $infoTable.css("width", "100%");

    var infoArray = {};
    infoArray.owner = myArray["OWNER"];
    $infoTable.append(getInfoRow(infoArray, 2));

    var infoArray = {};
    infoArray.operator = myArray["OPERATOR"];
    $infoTable.append(getInfoRow(infoArray, 2));

    infoArray = {};
    infoArray.commodity = myArray["COMMODITY"];
    infoArray.commodity2 = myArray["COMMODITY2"];
    $infoTable.append(getInfoRow(infoArray, 0));

    //infoArray = {};
    //infoArray.diameter = myArray["DIAMETER"];
    //infoArray.mileage = myArray["MILEAGE"];
    //$infoTable.append(getInfoRow(infoArray, 0));
    /*infoArray = {};
    infoArray.mapowner = myArray["OWNER"];
    $infoTable.append(getInfoRow(infoArray, 2));*/

    //getDirectionRow($infoTable, 2);

    $infoDiv.append($infoTable);
    //}
    return $infoDiv;
}

function makeFacilityTableHTML(isWizard, myArray, style, wmsGraphics) {
    //console.log(myArray);
    var $infoDiv = $("<div>");
    $infoDiv.addClass('infoDiv');

    var title = myArray["FACNAME"];
    if (title == undefined)
        title = "&nbsp;";
    var $infoTitle = $("<div>");
    $infoTitle.addClass('infoTitle');
    var $title = $("<div>");
    $title.addClass("title");
    $title.html(title);
    $infoTitle.append($title);

    var $indicator = $("<div>");
    $indicator.addClass("indicator");
    if (wmsGraphics == "triangle") {
        $indicator.addClass("svgIndicator");
        var html = getSvgTriangle(style);
        $indicator.html(html);
    }
    else {
        if (wmsGraphics != "")
            $indicator.addClass(wmsGraphics);
        if (style != "")
            $indicator.attr("style", style);
    }
    $infoTitle.append($indicator);

    $infoDiv.append($infoTitle);
    //if (!isWizard) {
    var $infoTable = $("<table>");
    $infoTable.css("width", "100%");

    var infoArray = {};
    infoArray.owner = myArray["OWNER"];
    $infoTable.append(getInfoRow(infoArray, 2));

    var infoArray = {};
    infoArray.operator = myArray["OPERATOR"];
    $infoTable.append(getInfoRow(infoArray, 2));

    //infoArray = {};
    //infoArray.commodity = myArray["COMMODITY"];
    //$infoTable.append(getInfoRow(infoArray, 2));

    infoArray = {};
    infoArray.capacity = myArray["CAPACITY"];
    infoArray.type = myArray["FACTYPE"];
    $infoTable.append(getInfoRow(infoArray, 0));

    // infoArray = {};
    // infoArray.owner = myArray["OWNER"];
    //$infoTable.append(getInfoRow(infoArray, 2));

    //getDirectionRow($infoTable, 2);

    $infoDiv.append($infoTable);
    //}
    return $infoDiv;
}

function makeInterconnectTableHTML(isWizard, myArray, style, wmsGraphics) {
    var $infoDiv = $("<div>");
    $infoDiv.addClass('infoDiv');

    var title = myArray["NAME"];
    if (title == undefined)
        title = "&nbsp;";
    var $infoTitle = $("<div>");
    $infoTitle.addClass('infoTitle');
    var $title = $("<div>");
    $title.addClass("title");
    $title.html(title);
    $infoTitle.append($title);

    var $indicator = $("<div>");
    $indicator.addClass("indicator");
    if (wmsGraphics == "triangle") {
        $indicator.addClass("svgIndicator");
        var html = getSvgTriangle(style);
        $indicator.html(html);
    }
    else {
        if (wmsGraphics != "")
            $indicator.addClass(wmsGraphics);
        if (style != "")
            $indicator.attr("style", style);
    }
    $infoTitle.append($indicator);

    $infoDiv.append($infoTitle);
    //if (!isWizard) {
    var $infoTable = $("<table>");
    $infoTable.css("width", "100%");

    var infoArray = {};
    infoArray.commodity = myArray["COMMODITY"];
    $infoTable.append(getInfoRow(infoArray, 0));

    var infoArray = {};
    infoArray.intername1 = myArray["INTRNAME1"];
    $infoTable.append(getInfoRow(infoArray, 0));

    var infoArray = {};
    infoArray.intername2 = myArray["INTRNAME2"];
    $infoTable.append(getInfoRow(infoArray, 0));

    $infoDiv.append($infoTable);
    //}
    return $infoDiv;
}

function makeSurveyTableHTML(isWizard, title, myArray, style, wmsGraphics) {
    var $infoDiv = $("<div>");
    $infoDiv.addClass('infoDiv');

    var $infoTitle = $("<div>");
    $infoTitle.addClass('infoTitle');
    var $title = $("<div>");
    $title.addClass("title");
    $title.html(title);
    $infoTitle.append($title);

    var $indicator = $("<div>");
    $indicator.addClass("indicator");
    if (wmsGraphics == "triangle") {
        $indicator.addClass("svgIndicator");
        var html = getSvgTriangle(style);
        $indicator.html(html);
    }
    else {
        if (wmsGraphics != "")
            $indicator.addClass(wmsGraphics);
        if (style != "")
            $indicator.attr("style", style);
    }
    $infoTitle.append($indicator);

    $infoDiv.append($infoTitle);
    //if (!isWizard) {
    var $infoTable = $("<table>");
    $infoTable.css("width", "100%");

    var infoArray = {};
    infoArray["Survey Type"] = myArray["FEATURE1"];
    $infoTable.append(getInfoRow(infoArray, 0));

    if (myArray["FEATURE2"] == null)
        myArray["FEATURE2"] = "";

    var surveyDetails = myArray["FEATURE2"].split(" ");
    //console.log(surveyDetails.split(" "));
    //infoArray["Survey Details"] = myArray["FEATURE2"];
    var Township = "";
    var Range = "";
    if (surveyDetails.length == 6) {
        Township = surveyDetails[1] + " " + surveyDetails[2];
        Range = surveyDetails[4] + " " + surveyDetails[5];
    }
    var infoArray = {};
    infoArray["Township"] = Township;
    $infoTable.append(getInfoRow(infoArray, 0));

    var infoArray = {};
    infoArray["Range"] = Range;
    $infoTable.append(getInfoRow(infoArray, 0));

    $infoDiv.append($infoTable);
    //}
    return $infoDiv;
}

function makePowerlineTableHTML(isWizard, myArray, style, wmsGraphics) {

    var $infoDiv = $("<div>");
    $infoDiv.addClass('infoDiv');

    var title = myArray["TYPE"];
    var voltageType = myArray["VOLT_CAT"];
    if (voltageType == "DC")
        title = "Direct Current";
    else
        title = "Alternating Current";

    if (title == undefined)
        title = "&nbsp;";
    var $infoTitle = $("<div>");
    $infoTitle.addClass('infoTitle');

    var $title = $("<div>");
    $title.addClass("title");
    $title.html(title);
    $infoTitle.append($title);

    var $indicator = $("<div>");
    $indicator.addClass("indicator");
    if (wmsGraphics == "triangle") {
        $indicator.addClass("svgIndicator");
        var html = getSvgTriangle(style);
        $indicator.html(html);
    }
    else {
        if (wmsGraphics != "")
            $indicator.addClass(wmsGraphics);
        if (style != "")
            $indicator.attr("style", style);
    }
    $infoTitle.append($indicator);

    $infoDiv.append($infoTitle);
    //if (!isWizard) {
    var $infoTable = $("<table>");
    $infoTable.css("width", "100%");

    var infoArray = {};
    infoArray.owner = myArray["OWNER"];
    $infoTable.append(getInfoRow(infoArray, 2));

    var infoArray = {};
    infoArray.operator = myArray["OPERATOR"];
    $infoTable.append(getInfoRow(infoArray, 2));

    infoArray = {};
    infoArray.Voltage = myArray["VOLTAGE"] + " kV";
    infoArray.Voltage_Category = myArray["VOLT_CAT"];

    $infoTable.append(getInfoRow(infoArray, 0));

    $infoDiv.append($infoTable);
    //}
    return $infoDiv;
}

function makePowerplantTableHTML(isWizard, myArray, style, wmsGraphics) {

    var $infoDiv = $("<div>");
    $infoDiv.addClass('infoDiv');

    var title = myArray["FACNAME"];
    if (title == undefined)
        title = "&nbsp;";
    var $infoTitle = $("<div>");
    $infoTitle.addClass('infoTitle');

    var $title = $("<div>");
    $title.addClass("title");
    $title.html(title);
    $infoTitle.append($title);

    var $indicator = $("<div>");
    $indicator.addClass("indicator");
    if (wmsGraphics == "triangle") {
        $indicator.addClass("svgIndicator");
        var html = getSvgTriangle(style);
        $indicator.html(html);
    }
    else {
        if (wmsGraphics != "")
            $indicator.addClass(wmsGraphics);
        if (style != "")
            $indicator.attr("style", style);
    }
    $infoTitle.append($indicator);

    $infoDiv.append($infoTitle);
    //if (!isWizard) {
    var $infoTable = $("<table>");
    $infoTable.css("width", "100%");

    var infoArray = {};
    infoArray.owner = myArray["OWNER"];
    $infoTable.append(getInfoRow(infoArray, 2));

    var infoArray = {};
    infoArray.operator = myArray["OPERATOR"];
    $infoTable.append(getInfoRow(infoArray, 2));

    infoArray = {};
    infoArray.Capacity = myArray["NAME_CAP"] + " MW";
    infoArray.Primary_Fuel = myArray["PRIMEFUEL"];
    $infoTable.append(getInfoRow(infoArray, 0));

    $infoDiv.append($infoTable);
    //}
    return $infoDiv;
}

function makeProposedTableHTML(isWizard, myArray, style, wmsGraphics) {

    var $infoDiv = $("<div>");
    $infoDiv.addClass('infoDiv');

    //var title = myArray["subname"];
    var title = "Proposed Transmission";
    if (title == undefined)
        title = "&nbsp;";
    var $infoTitle = $("<div>");
    $infoTitle.addClass('infoTitle');

    var $title = $("<div>");
    $title.addClass("title");
    $title.html(title);
    $infoTitle.append($title);

    var $indicator = $("<div>");
    $indicator.addClass("indicator");
    if (wmsGraphics == "triangle") {
        $indicator.addClass("svgIndicator");
        var html = getSvgTriangle(style);
        $indicator.html(html);
    }
    else {
        if (wmsGraphics != "")
            $indicator.addClass(wmsGraphics);
        if (style != "")
            $indicator.attr("style", style);
    }
    $infoTitle.append($indicator);

    $infoDiv.append($infoTitle);
    //if (!isWizard) {
    var $infoTable = $("<table>");
    $infoTable.css("width", "100%");

    var infoArray = {};
    infoArray.owner = myArray["owner"];
    $infoTable.append(getInfoRow(infoArray, 2));

    var infoArray = {};
    infoArray.operator = myArray["operator"];
    $infoTable.append(getInfoRow(infoArray, 2));

    infoArray = {};
    infoArray.voltage = myArray["voltage"] + " kV";
    infoArray.status = myArray["status"];
    $infoTable.append(getInfoRow(infoArray, 0));

    $infoDiv.append($infoTable);
    //}
    return $infoDiv;
}

function makeServiceTerritoriesTableHTML(isWizard, myArray, style, wmsGraphics) {

    var $infoDiv = $("<div>");
    $infoDiv.addClass('infoDiv');

    var title = myArray["subname"];
    if (title == undefined)
        title = "&nbsp;";
    var $infoTitle = $("<div>");
    $infoTitle.addClass('infoTitle');

    var $title = $("<div>");
    $title.addClass("title");
    $title.html(title);
    $infoTitle.append($title);

    var $indicator = $("<div>");
    $indicator.addClass("indicator");
    if (wmsGraphics == "triangle") {
        $indicator.addClass("svgIndicator");
        var html = getSvgTriangle(style);
        $indicator.html(html);
    }
    else {
        if (wmsGraphics != "")
            $indicator.addClass(wmsGraphics);
        if (style != "")
            $indicator.attr("style", style);
    }
    $infoTitle.append($indicator);

    $infoDiv.append($infoTitle);
    //if (!isWizard) {
    var $infoTable = $("<table>");
    $infoTable.css("width", "100%");

    var infoArray = {};
    infoArray.owner = myArray["owner"];
    $infoTable.append(getInfoRow(infoArray, 2));

    var infoArray = {};
    infoArray.operator = myArray["operator"];
    $infoTable.append(getInfoRow(infoArray, 2));

    infoArray = {};
    infoArray["company type"] = myArray["companytyp"];
    $infoTable.append(getInfoRow(infoArray, 2));

    $infoDiv.append($infoTable);
    //}
    return $infoDiv;
}

function makeSubstationTableHTML(isWizard, myArray, style, wmsGraphics) {

    var $infoDiv = $("<div>");
    $infoDiv.addClass('infoDiv');

    var title = myArray["SUBNAME"];
    if (title == undefined)
        title = "&nbsp;";
    var $infoTitle = $("<div>");
    $infoTitle.addClass('infoTitle');

    var $title = $("<div>");
    $title.addClass("title");
    $title.html(title);
    $infoTitle.append($title);

    var $indicator = $("<div>");
    $indicator.addClass("indicator");
    if (wmsGraphics == "triangle") {
        $indicator.addClass("svgIndicator");
        var html = getSvgTriangle(style);
        $indicator.html(html);
    }
    else {
        if (wmsGraphics != "")
            $indicator.addClass(wmsGraphics);
        if (style != "")
            $indicator.attr("style", style);
    }
    $infoTitle.append($indicator);

    $infoDiv.append($infoTitle);
    //if (!isWizard) {
    var $infoTable = $("<table>");
    $infoTable.css("width", "100%");

    var infoArray = {};
    infoArray.owner = myArray["OWNER"];
    $infoTable.append(getInfoRow(infoArray, 2));

    var infoArray = {};
    infoArray.operator = myArray["OPERATOR"];
    $infoTable.append(getInfoRow(infoArray, 2));

    infoArray = {};
    infoArray.status = myArray["STATUS"];
    infoArray["Primary Voltage"] = myArray["PRIMVOLT"] + " kV";
    $infoTable.append(getInfoRow(infoArray, 0));

    $infoDiv.append($infoTable);
    //}
    return $infoDiv;
}

function makeNERCregionTableHTML(isWizard, myArray, style, wmsGraphics, flag) {

    var $infoDiv = $("<div>");
    $infoDiv.addClass('infoDiv');

    var title = myArray["pop_name"];
    if (title == undefined)
        title = "&nbsp;";
    var $infoTitle = $("<div>");
    $infoTitle.addClass('infoTitle');

    var $title = $("<div>");
    $title.addClass("title");
    $title.html(title);
    $infoTitle.append($title);

    var $indicator = $("<div>");
    $indicator.addClass("indicator");
    if (wmsGraphics == "triangle") {
        $indicator.addClass("svgIndicator");
        var html = getSvgTriangle(style);
        $indicator.html(html);
    }
    else {
        if (wmsGraphics != "")
            $indicator.addClass(wmsGraphics);
        if (style != "")
            $indicator.attr("style", style);
    }
    $infoTitle.append($indicator);

    $infoDiv.append($infoTitle);
    //if (!isWizard) {
    var $infoTable = $("<table>");
    $infoTable.css("width", "100%");

    var infoArray = {};
    if (flag == "NERC") {
        infoArray.region = myArray["region"];
        $infoTable.append(getInfoRow(infoArray, 2));
    }
    else if (flag == "ISO") {
        infoArray.name = myArray["name"];
        $infoTable.append(getInfoRow(infoArray, 2));
    }
    //var infoArray = {};
    //infoArray.pop_name = myArray["pop_name"];
    //$infoTable.append(getInfoRow(infoArray, 2));

    //infoArray = {};
    //infoArray["map_id"] = myArray["map_id"];
    //$infoTable.append(getInfoRow(infoArray, 2));

    $infoDiv.append($infoTable);
    //}
    return $infoDiv;
}
function toProperCase(str) {
    var noCaps = ['of', 'a', 'the', 'and', 'an', 'am', 'or', 'nor', 'but', 'is', 'if', 'then',
        'else', 'when', 'at', 'from', 'by', 'on', 'off', 'for', 'in', 'out', 'to', 'into', 'with'];
    return str.replace(/\w\S*/g, function (txt, offset) {
        if (offset != 0 && noCaps.indexOf(txt.toLowerCase()) != -1) {
            return txt.toLowerCase();
        }
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function getSvgTriangle(style) {
    var html = '<svg xmlns="http://www.w3.org/2000/svg" height=14 width=14 >';
    html += '<g><polygon style="' + style + '" points="7,0 0,14 14,14"></polygon></g>';
    html += '</svg>';
    return html;
}


function TransmissionProjectgooleinti()
{
    geocoder = new google.maps.Geocoder();
    //if (lat > 0) {
    //    map_center = new google.maps.LatLng(lat, lng);
    //    mapType = google.maps.MapTypeId.HYBRID;
    //}-34.397, 150.644,,37.4419, -122.1419
    map_center = new google.maps.LatLng(39.5, -98.35);
    // map_center = new google.maps.LatLng(48.320029262522816, -92.26642871911577);

    mapType = google.maps.MapTypeId.HYBRID
    var mapOptions = {
        zoom: 4,
        draggableCursor: 'default',
        center: map_center,
        mapTypeId: mapType,
        streetViewControl: false,
        gestureHandling: 'greedy',
        clickableIcons: false,
    };

    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    //map.setMapTypeId('terrain');
    infowindow = new google.maps.InfoWindow();

}

