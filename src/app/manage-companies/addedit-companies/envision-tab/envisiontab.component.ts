import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'envision-tab',
    templateUrl: './envisiontab.component.html',
    styleUrls: ['./envisiontab.component.scss']
})
export class EnvisionTabComponent {

    public HorizontalFName;
    public HorizontalUserLimit;

    constructor(public activeModal: NgbActiveModal) { };

}