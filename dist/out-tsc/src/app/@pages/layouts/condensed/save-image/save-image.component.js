"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ngx_bootstrap_1 = require("ngx-bootstrap");
var tools_service_1 = require("../../../../services/tools.service");
var environment_1 = require("../../../../../environments/environment");
var jspdf = require("jspdf");
var Utility_service_1 = require("../../../../services/Utility.service");
var SaveImageComponent = (function () {
    function SaveImageComponent(bsModalRef, ToolsService, UtilityService) {
        this.bsModalRef = bsModalRef;
        this.ToolsService = ToolsService;
        this.UtilityService = UtilityService;
        this.ImageOptions = [
            { value: 'png', label: 'PNG (*.png)' },
            { value: 'jpg', label: 'JPG (*.jpg)' },
            { value: 'bmp', label: 'BMP (*.bmp' },
            { value: 'pdf', label: 'PDF (*.pdf)' }
        ];
        this.selectedImageOption = this.ImageOptions[0];
        this.ImageSRc = "";
        this.PipelineLoader = true;
        this.SaveFileName = "";
        this.ImageURLPath = environment_1.environment.ImagespreviewPath;
    }
    SaveImageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
        // var testScript = document.createElement("script");
        // testScript.setAttribute("id", "html1canvas");
        // testScript.setAttribute("src", "assets/html2canvas/html2canvas.js");
        // document.body.appendChild(testScript);
        setTimeout(function () {
            _this.getImage();
            _this.Draggable();
            $("#txtFilename").keypress(function (e) {
                if (_this.SaveFileName) {
                    $("#_btnSaveFile").prop('disabled', false);
                }
                else {
                    $("#_btnSaveFile").prop('disabled', true);
                }
            });
        }, 1000);
    };
    SaveImageComponent.prototype.Draggable = function () {
        setTimeout(function () {
            $('.modal-dialog').draggable({
                handle: ".modal-header"
            });
        }, 10);
    };
    SaveImageComponent.prototype.getImage = function () {
        var _this = this;
        //let data123 = document.getElementsByClassName('agm-map-container-inner')   
        // let width = $('#_googlemapagm').width();
        // let height = (parseInt($('#_googlemapagm').height()));
        // let data = $('.agm-map-container-inner');
        // height = (document.body.clientHeight - (window.screen.height - document.body.clientHeight));
        // width = (document.body.clientWidth - (window.screen.width - document.body.clientWidth));
        //let outerHTMLdata = '<div _ngcontent-c12="" class="agm-map-container-inner sebm-google-map-container-inner" style="position: relative; overflow: hidden;width: ' + width + 'px;height: ' + height + 'px;">' + data[0].innerHTML + '</div>';
        try {
            var LegendModalhtml = document.getElementById('LegendModal');
            var Legendhtml = "";
            if (LegendModalhtml) {
                Legendhtml = LegendModalhtml.outerHTML;
                document.getElementById("LegendModal").outerHTML = "";
                $('#_googlemapmapcontainer').append(Legendhtml);
            }
            html2canvas($('#_googlemapmapcontainer'), {
                onrendered: function (canvas) {
                    var imageData = canvas.toDataURL();
                    if (imageData) {
                        _this.ImageSRc = canvas.toDataURL();
                        var image = document.getElementById('imgPreview');
                        image.setAttribute('src', canvas.toDataURL());
                        $("#imgPreview").css("display", "block");
                        $("#LayerLibraryLoader").css("display", "none");
                        _this.PipelineLoader = false;
                    }
                    else {
                        _this.ImageSRc = _this.ImageURLPath + "publicMaps.png";
                    }
                    $("#LayerLibraryLoader").css("display", "none");
                    _this.PipelineLoader = false;
                },
                allowTaint: false,
                logging: true,
                useCORS: true
            });
        }
        catch (e) {
            this.ImageSRc = this.ImageURLPath + "publicMaps.png";
            this.PipelineLoader = false;
            $("#LayerLibraryLoader").css("display", "none");
            console.log(e);
        }
        // let outerHTMLdata = '<div _ngcontent-c12="" class="agm-map-container-inner sebm-google-map-container-inner" style="position: relative; overflow: hidden;>' + data[0].innerHTML + '</div>';
        // let data = $('#_googlemapmapcontainer')[0].innerHTML;
        // let outerHTMLdata = '<div  class="map-container full-width" style="height:500px !important">' + data + '</div>';
        // let data = document.getElementById('_googlemapagm');
        // let outerHTMLdata = data.outerHTML;
        // let tanl1 = $('.agm-map-container-inner')[0].outerHTML;
        // var html = $("#_googlemapmapcontainer")[0].innerHTML
        // let posa = html.indexOf("<agm-map", 0);
        // let posb = html.indexOf('class="sebm-google-map-container">', 0);
        // let a = html.substring(posa, posb);
        // let agmpmap = a + ' style="height:' + height + 'px;" class="sebm-google-map-container"> ' + outerHTMLdata + '</agm-map>';
        // this.ToolsService.GetMapImage(agmpmap, width, height).subscribe(data => {
        //   if (data) {
        //     let base64 = "data:image/png;base64," + data;
        //     this.ImageSRc = base64;
        //   } else {
        //     this.ImageSRc = this.ImageURLPath + "publicMaps.png";
        //   }
        //   this.PipelineLoader = false;
        // }, error => {
        //   this.ImageSRc = this.ImageURLPath + "publicMaps.png";
        //   this.PipelineLoader = false;
        //   console.log();
        // });
    };
    SaveImageComponent.prototype.SaveFile = function () {
        if (this.SaveFileName) {
            // let ImageExtention = $('#dropdownImageformatselect option:selected').val();
            var ImageExtention = this.selectedImageOption.value;
            if (ImageExtention != "pdf") {
                var blobData = this.convertBase64ToBlobData(this.ImageSRc.replace('data:image/png;base64,', ''), "." + ImageExtention);
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(blobData, this.SaveFileName);
                }
                else {
                    var blob = new Blob([blobData], { type: "." + ImageExtention });
                    var url = window.URL.createObjectURL(blob);
                    // window.open(url);
                    var link = document.createElement('a');
                    link.href = url;
                    link.download = this.SaveFileName + "." + ImageExtention;
                    link.click();
                }
            }
            else {
                var imgWidth = 208;
                var pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
                var position = 55;
                pdf.addImage(this.ImageSRc, 'PNG', 0, position, imgWidth, 100);
                pdf.save(this.SaveFileName + "." + ImageExtention); // Generated PDF   
            }
        }
        else {
            alert("File Name can't be blank.");
        }
    };
    SaveImageComponent.prototype.convertBase64ToBlobData = function (base64Data, contentType, sliceSize) {
        if (contentType === void 0) { contentType = 'image/png'; }
        if (sliceSize === void 0) { sliceSize = 512; }
        var byteCharacters = atob(base64Data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    };
    SaveImageComponent.prototype.closeModel = function () {
        this.bsModalRef.hide();
        var LegendModalhtml = document.getElementById('LegendModal');
        if (LegendModalhtml) {
            var _ShowLegends = document.getElementById('_ShowLegends');
            _ShowLegends.click();
            _ShowLegends.click();
        }
    };
    SaveImageComponent = __decorate([
        core_1.Component({
            selector: 'app-save-image',
            templateUrl: './save-image.component.html',
            styleUrls: ['./save-image.component.scss']
        }),
        __metadata("design:paramtypes", [ngx_bootstrap_1.BsModalRef, tools_service_1.ToolsService, Utility_service_1.UtilityService])
    ], SaveImageComponent);
    return SaveImageComponent;
}());
exports.SaveImageComponent = SaveImageComponent;
//# sourceMappingURL=save-image.component.js.map