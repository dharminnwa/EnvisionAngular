import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from "ag-grid-community";
import { AddeditCompaniesComponent } from './addedit-companies/addedit.component';
import { UtilityService } from '../services/Utility.service';

@Component({
    selector: 'companies-modal',
    templateUrl: './companies.component.html',
    styleUrls: ['./companies.component.scss'],
    providers: [NgbModal]
})
export class CompaniesComponent {
    public gridOptions: GridOptions;

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
        { headerName: 'Make', field: 'make' },
        { headerName: 'Model', field: 'model' },
        { headerName: 'Price', field: 'price' }
    ];

    rowData = [
        { make: 'Toyota', model: 'Celica', price: 35000 },
        { make: 'Ford', model: 'Mondeo', price: 32000 },
        { make: 'Porsche', model: 'Boxter', price: 72000 }
    ];

    OpenAddEditCompanyModal() {
        this.modalService.open(AddeditCompaniesComponent, { size: 'lg', backdropClass: 'light-blue-backdrop', backdrop: 'static',centered: true, windowClass: 'addeditcompany-modal' });
    }

}