// var AmazonAPiURL = 'https://avp8hf6otb.execute-api.us-east-1.amazonaws.com/Prod';
var AmazonAPiURL = 'https://nqzkggqnbb.execute-api.us-east-1.amazonaws.com/Prod';
var geocoder;
var map_center;
var mapType;
var map;
(function ($) {
    AmazonAPiURL = "https://node.envisionmaps.net";

})(jQuery);
$(document).ready(function () {

    // GoogleMapInit();
    var qs = getQueryStrings();
    var id = 0;
    if (qs) {
        id = qs["t"];
    }
    if (id) {
        GetData(id)
    }
    else {
        GetData(0)
        hidePageLoadingTest();
    }
});
function GoogleMapInit() {

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
//function LoadImage(TransPrjID) {
//    try {
//        var apiurl = AmazonAPiURL + "/api/CompanyProfile/GetTransImageName?ID=" + TransPrjID;
//        var xmlHttp = new XMLHttpRequest();
//        xmlHttp.onreadystatechange = function () {
//            if (this.readyState == 4 && this.status == 200) {
//                var response = JSON.parse(this.responseText)
//                if (response.error == "") {
//                    if (response.displayImage == "true") {
//                        var ImageLoaded = $('#LoadImag').html();
//                        if (ImageLoaded.trim() == "") {
//                            var ImageLink = "http://api_prod.mapsearch360.com/TransProjectImageList/" + response.getImage;
//                            $('<img src="' + ImageLink + '">').load(function () {
//                                $('#LoadImag').html("");
//                                $(this).width("90%").height("400px").appendTo('#LoadImag');
//                            });
//                            //document.getElementById('ImagID').setAttribute('src', ImageLink);
//                        }
//                        $("#LoadImag").css("display", "block");
//                    } else {
//                        $("#LoadImag").html("");
//                        //document.getElementById('ImagID').setAttribute('src', '');
//                        $("#LoadImag").css("display", "none");
//                    }
//                }
//                else {
//                    $("#LoadImag").html("");
//                    //document.getElementById('ImagID').setAttribute('src', '');
//                    $("#LoadImag").css("display", "none");
//                }
//            }
//            else {
//                setTimeout(function () { ImageLoad(TransPrjID) }, 3000);
//                //console.log(this.responseText);
//            }
//        };
//        xmlHttp.open("GET", apiurl, true);
//        xmlHttp.send();
//    } catch (e) {
//        console.log(e);
//    }

//}
function ImageLoad(TransPrjID) {
    $.ajax({
        url: AmazonAPiURL + '/api/CompanyProfile/GetTransImageName',
        type: 'GET',
        data: { ID: parseInt(TransPrjID) },
        async: false,
        success: function (response) {
            if (response.error == "") {
                if (response.displayImage == "true") {
                    var ImageLink = "http://api_prod.mapsearch360.com/TransProjectImageList/" + response.getImage;
                    $('#LoadImag').html("");
                    $('<img src="' + ImageLink + '" draggable="false">').load(function () {
                        $("#LoadImag").css("display", "block");
                        $(this).width("90%").height("400px").appendTo('#LoadImag');
                    });
                    $("#LoadImag").css("display", "none");
                } else {
                    $("#LoadImag").html("");
                    $("#LoadImag").css("display", "none");
                }
            }
            else {

                $("#LoadImag").html("");
                $("#LoadImag").css("display", "none");


            }
            //var data = JSON.parse(response.getBase64ImageResult);
            //if (data.DisplyImage == true) {
            //    var Base64img = "data:image/png;base64," + data.Image;
            //    document.getElementById('ImagID').setAttribute('src', Base64img);
            //    $("#LoadImag").css("display", "block");
            //}
            //else {
            //    $("#LoadImag").css("display", "none");
            //}
        },
        error: function (error) {
            console.log(error);

        }
    });
}

function GetData(TransPrjID) {
    showPageLoadingTest();
    $.ajax({
        url: AmazonAPiURL + '/api/TransmissionProject/GetProjectDataById',
        type: 'GET',
        data: { id: TransPrjID },
        // contentType: 'json',
        success: function (response) {            
            var data = response.TransmissionData;
            var Doc = response.document;
            var Image = response.Image;
            var ptsArray = [];
            if (Image) {
                //var ImageData = JSON.parse(Image);
                //var TransImagedata = JSON.parse(ImageData.getBase64ImageResult);
                var TransImagedata = JSON.parse(Image);
                if (TransImagedata.DisplyImage == true) {
                    if (response.GeometryList.length > 0) {
                        for (var j = 0; j < response.GeometryList.length; j++) {                            
                            var Geomery = response.GeometryList[j].geometry;
                            if (response.GeometryList[j].type != "MARKER") {
                                Geomery = response.GeometryList[j].geometry.replace('0', '/');
                            }
                            response.GeometryList[j].geometry = Geomery;
                            ptsArray.push(response.GeometryList[j]);
                        }
                        if (ptsArray.length > 0) {                            
                            if (ptsArray[0].Lng != "" && ptsArray[0].Lng != "") {
                                // map.setCenter(new google.maps.LatLng(parseFloat(ptsArray[0].Lat), parseFloat(ptsArray[0].Lng)));
                            }
                            if (ptsArray[0].zoomlevel != "") {
                                // map.setZoom(parseInt(ptsArray[0].Zoomlevel))
                            }
                            geocoder = new google.maps.Geocoder();
                            map_center = new google.maps.LatLng(parseFloat(ptsArray[0].Lat), parseFloat(ptsArray[0].Lng));
                            mapType = google.maps.MapTypeId.HYBRID;
                            var zoom = parseInt(ptsArray[0].ZoomLevel);
                            var mapOptions = {
                                zoom: zoom,
                                draggableCursor: 'default',
                                center: map_center,
                                mapTypeId: mapType,
                                streetViewControl: false,
                                gestureHandling: 'greedy',
                                clickableIcons: false,
                            };
                            map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
                            var outshape = IO.OUT(ptsArray, map);                            
                        }
                    }                   
                } 
            }
            if (data != null) {
                var html = '<div id="headerContent"><div class="row-fluid"><div class="span12"><div class="span9"><span class="NewsDetailContentHeader">';
                if (data.TransProjectName != null) { html += data.TransProjectName }
                html += '</span></div><div class="span3" id="DocumentDtl"></div></div></div><div class="row-fluid"><hr /></div></div>' +
                    '<div class="ProjectDataContent"><div class="row-fluid PrjDataContent"><div class="Project-Section"><br />';
                if (data.ProjectDescription != null) { html += data.ProjectDescription }
                html += '</div></div><br />' +
                    '<div class="row-fluid"><table class="table"><thead><tr><th class="PrjTH">Project Sponsor</th><th class="PrjTH">Line Miles</th><th class="PrjTH">Voltage (kV)</th><th class="PrjTH">From State</th><th class="PrjTH">To State</th><th class="PrjTH">Year in Service</th><th class="PrjTH">Estimated Costs ($M)</th><th class="PrjTH">Voltage Type</th><th class="PrjTH">Project Status</th></tr></thead>' +
                    '<tbody><tr><td class="PrjTD">';
                if (data.ProjectSponsor != null) { html += data.ProjectSponsor }
                html += '</td><td class="PrjTD">';
                if (data.LineMiles != null) { html += data.LineMiles }
                html += '</td><td class="PrjTD">';
                if (data.Voltage != null) { html += data.Voltage }
                html += '</td><td class="PrjTD">';
                if (data.From != null) { html += data.From }
                html += '</td><td class="PrjTD">';
                if (data.To != null) { html += data.To }
                html += '</td><td class="PrjTD">';
                if (data.ServiceYear != null) { html += data.ServiceYear } html += '</td>';
                if (data.EstimatedCosts != null) {
                    html += '<td class="PrjTD">' + parseFloat(data.EstimatedCosts).toFixed(1) + '</td>';
                }
                else {
                    html += '<td class="PrjTD"></td>';
                }
                html += '<td class="PrjTD">';
                if (data.VoltageType != null) { html += data.VoltageType }
                html += '</td><td class="PrjTD">'; if (data.ProjectStatus != null) { html += data.ProjectStatus }
                html += '</td></tr></tbody>' +
                    '<thead><tr><th class="PrjTH">Project Group</th><th class="PrjTH">Origin Point</th><th class="PrjTH">Destination Point</th><th class="PrjTH">Interstate</th><th class="PrjTH">Build Start</th><th class="PrjTH">NERC</th><th class="PrjTH">ISO/RTO</th><th class="PrjTH">Country</th><th class="PrjTH">Project Partners</th></tr></thead>' +
                    '<tbody><tr><td class="PrjTD">';
                if (data.ProjectGroup != null) { html += data.ProjectGroup }
                html += '</td><td class="PrjTD">';
                if (data.OriginPoint != null) { html += data.OriginPoint }
                html += '</td><td class="PrjTD">';
                if (data.DestinationPoint != null) { html += data.DestinationPoint }
                html += '</td><td class="PrjTD">';
                if (data.InterstateVal != null) { html += data.InterstateVal }
                html += '</td><td class="PrjTD">';
                if (data.BuildYear != null) { html += data.BuildYear }
                html += '</td><td class="PrjTD">';
                if (data.NERC != null) { html += data.NERC }
                html += '</td><td class="PrjTD">';
                if (data.ISO != null) { html += data.ISO }
                html += '</td>'
                if (data.Country != null) {
                    html += '<td class="PrjTD">' + data.Country + '</td>';
                }
                else {
                    html += '<td class="PrjTD"></td>';
                }
                html += '<td class="PrjTD">'; if (data.ProjectPartners != null) { html += data.ProjectPartners } html += '</td></tr></tbody>' +
                    '<thead><tr><th class="PrjTH">Contact</th><th class="PrjTH">Role</th><th class="PrjTH">Phone</th></tr></thead>';
                if (data.Contact == null && data.Title == null && data.Phone == null) {
                    html += '<tbody><tr style="height:40px;"><td class="PrjTD"></td><td class="PrjTD"></td><td class="PrjTD"></td></tr></tbody>';
                }
                else {
                    html += '<tbody><tr><td class="PrjTD">'; if (data.Contact != null) { html += data.Contact } html += '</td><td class="PrjTD">'; if (data.Title != null) { html += data.Title } html += '</td><td class="PrjTD">'; if (data.Phone != null) { html += data.Phone } html += '</td></tr></tbody>';
                }
                '</table></div><div class="row-fluid" id="TransProjectimage"></div></div>';

                //'</table></div>'

                //$("#modal-ProjectjData").css('height', '80%');
                //$("#modal-ProjectjData").on('show', function () {
                //    $(this).addClass("modalProjectData");

                //})
                //$("#modal-ProjectjData").on('shown.bs.modal', function () {
                //    resizePrjPopupHeightTest();
                //})
                //$("#modal-ProjectjData").on('hidden.bs.modal', function () {
                //    $(this).removeClass("modalProjectData");
                //})

                $("#transmissionsummary").html(html);
                var DocHTML = '';
                if (Doc) {
                    if (Doc.length > 0) {
                        var Path = Doc[0].c.filePath;//.replace(".pdf", "").replace(".png", "");
                        var Type = Doc[0].c.type + "_";
                        if (Path.indexOf(".pdf") > -1) {
                            Path = Path.replace(".pdf", "")
                        }
                        else {
                            Path = Path.replace(".pdf", "")
                        }
                        var URL = 'https://mapsearch.s3.amazonaws.com/' + Path;
                        DocHTML = '<span style="font-size: 15px;">Related Document</span><br/>' + '<span>' +
                            "<a class=ProjectLink id='hrefDoc'href='javascript:void(0)'  onclick='fNewPDFWindows(" + Path + ")'>" + data.TransProjectName + "</a></span>";

                    }
                }
                $("#DocumentDtl").html(DocHTML);
                $("#MainDiv").css({ 'border': '1px solid #CBCBCB', 'padding': '5px', 'margin-top': '2%', 'margin-left': '1%', 'margin-right': '1%', '-webkit-border-radius': '4px', '-moz-border-radius': '4px', 'border-radius': '4px' });
            }
            else {
                LoadEmptyTable();
            }
            //$("#modal-ProjectjData").modal('show');
            //setTimeout(function () { $("#modal-bodyProjects").scrollTop(0) }, 250);
            hidePageLoadingTest();
        },
        error: function (errorMsg) {
            LoadEmptyTable();
            hidePageLoadingTest();
        }
    });
}

function fNewPDFWindows(Path) {
    var URL = 'https://mapsearch.s3.amazonaws.com/' + Path + ".pdf";
    window.open(URL, '_blank', $("#hrefDoc").text(), 'location=yes,height=600,width=800,scrollbars=yes,status=yes');
}
function LoadEmptyTable() {
    try {

        var html = '<div id="headerContent"><div class="row-fluid"><span class="NewsDetailContentHeader">';
        html += '</span></div><div class="row-fluid"><hr /></div></div>' +
            '<div class="ProjectDataContent"><div class="row-fluid PrjDataContent"><div class="Project-Section"><br />';
        html += '</div></div><br />' +
            '<div class="row-fluid"><table class="table"><thead><tr><th class="PrjTH">Project Sponsor</th><th class="PrjTH">Line Miles</th><th class="PrjTH">Voltage (kV)</th><th class="PrjTH">From State</th><th class="PrjTH">To State</th><th class="PrjTH">Year in Service</th><th class="PrjTH">Estimated Costs ($M)</th><th class="PrjTH">Voltage Type</th><th class="PrjTH">Project Status</th></tr></thead>' +
            '<tbody><tr><td class="PrjTD">';
        html += '</td><td class="PrjTD">';
        html += '</td><td class="PrjTD">';
        html += '</td><td class="PrjTD">';
        html += '</td><td class="PrjTD">';
        html += '</td><td class="PrjTD">';
        html += '</td>';
        html += '<td class="PrjTD"></td>';

        html += '<td class="PrjTD">';
        html += '</td><td class="PrjTD">';
        html += '</td></tr></tbody>' +
            '<thead><tr><th class="PrjTH">Project Group</th><th class="PrjTH">Origin Point</th><th class="PrjTH">Destination Point</th><th class="PrjTH">Interstate</th><th class="PrjTH">Build Start</th><th class="PrjTH">NERC</th><th class="PrjTH">ISO/RTO</th><th class="PrjTH">Country</th><th class="PrjTH">Project Partners</th></tr></thead>' +
            '<tbody><tr><td class="PrjTD">';
        html += '</td><td class="PrjTD">';

        html += '</td><td class="PrjTD">';

        html += '</td><td class="PrjTD">';

        html += '</td><td class="PrjTD">';

        html += '</td><td class="PrjTD">';

        html += '</td><td class="PrjTD">';
        html += '</td>'
        html += '<td class="PrjTD"></td>';
        html += '<td class="PrjTD">';
        html += '</td></tr></tbody>' +
            '<thead><tr><th class="PrjTH">Contact</th><th class="PrjTH">Role</th><th class="PrjTH">Phone</th></tr></thead>';
        html += '<tbody><tr style="height:40px;"><td class="PrjTD"></td><td class="PrjTD"></td><td class="PrjTD"></td></tr></tbody>';
        html += '</table></div><div class="row-fluid"><img id="ProjectImage"/></div></div>';
        $("#transmissionsummary").html(html);
    } catch (e) {
        console.log(e);
    }
}

function showPageLoadingTest() { $("#mainProjDataloader").show(); }

function hidePageLoadingTest() { $("#mainProjDataloader").hide(); }


var IO = {
    //returns array with storable google.maps.Overlay-definitions
    IN: function (arr,//array with google.maps.Overlays
        encoded//boolean indicating whether pathes should be stored encoded
    ) {
        var shapes = [],
            goo = google.maps,
            shape, tmp;
        for (var i = 0; i < arr.length; i++) {
            shape = arr[i];
            tmp = { type: this.t_(shape.type), id: shape.id || null };

            if (tmp.type == undefined) {
                tmp.type = shape.type
            }
            switch (tmp.type) {
                case 'CIRCLE':
                    tmp.radius = shape.getRadius();
                    tmp.geometry = this.p_(shape.getCenter());
                    break;
                case 'MARKER':
                    tmp.geometry = this.p_(shape.getPosition());
                    tmp.strokeColor = shape.icon.strokeColor;
                    tmp.strokeWeight = shape.icon.scale;
                    break;
                case 'RECTANGLE':
                    tmp.geometry = this.b_(shape.getBounds());
                    break;
                case 'POLYLINE':
                    tmp.geometry = this.l_(shape.getPath(), encoded);
                    tmp.strokeColor = shape.strokeColor;
                    tmp.strokeWeight = shape.strokeWeight;
                    break;
                case 'POLYGON':
                    tmp.geometry = this.m_(shape.getPaths(), encoded);
                    tmp.strokeColor = shape.strokeColor;
                    tmp.strokeWeight = shape.strokeWeight;
                    tmp.fillColor = shape.fillColor;
                    break;
            }
            shapes.push(tmp);
        }

        return shapes;
    },
    //returns array with google.maps.Overlays
    OUT: function (arr,//array containg the stored shape-definitions
        map//map where to draw the shapes
    ) {

        var shapes = [],
            map = map || null,
            shape, tmp;
        var image = new google.maps.MarkerImage(
            "../../Images/Map/map-pointer.png",
            new google.maps.Size(15, 15),
            new google.maps.Point(0, 0),
            new google.maps.Point(15, 15),
            new google.maps.Size(15, 15)
        );

        for (var i = 0; i < arr.length; i++) {
            shape = arr[i];

            switch (shape.type) {
                case 'CIRCLE':
                    tmp = new google.maps.Circle({ radius: Number(shape.radius), center: this.pp_.apply(this, shape.geometry) });
                    break;
                case 'MARKER':

                    var markerpoint = shape.geometry.split(',');
                    var MARKER = [];
                    if (markerpoint.length > 0) {
                        MARKER.push(parseFloat(markerpoint[0]));
                        MARKER.push(parseFloat(markerpoint[1]));
                    }
                    tmp = new google.maps.Marker({
                        position: this.pp_.apply(this, MARKER),
                        editable: false,
                        draggable: false,
                        clickable: false,
                        type: 'MARKER',
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 4,
                            strokeColor: shape.strokeColor == "" ? "#0000FF" : shape.strokeColor,
                            strokeWeight: 9,
                        }

                    });
                    break;
                case 'RECTANGLE':
                    tmp = new google.maps.Rectangle({ bounds: this.bb_.apply(this, shape.geometry), editable: false, draggable: false, clickable: false, });
                    break;
                case 'POLYLINE':
                    tmp = new google.maps.Polyline({
                        path: this.ll_(shape.geometry), editable: true, draggable: false, clickable: false, strokeColor: shape.strokeColor, type: 'POLYLINE', strokeOpacity: 1.0, strokeWeight: shape.strokeWeight
                    });
                    break;
                case 'POLYGON':
                    var polygon = [];
                    polygon.push(shape.geometry);
                    tmp = new google.maps.Polygon({
                        paths: this.mm_(polygon), editable: true, draggable: false, clickable: false, type: 'POLYGON', fillColor: shape.fillColor, strokeOpacity: 1.0, strokeWeight: shape.strokeWeight
                    });

                    break;
            }
            //tmp.setValues({ map: map, id: shape.id, fillColor: '#0000FF', editable: true, draggable: true, clickable: true, })
            //addListenersOnPolygon(tmp);
            if (shape.type == "MARKER") {
                tmp.setValues({ map: map });
                //markers.push(tmp)
            }
            else {
                tmp.setEditable(false);
                tmp.setValues({ map: map });
                shapes.push(tmp);
            }
        }
        return shapes;
    },
    l_: function (path, e) {
        path = (path.getArray) ? path.getArray() : path;
        if (e) {
            return google.maps.geometry.encoding.encodePath(path);
        } else {
            var r = [];
            for (var i = 0; i < path.length; ++i) {
                r.push(this.p_(path[i]));
            }
            return r;
        }
    },
    ll_: function (path) {
        if (typeof path === 'string') {
            return google.maps.geometry.encoding.decodePath(path);
        }
        else {
            var r = [];
            for (var i = 0; i < path.length; ++i) {
                r.push(this.pp_.apply(this, path[i]));
            }
            return r;
        }
    },

    m_: function (paths, e) {
        var r = [];
        paths = (paths.getArray) ? paths.getArray() : paths;
        for (var i = 0; i < paths.length; ++i) {
            r.push(this.l_(paths[i], e));
        }
        return r;
    },
    mm_: function (paths) {
        var r = [];
        for (var i = 0; i < paths.length; ++i) {
            r.push(this.ll_.call(this, paths[i]));

        }
        return r;
    },
    p_: function (latLng) {
        return ([latLng.lat(), latLng.lng()]);
    },
    pp_: function (lat, lng) {
        return new google.maps.LatLng(lat, lng);
    },
    b_: function (bounds) {
        return ([this.p_(bounds.getSouthWest()),
        this.p_(bounds.getNorthEast())]);
    },
    bb_: function (sw, ne) {
        return new google.maps.LatLngBounds(this.pp_.apply(this, sw),
            this.pp_.apply(this, ne));
    },
    t_: function (s) {
        var t = ['CIRCLE', 'MARKER', 'RECTANGLE', 'POLYLINE', 'POLYGON'];
        for (var i = 0; i < t.length; ++i) {
            if (s === google.maps.drawing.OverlayType[t[i]]) {
                return t[i];
            }
        }
    }

}
