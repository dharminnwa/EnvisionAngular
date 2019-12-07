import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from "ag-grid-community";
import { AddEditUserComponent } from './addedit-users/addedit-user.component';
import { UtilityService } from '../services/Utility.service';

@Component({
    selector: 'users-modal',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent {
    public gridOptions: GridOptions;
    public rowGroupPanelShow = "";
    constructor(public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private utilityService: UtilityService) {
        utilityService.CloseModalOnRouteChange(activeModal);
        this.gridOptions = <GridOptions>{
            // rowData: DynamicComponent.createRowData(),
            // columnDefs: DynamicComponent.createColumnDefs(),
            // context: {
            //     componentParent: this
            // },
            //enableColResize: true
        };
        this.rowGroupPanelShow = "always";
    }

    columnDefs = [
        {
            headerName: "",
            suppressMenu: true,
            suppressSorting: true,
            width: 100,
            template:
                `<button type="button" data-action-type="view" class="btn btn-link">
                 Edit
               </button>
               `
        },
        { headerName: 'Make', field: 'make', enableRowGroup: true },
        { headerName: 'Model', field: 'model', enableRowGroup: true },
        { headerName: 'Price', field: 'price', enableRowGroup: true }
    ];

    rowData = [
        { make: 'Toyota', model: 'Celica', price: 35000 },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
        { make: 'Porsche', model: 'Boxter', price: 72000 }
    ];

    OpenAddEditUserModal() {
        this.modalService.open(AddEditUserComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static', centered: true, windowClass: 'addedituser-modal' });
    }



}