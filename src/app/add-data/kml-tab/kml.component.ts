import { Component } from '@angular/core';
import { PrivateMapLayerService } from '../../services/private-maplayer-service';
import { FileuploadService } from '../../services/fileupload.service';
import { AuthenticationService } from '../../services/auth.service';
import { HttpRequestService } from '../../services/all-http-request.service';
import { UtilityService } from '../../services/Utility.service';

@Component({
    selector: 'kml-tab',
    templateUrl: './kml.component.html',
    styleUrls: ['./kml.component.scss'],
    providers: [FileuploadService]
})
export class KmlComponent {
    public uploadedFiles: any[] = [];
    public loginUserData: any;
    kmlLayers = [];

    constructor(public PrivateMapLayerService: PrivateMapLayerService,
        private fileService: FileuploadService,
        public AuthServices: AuthenticationService,
        private httpService: HttpRequestService,
        private utilityService: UtilityService) {
        this.loginUserData = this.AuthServices.GetUserData();
    };


    onUpload(event) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.uploadFileToActivity();
    }

    uploadFileToActivity() {
        this.httpService.PostFile(this.uploadedFiles, this.loginUserData, "Kmls").subscribe(data => {
            this.uploadedFiles = [];
            var resultData = data.json();
            if (resultData["_Issuccess"]) {
                this.fileService.LoadKmlLayerOfUploadedFiles(resultData);
                this.utilityService.ShowSuccessMsg('KML/KMZ Uploaded Successfully.');
            }
            else {
                this.uploadedFiles = [];
                if (resultData.errorMsg) {
                    console.log(resultData["errorMsg"]);
                    this.utilityService.ShowErrorMsg(resultData.errorMsg);
                }
            }
        }, error => {
            this.uploadedFiles = [];
            console.log(error);
            this.utilityService.ShowErrorMsg(error);
        });
    }
}