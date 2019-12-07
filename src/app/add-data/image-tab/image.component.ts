import { Component } from '@angular/core';

@Component({
    selector: 'image-tab',
    templateUrl: './image.component.html',
    styleUrls: ['./image.component.scss']
})
export class ImageComponent {
    public uploadedFiles: any[] = [];
    
    constructor() { };

    onUpload(event) {
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
    }
}