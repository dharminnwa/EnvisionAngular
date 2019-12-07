import { Component } from '@angular/core';
import { FileuploadService } from '../../services/fileupload.service';
import { AuthenticationService } from '../../services/auth.service';
import { HttpRequestService } from '../../services/all-http-request.service';
import { UtilityService } from '../../services/Utility.service';

@Component({
    selector: 'shapefile-tab',
    templateUrl: './shapefile.component.html',
    styleUrls: ['./shapefile.component.scss'],
    providers: [FileuploadService]
})
export class ShapefileComponent {
    public uploadedFiles: any[] = [];
    public loginUserData: any;
    constructor(
        private fileService: FileuploadService,
        public AuthServices: AuthenticationService,
        private httpRequest: HttpRequestService,
        private utilityService: UtilityService
    ) {
        this.loginUserData = this.AuthServices.GetUserData();
    };

    onUpload(event) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.uploadFileToActivity();
    }

    uploadFileToActivity() {
        this.httpRequest.PostFile(this.uploadedFiles, this.loginUserData, "ShapeFiles").subscribe(data => {
            this.uploadedFiles = [];
            var resultData = data.json();
            if (resultData["_Issuccess"]) {
                this.fileService.LoadLayersOfUploadedFiles(resultData);
                this.utilityService.ShowSuccessMsg('Shapefiles Uploaded Successfully.');
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
