import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilityService } from '../../services/Utility.service';


@Component({
    selector: 'tsp-modal',
    templateUrl: './tsp.component.html',
    styleUrls: ['./tsp.component.scss']
})
export class TspComponent {

    public isSourceListSelectAll: boolean = false;
    public isTargetListSelectAll: boolean = false;
    public sourceCars: Array<any> = [
        { id: "1", name: "A", isChecked: false },
        { id: "2", name: "B", isChecked: false },
        { id: "3", name: "C", isChecked: false },
        { id: "4", name: "D", isChecked: false },
        { id: "5", name: "E", isChecked: false },
        { id: "6", name: "F", isChecked: false },
        { id: "7", name: "G", isChecked: false },
        { id: "8", name: "H", isChecked: false },
        { id: "9", name: "I", isChecked: false },
        { id: "10", name: "J", isChecked: false }
    ];
    public targetCars: Array<any> = [
    ];
    constructor(public activeModal: NgbActiveModal, private utilityService: UtilityService) {
        utilityService.CloseModalOnRouteChange(activeModal);
    }

    checked(e: any, isCheked: any) {        
        e.isChecked = !isCheked;
    }
    OnMoveToTarget(e) {     
        if (e.items[0].isChecked == false) {
            if (this.targetCars.length > 0) {
                let indexOfSelectedItem = this.targetCars.indexOf(e.items[0]);
                if (indexOfSelectedItem > -1) {
                    this.targetCars.splice(indexOfSelectedItem, 1);
                    this.sourceCars.push(e.items[0]);
                }
            }
        }

        this.sourceCars.forEach(obj => {
            if (obj.isChecked == true) {
                this.targetCars.push(obj);
            }
        });

        let tempArray = this.sourceCars;
        this.sourceCars = [];
        tempArray.forEach(obj => {
            if (obj.isChecked != true) {
                this.sourceCars.push(obj);
            }
        });

        this.targetCars.forEach(obj => {
            if (obj.isChecked == true) {
                obj.isChecked = false;
            }
        });

        this.SortByKey(this.sourceCars, "name");
        this.SortByKey(this.targetCars, "name");

        if (this.isSourceListSelectAll == true)
            this.isSourceListSelectAll = false;
        if (this.isTargetListSelectAll == true)
            this.isTargetListSelectAll = false;


    }
    OnMoveToSource(e) {        
        if (e.items[0].isChecked == false) {
            if (this.sourceCars.length > 0) {
                let indexOfSelectedItem = this.sourceCars.indexOf(e.items[0]);
                if (indexOfSelectedItem > -1) {
                    this.sourceCars.splice(indexOfSelectedItem, 1);
                    this.targetCars.push(e.items[0]);
                }
            }
        }

        this.targetCars.forEach(obj => {
            if (obj.isChecked == true) {
                this.sourceCars.push(obj);
            }
        });

        let tempArray = this.targetCars;
        this.targetCars = [];
        tempArray.forEach(obj => {
            if (obj.isChecked != true) {
                this.targetCars.push(obj);
            }
        });

        this.sourceCars.forEach(obj => {
            if (obj.isChecked == true) {
                obj.isChecked = false;
            }
        });

        this.SortByKey(this.sourceCars, "name");
        this.SortByKey(this.targetCars, "name");

        if (this.isSourceListSelectAll == true)
            this.isSourceListSelectAll = false;
        if (this.isTargetListSelectAll == true)
            this.isTargetListSelectAll = false;

    }

    SortByKey(array, key) {
        return array.sort((a, b) => {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    SourceListSelectAllChange(e) {        
        if (this.isSourceListSelectAll == false) {
            this.sourceCars.forEach(obj => {
                if (obj.isChecked == true) {
                    let Treeecheckboxlement: HTMLElement = document.getElementById(obj.id + 'listvalue') as HTMLElement;
                    Treeecheckboxlement.click();
                }
            });
        }
        else {
            this.sourceCars.forEach(obj => {
                if (obj.isChecked == false) {
                    let Treeecheckboxlement: HTMLElement = document.getElementById(obj.id + 'listvalue') as HTMLElement;
                    Treeecheckboxlement.click();
                }
            });
        }
    }

    TargetListSelectAllChange(e) {        
        if (this.isTargetListSelectAll == false) {
            this.targetCars.forEach(obj => {
                if (obj.isChecked == true) {
                    let Treeecheckboxlement: HTMLElement = document.getElementById(obj.id + 'listvalue') as HTMLElement;
                    Treeecheckboxlement.click();
                }
            });
        }
        else {
            this.targetCars.forEach(obj => {
                if (obj.isChecked == false) {
                    let Treeecheckboxlement: HTMLElement = document.getElementById(obj.id + 'listvalue') as HTMLElement;
                    Treeecheckboxlement.click();
                }
            });
        }
    }

}