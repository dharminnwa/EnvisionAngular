function getEnergyLayers(Layers) {
    var energyLayer = [];
    if (Layers.length > 0) {
        $.ajax({
            type: "POST",
            cache: true,
            url: "../Map/getLayerInformation",
            data: { "Layers": Layers.join(",") },
            async: false
        }).success(function (result) {
            var data = JSON.parse(result);
            //energyLayer = [];
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

                //if (isInfoBox)
                energyLayer.push({ "layer": layer, "cql_filter": cql_filter, "layerType": layerType, "filter": filter, "isInfoBox": isInfoBox });
            }
        });
    }
    else {
    }
    return energyLayer;
}

function decryptAjaxResult(stringtext) {
    var key = CryptoJS.enc.Utf8.parse('8080808080808080');
    var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
    var encryptedlogin = CryptoJS.AES.decrypt(stringtext, key,
    {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    encryptedlogin = encryptedlogin.toString(CryptoJS.enc.Utf8);
    return encryptedlogin;
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

function setWMSWithStylelayer(layer, cql_filter, style, shape) {
    var wmsOptions = {
        alt: layer,
        getTileUrl: function (tile, zoom) { return WMStileUrlWithShape(layer, style, tile, zoom, cql_filter, shape) },
        isPng: false,
        maxZoom: 17,
        minZoom: 1,
        name: layer,
        tileSize: new google.maps.Size(256, 256)
    };
    var openlayersWMS = new google.maps.ImageMapType(wmsOptions);
    return openlayersWMS;
}

function setWMSWithColoredlayer(layer, cql_filter, style, shape, thickness) {
    var wmsOptions = {
        alt: layer,
        getTileUrl: function (tile, zoom) { return WMStileUrlWithColoredLayer(layer, style, tile, zoom, cql_filter, shape, thickness) },
        isPng: false,
        maxZoom: 17,
        minZoom: 1,
        name: layer,
        tileSize: new google.maps.Size(256, 256)
    };
    var openlayersWMS = new google.maps.ImageMapType(wmsOptions);
    return openlayersWMS;
}


function CreateSldBody(shape, stroke, strokeWidth, strokeCapcity, layerName, title, abstarct) {

    var sld_body = '<?xml version="1.0" encoding="ISO-8859-1"?>' +
                   ' <StyledLayerDescriptor version="1.0.0"' +
                   ' xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"' +
                   ' xmlns="http://www.opengis.net/sld"' +
                   ' xmlns:ogc="http://www.opengis.net/ogc"' +
                   ' xmlns:xlink="http://www.w3.org/1999/xlink"' +
                   ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
                   ' <NamedLayer>' +
                   ' <Name>' + layerName + '</Name>' +
                   ' <UserStyle>' +
                   ' <Title>' + title + '</Title>' +
                   ' <Abstract>' + abstarct + '</Abstract>' +
                   ' <FeatureTypeStyle>' +
                   ' <Rule>' +
                   ' <Name>rule1</Name>' +
                   ' <Title>' + title + '</Title>' +
                   ' <Abstract>A solid blue line with a 1 pixel width</Abstract>';

    //if (shape == "Line") {
    //    sld_body += ' <LineSymbolizer>' +
    //                 ' <Stroke>' +
    //                 ' <CssParameter name="stroke">' + stroke + '</CssParameter>' +
    //                 ' <CssParameter name="stroke-opacity">' + strokeCapcity + '</CssParameter>' +
    //                 ' <CssParameter name="stroke-width">1.5</CssParameter>' +
    //                 ' </Stroke>' +
    //                 ' </LineSymbolizer>';
    //}
    if (shape == "Line") {
        sld_body += ' <LineSymbolizer>' +
                     ' <Stroke>' +
                     ' <CssParameter name="stroke">' + stroke + '</CssParameter>' +
                     ' <CssParameter name="stroke-opacity">' + strokeCapcity + '</CssParameter>';
        if (parseInt(strokeWidth) > 0) {
            sld_body += ' <CssParameter name="stroke-width">' + parseInt(strokeWidth) + '</CssParameter>';
        }
        else {
            sld_body += ' <CssParameter name="stroke-width">1.5</CssParameter>';
        }
        sld_body += ' </Stroke>' +
            ' </LineSymbolizer>';
    }

    if (shape == "Circle") {
        sld_body += ' <PointSymbolizer>"'
        + ' <Graphic>'
        + ' <Mark>'
        + ' <WellKnownName>circle</WellKnownName>'
        + ' <Fill>'
        + ' <CssParameter name="fill">' + stroke + '</CssParameter>'
        + ' </Fill>'
         + ' <Stroke>'
        + ' <CssParameter name="stroke">#000000</CssParameter>'
        + ' <CssParameter name="stroke-width">0.5</CssParameter>'
        + ' </Stroke>'
        + ' </Mark>'
        + ' <CssParameter name="stroke">#000000</CssParameter>'
        + ' <CssParameter name="stroke-width">2</CssParameter>'
        + ' <Size>12</Size>'
        + ' </Graphic>'
        + ' </PointSymbolizer>'
    }
    if (shape == "Square") {
        sld_body += ' <PointSymbolizer>'
        + ' <Graphic>'
        + ' <Mark>'
        + ' <WellKnownName>square</WellKnownName>'
        + ' <Fill>'
        + ' <CssParameter name="fill">' + stroke + '</CssParameter>'
        + ' </Fill>'
        + ' <Stroke>'
        + ' <CssParameter name="stroke">#000000</CssParameter>'
        + ' <CssParameter name="stroke-width">0.5</CssParameter>'
        + ' </Stroke>'
        + ' </Mark>'
        + ' <Size>12</Size>'
        + ' </Graphic>'
        + ' </PointSymbolizer>'
    }
    if (shape == "Triangle") {
        sld_body += ' <PointSymbolizer>'
        + ' <Graphic>'
        + ' <Mark>'
        + ' <WellKnownName>triangle</WellKnownName>'
        + ' <Fill>'
        + ' <CssParameter name="fill">' + stroke + '</CssParameter>'
        + ' </Fill>'
        + ' <Stroke>'
        + ' <CssParameter name="stroke">#000000</CssParameter>'
        + ' </Stroke>'
        + ' </Mark>'
        + ' <Size>15</Size>'
        + ' </Graphic>'
        + ' </PointSymbolizer>'
    }
    if (shape == "Diamond") {
        sld_body += ' <PointSymbolizer>'
        + ' <Graphic>'
        + ' <Mark>'
        + ' <WellKnownName>square</WellKnownName>'
        + ' <Fill>'
        + ' <CssParameter name="fill">' + stroke + '</CssParameter>'
        + ' </Fill>'
        + ' <Stroke>'
        + ' <CssParameter name="stroke">#000000</CssParameter>'
        + ' <CssParameter name="stroke-width">0.5</CssParameter>'
        + ' </Stroke>'
        + ' </Mark>'
        + ' <Size>12</Size>'
        + '<Rotation>45</Rotation>'
        + ' </Graphic>'
        + ' </PointSymbolizer>'
    }

    sld_body += ' </Rule>' +
                ' </FeatureTypeStyle>' +
                ' </UserStyle>' +
                ' </NamedLayer>' +
                ' </StyledLayerDescriptor>';
    return encodeURIComponent(sld_body);


}

function WMStileUrlWithShape(layer, style, tile, zoom, CQL_FILTER, shape) {
    var projection = window.mapA.getProjection();
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
    var theSLD_BODY = CreateSldBody(shape, style, "5", "1", "BaseMaps:" + layer, "BaseMaps:" + layer, "abstract");
    var transparent = "true";
    var url = baseURL + "wms?";
    if (style == "")
        url += "Layers=" + layers;
    else
        url += "SLD_BODY=" + theSLD_BODY;
    url += "&version=" + version + "&EXCEPTIONS=INIMAGE" + "&Service=" + service + "&request=" + request + "&format=" + format + "&CRS=" + crs + "&BBOX=" + bbox + "&width=" + width + "&height=" + height + "&isBaseLayer=True&TRANSPARENT=" + transparent;
    if (CQL_FILTER != "")
        url += "&FILTER=" + CQL_FILTER;
    return url;
}

function WMStileUrl(layer, style, tile, zoom, CQL_FILTER) {
    var projection = window.mapA.getProjection();
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
    var transparent = "true";
    var url = baseURL + "wms?";
    url += "Layers=" + layers;
    url += "&version=" + version + "&EXCEPTIONS=INIMAGE" + "&Service=" + service + "&request=" + request + "&format=" + format + "&CRS=" + crs + "&BBOX=" + bbox + "&width=" + width + "&height=" + height + "&isBaseLayer=True&TRANSPARENT=" + transparent;
    if (CQL_FILTER != "")
        url += "&CQL_FILTER=" + CQL_FILTER;
    //console.log(url);
    return url;
}

function WMStileUrlWithColoredLayer(layer, style, tile, zoom, CQL_FILTER, shape, thickness) {
    var projection = window.mapA.getProjection();
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
    var theSLD_BODY = CreateSldBody(shape, style, thickness, "1", "BaseMaps:" + layer, "BaseMaps:" + layer, "abstract");
    var transparent = "true";
    var url = baseURL + "wms?";
    if (style == "")
        url += "Layers=" + layers;
    else
        url += "SLD_BODY=" + theSLD_BODY;

    url += "&version=" + version + "&EXCEPTIONS=INIMAGE" + "&Service=" + service + "&request=" + request + "&format=" + format + "&CRS=" + crs + "&BBOX=" + bbox + "&width=" + width + "&height=" + height + "&isBaseLayer=True&TRANSPARENT=" + transparent;
    if (CQL_FILTER != "")
        url += "&CQL_FILTER=" + CQL_FILTER;

    return url;
}



function gettilelayer(TileSources) {
    var wmsOptions = {
        alt: "",
        getTileUrl: function (tile, zoom) { return gettileUrl(tile, zoom, TileSources) },
        isPng: false,
        maxZoom: 17,
        minZoom: 1,
        name: "",
        tileSize: new google.maps.Size(256, 256)
    };

    //Creating the object to create the ImageMapType that will call the WMS Layer Options.
    var openlayersWMS = new google.maps.ImageMapType(wmsOptions);
    //mapA.mapTypes.set('Basins', openlayersWMS);
    return openlayersWMS;
}

function gettileUrl(tile, zoom, url) {
    var x = tile.x;
    var y = tile.y;
    var z = zoom;
    if (x >= 0 && y >= 0 && z >= 0) {
        var s = "";
        if (url.indexOf("{0}") > -1 && url.indexOf("{1}") > -1 && url.indexOf("{2}") > -1) {
            url = url.replace("{0}", x).replace("{1}", y).replace("{2}", z);
        }
        else if (url.indexOf("{0}") > -1)
            url = quad(x, y, z, url);
        return url;
    }
    else
        return "";
}

function getS(x, y, z) {
    var val = (x + y + z) % 4;
    if (val == 0)
        return "a";
    else if (val == 1)
        return "b";
    else if (val == 2)
        return "c";
    else if (val == 3)
        return "d";
    else
        return "";
}

function quad(column, row, zoom, base) {
    var key = "";
    for (var i = 1; i <= zoom; i++) {
        key += (((row >> zoom - i) & 1) << 1) | ((column >> zoom - i) & 1);
    }
    return base.replace("{0}", key);
}

function tms(column, row, zoom, base) {
    var x = column % (1 << zoom);
    if (x < 0) { x = x + (1 << zoom) }
    var y = (1 << zoom) - row - 1;
    return base + zoom + "/" + x + "/" + y + ".jpg";
}

function getBaseMap(BaseMapId, EN) {
    if (EN == true)
    {
        var data = null;
        $.ajax({
            type: "get",
            cache: true,
            url: "../Envision/getBaseMap",
            data: { "BaseMapId": BaseMapId },
            async: false
        }).success(function (result) {
            data = JSON.parse(result);
        });
        return data;
    }
    else {
        var data = null;
        $.ajax({
            type: "get",
            cache: true,
            url: "../Map/getBaseMap",
            data: { "BaseMapId": BaseMapId },
            async: false
        }).success(function (result) {
            data = JSON.parse(result);
        });
        return data;
    }
}

function setInfoLayer(mapA, location, x, y, height, width) {
    showLoading();
    var infoData = [];
    //console.log("Set Info Layer Called");
    var infodata = getInfoBoxData(mapA, infoData, 0, location, x, y, height, width);
    return infodata;
}

function getInfoBoxData(mapA, infoData, index, location, x, y, height, width) {
    if (smartSearchLayers != undefined && smartSearchLayers.length > 0 && index < smartSearchLayers.length) {
        var bbox = getBbox(mapA, location.latLng, x, y, cor.latitude, cor.longitude);
        var layerType = smartSearchLayers[index]["layerType"];
        var CQL_FILTER = [];
        var filterData = [];
        filterData.push(smartSearchLayers[index]["smartSearchText"]);
        if (smartSearchLayers[index]["SearchType"] == "All") {
            var filterArr = [];
            filterArr.push(smartSearchLayers[index]["smartSearchText"]);
            CQL_FILTER.push({ "attribute": "OWNER", "values": filterArr });
            CQL_FILTER.push({ "attribute": "OPERATOR", "values": filterArr });
            if (smartSearchLayers[index]["layerType"] == "pipeline")
                CQL_FILTER.push({ "attribute": "SYSTEM", "values": filterArr });
            else
                CQL_FILTER.push({ "attribute": "FACNAME", "values": filterArr });
            //CQL_FILTER.push({ "attribute": smartSearchLayers[index]["layerType"], "values": smartSearchLayers[index]["smartSearchText"] });
        }
        else
            CQL_FILTER.push({ "attribute": smartSearchLayers[index]["SearchType"], "values": filterData });
        $.ajax({
            type: "POST",
            cache: true,
            url: "../Map/getInfoBoxDataSmartSearch",
            data: { 'layer': smartSearchLayers[index]["smartSearchOfType"], 'maxFeatures=': 5, 'bbox': bbox, 'CQL_FILTER': JSON.stringify(CQL_FILTER) },
            async: false
        }).success(function (result) {
            var features = JSON.parse(result);
            if (features.length > 0) {
                for (var x in features) {
                    var data = features[x];
                    if (data != undefined) {
                        if (data.FACTYPE == "Refinery") {
                            data.CAPACITY = data.CAPACITY + " " + "(b/cd)";
                        }
                        var wmsGraphic = "";
                        var style = "";
                        if (layerType == "pipeline") {
                            wmsGraphic = "line";
                            style = "background-color: #FF0000";
                        }
                        if (layerType == "facility") {
                            wmsGraphic = "circle";
                            style = "background-color: #FFFF00; border-color: #000000";
                        }
                        if (layerType == "powerplant") {
                            wmsGraphic = "square";
                            style = "background-color: #57a0ce; border-color: #000000";
                        }
                        var info = { "layer": layer, "data": data, "layerType": layerType, 'maxFeatures=': 5, "filter": filter, "wmsGraphic": wmsGraphic, "style": style };
                        infoData.push(info);
                    }
                }
            }
            ///alert("call info box data again");                   
            getInfoBoxData(mapA, infoData, index + 1, location, bbox, x, y, height, width);
        });
    }
    else if (index < energyLayer.length) {
        var bbox = getBbox(mapA, location.latLng, x, y, cor.latitude, cor.longitude);
        if (energyLayer[index]["isInfoBox"]) {
            var layer = energyLayer[index]["layer"];
            var filter = energyLayer[index]["filter"];
            var CQL_FILTER = [];
            for (var x in filter) {
                CQL_FILTER.push({ "attribute": filter[x]["attribute"], "values": filter[x]["values"], "wmsGraphics": filter[x]["wmsGraphics"] })
            }
            var layerType = energyLayer[index]["layerType"];
            $.ajax({
                type: "POST",
                cache: true,
                url: "../Map/getInfoBoxData",
                data: { 'layer': layer, 'bbox': bbox, 'CQL_FILTER': JSON.stringify(CQL_FILTER), 'lat': cor.latitude, 'lang': cor.longitude },
                async: false
            }).success(function (result) {
                //alert("results");
                var data = decryptAjaxResult(result);
                var features = JSON.parse(data);
                if (features.length > 0) {
                    for (var x in features) {
                        //var data = features[x]["properties"];
                        //data = data[layer];
                        var data = features[x];
                        if (data != undefined) {
                            if (data.FACTYPE == "Refinery") {
                                //data.CAPACITY = data.CAPACITY + " " + "(b/cd)";
                                data.CAPACITY = data.CAPACITY + " " + "(b/d)";
                            }
                            var info = { "layer": layer, "data": data, "layerType": layerType, "filter": filter };
                            infoData.push(info);
                        }
                    }
                }

                getInfoBoxData(mapA, infoData, index + 1, location, bbox, x, y, height, width);
            });
        }
        else {
            //   alert("getInfoBoxData 2");                    
            getInfoBoxData(mapA, infoData, index + 1, location, bbox, x, y, height, width);
        }
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
        else if (layerType == "Europe") {
            Table.push(makePowerregionTableHTML(isWizard, data, style, wmsGraphics, "Europe"));
        }
        else if (layerType == "powerISO") {
            Table.push(makeNERCregionTableHTML(isWizard, data, style, wmsGraphics, "ISO"));
        }
        if (x > 0 && Table[x] != undefined)
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

function makePipelineTableHTML(isWizard, myArray, style, wmsGraphics) {

    var $infoDiv = $("<div>");
    $infoDiv.addClass('infoDiv');

    var layerType = "";
    layerType = myArray["COMMODITY"];
    if (layerType == "Miscellaneous")
        layerType = myArray["COMMODITY2"];

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

    if (isWizard == true && energyLayerIndex.length > 0) {
        for (x in energyLayerIndex) {
            var wmsGraphics = energyLayerIndex[x]["wmsgraphic"];
            var style = energyLayerIndex[x]["style"];
            var newColor = energyLayerIndex[x]["newcolor"];
            var layerName = energyLayerIndex[x]["layerName"];
            var layer = energyLayerIndex[x]["layer"];
            if (layerName == layerType && layer == "xpipelines_basic") {
                if (wmsGraphics == "triangle") {
                    $indicator.addClass("svgIndicator");
                    var html = getSvgTriangle(style);
                    $indicator.html(html);
                }
                else {
                    if (wmsGraphics != "")
                        $indicator.addClass(wmsGraphics);
                    if (energyLayerIndex[x]["newcolor"] != "") {
                        $indicator.attr("style", "background-color:" + newColor);
                        $indicator.css("border-color", "#000000");
                    }
                    else
                        $indicator.attr("style", style);
                }
            }
        }
    }
    else {
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

    var layerType = myArray["FACTYPE"];
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

    if (isWizard == true && energyLayerIndex.length > 0) {
        for (x in energyLayerIndex) {
            var wmsGraphics = energyLayerIndex[x]["wmsgraphic"];
            var style = energyLayerIndex[x]["style"];
            var newColor = energyLayerIndex[x]["newcolor"];
            var layerName = energyLayerIndex[x]["layerName"];
            var layer = energyLayerIndex[x]["layer"];
            if (layerName == layerType && layer == "xfacilities_basic") {
                if (wmsGraphics == "triangle") {
                    $indicator.addClass("svgIndicator");
                    var html = getSvgTriangle(style);
                    $indicator.html(html);
                }
                else {
                    if (wmsGraphics != "")
                        $indicator.addClass(wmsGraphics);
                    if (energyLayerIndex[x]["newcolor"] != "") {
                        $indicator.attr("style", "background-color:" + newColor);
                        $indicator.css("border-color", "#000000");
                    }
                    else
                        $indicator.attr("style", style);
                }
            }
        }
    }
    else {
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

    var layerType = myArray["COMMODITY"];
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

    if (isWizard == true && energyLayerIndex.length > 0) {
        for (x in energyLayerIndex) {
            var wmsGraphics = energyLayerIndex[x]["wmsgraphic"];
            var style = energyLayerIndex[x]["style"];
            var newColor = energyLayerIndex[x]["newcolor"];
            var layerName = energyLayerIndex[x]["layerName"];
            var layer = energyLayerIndex[x]["layer"];
            if (layerName == layerType && layer == "xinterconnects") {
                if (wmsGraphics == "triangle") {
                    $indicator.addClass("svgIndicator");
                    var html = getSvgTriangle(style);
                    $indicator.html(html);
                }
                else {
                    if (wmsGraphics != "")
                        $indicator.addClass(wmsGraphics);
                    if (energyLayerIndex[x]["newcolor"] != "") {
                        $indicator.attr("style", "background-color:" + newColor);
                        $indicator.css("border-color", "#000000");
                    }
                    else
                        $indicator.attr("style", style);
                }
            }
        }
    }
    else {
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

    var layerType = myArray["VOLT_CAT"];
    if (layerType == "DC")
        layerType == "Direct Current (DC) Lines";

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

    if (isWizard == true && energyLayerIndex.length > 0) {
        for (x in energyLayerIndex) {
            var wmsGraphics = energyLayerIndex[x]["wmsgraphic"];
            var style = energyLayerIndex[x]["style"];
            var newColor = energyLayerIndex[x]["newcolor"];
            var layerName = energyLayerIndex[x]["layerName"];
            var layer = energyLayerIndex[x]["layer"];
            if (layerName == layerType && layer == "xpowerlines") {
                if (wmsGraphics == "triangle") {
                    $indicator.addClass("svgIndicator");
                    var html = getSvgTriangle(style);
                    $indicator.html(html);
                }
                else {
                    if (wmsGraphics != "")
                        $indicator.addClass(wmsGraphics);
                    if (energyLayerIndex[x]["newcolor"] != "") {
                        $indicator.attr("style", "background-color:" + newColor);
                        $indicator.css("border-color", "#000000");
                    }
                    else
                        $indicator.attr("style", style);
                }
            }
        }
    }
    else {
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

    var layerType = myArray["PRIMEFUEL"];
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

    if (isWizard == true && energyLayerIndex.length > 0) {
        for (x in energyLayerIndex) {
            var wmsGraphics = energyLayerIndex[x]["wmsgraphic"];
            var style = energyLayerIndex[x]["style"];
            var newColor = energyLayerIndex[x]["newcolor"];
            var layerName = energyLayerIndex[x]["layerName"];
            var layer = energyLayerIndex[x]["layer"];
            if (layerName == layerType && layer == "xpowerplants") {
                if (wmsGraphics == "triangle") {
                    $indicator.addClass("svgIndicator");
                    var html = getSvgTriangle(style);
                    $indicator.html(html);
                }
                else {
                    if (wmsGraphics != "")
                        $indicator.addClass(wmsGraphics);
                    if (energyLayerIndex[x]["newcolor"] != "") {
                        $indicator.attr("style", "background-color:" + newColor);
                        $indicator.css("border-color", "#000000");
                    }
                    else
                        $indicator.attr("style", style);
                }
            }
        }
    }
    else {
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

    if (isWizard == true && energyLayerIndex.length > 0) {
        for (x in energyLayerIndex) {
            var wmsGraphics = energyLayerIndex[x]["wmsgraphic"];
            var style = energyLayerIndex[x]["style"];
            var newColor = energyLayerIndex[x]["newcolor"];
            var layerName = energyLayerIndex[x]["layerName"];
            var layer = energyLayerIndex[x]["layer"];
            if ((layerName == "Substation" && layer == "xproposedsubstations") || (layerName == "Proposed" && layer == "xproposedpowerlines")) {
                if (wmsGraphics == "triangle") {
                    $indicator.addClass("svgIndicator");
                    var html = getSvgTriangle(style);
                    $indicator.html(html);
                }
                else {
                    if (wmsGraphics != "")
                        $indicator.addClass(wmsGraphics);
                    if (energyLayerIndex[x]["newcolor"] != "") {
                        $indicator.attr("style", "background-color:" + newColor);
                        $indicator.css("border-color", "#000000");
                    }
                    else
                        $indicator.attr("style", style);
                }
            }
        }
    }
    else {
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

    if (isWizard == true && energyLayerIndex.length > 0) {
        for (x in energyLayerIndex) {
            var wmsGraphics = energyLayerIndex[x]["wmsgraphic"];
            var style = energyLayerIndex[x]["style"];
            var newColor = energyLayerIndex[x]["newcolor"];
            var layerName = energyLayerIndex[x]["layerName"];
            var layer = energyLayerIndex[x]["layer"];
            if (layerName == "Substation" && layer == "xsubstations") {
                if (wmsGraphics == "triangle") {
                    $indicator.addClass("svgIndicator");
                    var html = getSvgTriangle(style);
                    $indicator.html(html);
                }
                else {
                    if (wmsGraphics != "")
                        $indicator.addClass(wmsGraphics);
                    if (energyLayerIndex[x]["newcolor"] != "") {
                        $indicator.attr("style", "background-color:" + newColor);
                        $indicator.css("border-color", "#000000");
                    }
                    else
                        $indicator.attr("style", style);
                }
            }
        }
    }
    else {
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

function makePowerregionTableHTML(isWizard, myArray, style, wmsGraphics, flag) {

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

    infoArray.name = myArray["NAME"];
    $infoTable.append(getInfoRow(infoArray, 2));


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

function getInfoCol(x, val) {
    var $infoCol = $("<div>");
    $infoCol.addClass('infocol');

    if (val == "" || val == undefined || parseFloat(val) == 0)
        val = "N/A";
    else if (!isNaN(val))
        val = format(val, 2);
    if (x == "owner" || x == "operator" || x == "intername1" || x == "intername2") {
        // var val = "<a class='val' href='../CompanyProfile/CompanyProfile?cname=" + val + "'>" + val + "</a>";
        var val = '<a class="val" href="javascript:void(0)" onclick="getCompanyIDByName(\'' + val + '\')">' + val + '</a>';
        $infoCol.html(toProperCase(x.replace("_", " ")) + ": " + val);
    }
    else {
        var val = "<p class='val'>" + val + "</p>";
        $infoCol.html(toProperCase(x.replace("_", " ")) + ": " + val);
    }

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

function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
}
function format(n, decimal) {
    if (!isNaN(decimal))
        return parseFloat(n).toFixed(decimal).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    else
        return n;
}

/**/

function long2tile(lon, zoom) {
    return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}
function lat2tile(lat, zoom) {
    return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
}

function tile2long(x, z) {
    return (x / Math.pow(2, z) * 360 - 180);
}
function tile2lat(y, z) {
    var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
    return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
}

function LonLat_to_bbox(x, y, zoom) {

    var north = tile2lat(y, zoom);
    var south = tile2lat(y + 1, zoom);
    var west = tile2long(x, zoom);
    var east = tile2long(x + 1, zoom);
    var Bbox = west + "," + south + "," + east + "," + north;
    return Bbox;
}

function getBbox(mapA, center, x, y, latitude, longitude) {

    var zoom = mapA.getZoom();

    //if (zoom < 8)
    //    zoom = 8;
    //else
    //    zoom = zoom;

    //var Bb = LonLat_to_bbox(x, y, zoom);
    //console.log('Bb : '+Bb);

    //var scale = Math.pow(2, zoom);
    //var proj = mapA.getProjection();
    //var wc = proj.fromLatLngToPoint(center);
    //var bounds = new google.maps.LatLngBounds();
    //var sw = new google.maps.Point(wc.x - (3 / scale), wc.y - (3 / scale));
    //var swPro = proj.fromPointToLatLng(sw);
    //bounds.extend(swPro);
    //var ne = new google.maps.Point(wc.x + (3 / scale), wc.y + (3 / scale));
    //var nePro = proj.fromPointToLatLng(ne);
    //bounds.extend(nePro);

    //var Bbox = [];
    //Bbox.push(proj.fromPointToLatLng(new google.maps.Point(wc.x - (0.000001 / scale), wc.y)).lng());
    //Bbox.push(proj.fromPointToLatLng(new google.maps.Point(wc.x, wc.y + (0.000001 / scale))).lat());
    //Bbox.push(proj.fromPointToLatLng(new google.maps.Point(wc.x + (0.000001 / scale), wc.y)).lng());
    //Bbox.push(proj.fromPointToLatLng(new google.maps.Point(wc.x, wc.y - (0.000001 / scale))).lat);
    // var Bbox = swPro.lng() + "," + nePro.lat() + "," + nePro.lng() + "," + swPro.lat();

    // var Bbox = bounds.getSouthWest().lng() + "," + bounds.getSouthWest().lat() + "," + bounds.getNorthEast().lng() + "," + bounds.getNorthEast().lat();

    //return Bbox.join(",");
    var p = Math.pow(2, (21 - mapA.getZoom()));
    var radiusTemp = p * 600.497220 * 0.0040;
    // console.log(radiusTemp);

    //test new way to get bounding box
    // Calculate bounding box based on the given address
    var pi = 3.1416;
    var newbounds = new google.maps.LatLngBounds();
    //var R = 6371009; // earth radius in km    
    var R = 63710009; // earth radius in km    
    var radius = radiusTemp; // km
    //console.log(radius);

    //var x1 = lon - Math.toDegrees(radius/R/Math.cos(Math.toRadians(lat)));
    //var x2 = lon + Math.toDegrees(radius/R/Math.cos(Math.toRadians(lat)));
    //var y1 = lat + Math.toDegrees(radius/R);
    //var y2 = lat - Math.toDegrees(radius/R);
    var x1 = longitude - (180 / pi) * (radius / R / Math.cos((pi / 180) * latitude));
    var x2 = longitude + (180 / pi) * (radius / R / Math.cos((pi / 180) * latitude));
    var y1 = latitude + (180 / pi) * (radius / R);
    var y2 = latitude - (180 / pi) * (radius / R);
    var Bbox2 = x1 + "," + y2 + "," + x2 + "," + y1;

    var strictBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(y2, x1),
          new google.maps.LatLng(y1, x2)
        );
    //console.log("bound box");
    //console.log(bounds);
    //console.log(strictBounds);
    //bounds.extend(google.maps.Point(x1, y1));
    //bounds.extend(google.maps.Point(x2, y2));
    var opts1 = {
        bounds: strictBounds,
        map: mapA,
        editable: false
    }
    //var rect1 = new google.maps.Rectangle(opts1);
    return Bbox2;
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

function getCompanyIDByName(cName) {
    $.ajax({
        type: "GET",
        cache: true,
        url: "/CompanyProfile/GetCompanyProfileData",
        data: { cName: cName },
        async: false,
        success: function (data) {//
            $(".modal").height(575);
            $("#modal-body").html(data);
            $("#modal-CompanyProfile").modal('show');
            getCompanyProfileByID(cName)
            // var cID = $("#hdnCID").val();
            // SearchCompany(cID);
        }
    });
}
function getCompanyProfileByID(cName) {
    $("#mainLoader").show();
    $.ajax({
        type: "GET",
        cache: true,
        url: "/CompanyProfile/GetCompanyProfileIDByname",
        data: { cName: cName },
        success: function (data) {//
            SearchCompanyPopUp(data);
        }
    });
}