import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ToolsService } from '../../../../services/tools.service';
import { environment } from '../../../../../environments/environment';
declare var $: any;
declare var html2canvas: any;
import * as jspdf from 'jspdf';
import { UtilityService } from '../../../../services/Utility.service';
@Component({
  selector: 'app-save-image',
  templateUrl: './save-image.component.html',
  styleUrls: ['./save-image.component.scss']
})
export class SaveImageComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef, public ToolsService: ToolsService, private UtilityService: UtilityService
  ) { }
  public ImageOptions = [
    { value: 'png', label: 'PNG (*.png)' },
    { value: 'jpg', label: 'JPG (*.jpg)' },
    { value: 'bmp', label: 'BMP (*.bmp' },
    { value: 'pdf', label: 'PDF (*.pdf)' }
  ];
  public selectedImageOption = this.ImageOptions[0];
  ImageSRc = "";
  PipelineLoader = true;
  SaveFileName: string = "";
  ImageURLPath: string = environment.ImagespreviewPath;
  ngOnInit() {
    this.UtilityService.CloseModalOnRouteChange(this.bsModalRef);
    // var testScript = document.createElement("script");
    // testScript.setAttribute("id", "html1canvas");
    // testScript.setAttribute("src", "assets/html2canvas/html2canvas.js");
    // document.body.appendChild(testScript);
    setTimeout(() => {
      this.getImage();
      this.Draggable();
      $("#txtFilename").keypress((e) => {

        if (this.SaveFileName) {
          $("#_btnSaveFile").prop('disabled', false);
        }
        else {
          $("#_btnSaveFile").prop('disabled', true);
        }
      })
    }, 1000);

  }
  Draggable() {
    setTimeout(() => {
      $('.modal-dialog').draggable({
        handle: ".modal-header"
      });
    }, 10);
  }
  getImage() {
    //let data123 = document.getElementsByClassName('agm-map-container-inner')   
    // let width = $('#_googlemapagm').width();
    // let height = (parseInt($('#_googlemapagm').height()));
    // let data = $('.agm-map-container-inner');
    // height = (document.body.clientHeight - (window.screen.height - document.body.clientHeight));
    // width = (document.body.clientWidth - (window.screen.width - document.body.clientWidth));
    //let outerHTMLdata = '<div _ngcontent-c12="" class="agm-map-container-inner sebm-google-map-container-inner" style="position: relative; overflow: hidden;width: ' + width + 'px;height: ' + height + 'px;">' + data[0].innerHTML + '</div>';
    try {
      let LegendModalhtml = document.getElementById('LegendModal');
      let Legendhtml = "";
      if (LegendModalhtml) {
        Legendhtml = LegendModalhtml.outerHTML
        document.getElementById("LegendModal").outerHTML = "";
        $('#_googlemapmapcontainer').append(Legendhtml);
      }
      html2canvas($('#_googlemapmapcontainer'), {
        onrendered: (canvas) => {
          var imageData = canvas.toDataURL();
          if (imageData) {
            this.ImageSRc = canvas.toDataURL();
            let image = document.getElementById('imgPreview');
            image.setAttribute('src', canvas.toDataURL());
            $("#imgPreview").css("display", "block");
            $("#LayerLibraryLoader").css("display", "none");
            this.PipelineLoader = false;
          } else {
            this.ImageSRc = this.ImageURLPath + "publicMaps.png";
          }
          $("#LayerLibraryLoader").css("display", "none");
          this.PipelineLoader = false;
        },
        allowTaint: false,
        logging: true,
        useCORS: true
      });

    } catch (e) {
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
  }
  SaveFile() {

    if (this.SaveFileName) {
      // let ImageExtention = $('#dropdownImageformatselect option:selected').val();
      let ImageExtention = this.selectedImageOption.value;
      if (ImageExtention != "pdf") {
        const blobData = this.convertBase64ToBlobData(this.ImageSRc.replace('data:image/png;base64,', ''), "." + ImageExtention);
        if (window.navigator && window.navigator.msSaveOrOpenBlob) { //IE
          window.navigator.msSaveOrOpenBlob(blobData, this.SaveFileName);
        } else { // chrome
          const blob = new Blob([blobData], { type: "." + ImageExtention });
          const url = window.URL.createObjectURL(blob);
          // window.open(url);
          const link = document.createElement('a');
          link.href = url;
          link.download = this.SaveFileName + "." + ImageExtention;
          link.click();
        }
      }
      else {
        var imgWidth = 208;
        let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
        var position = 55;
        pdf.addImage(this.ImageSRc, 'PNG', 0, position, imgWidth, 100);
        pdf.save(this.SaveFileName + "." + ImageExtention); // Generated PDF   
      }

    }
    else {
      alert("File Name can't be blank.");
    }

  }

  convertBase64ToBlobData(base64Data: string, contentType: string = 'image/png', sliceSize = 512) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
  closeModel() {

    this.bsModalRef.hide();
    let LegendModalhtml = document.getElementById('LegendModal');
    if (LegendModalhtml) {
      let _ShowLegends = document.getElementById('_ShowLegends');
      _ShowLegends.click();
      _ShowLegends.click();
    }

  }
}
