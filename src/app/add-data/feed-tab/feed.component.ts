import { Component } from '@angular/core';
import { GridOptions } from "ag-grid-community";

@Component({
    selector: 'feed-tab',
    templateUrl: './feed.component.html',
    styleUrls: ['./feed.component.scss']
})
export class FeedComponent {
    public gridOptions: GridOptions;
    public rowGroupPanelShow = "";
    public HorizontalFName;

    constructor() {
        this.gridOptions = <GridOptions>{
            // rowData: DynamicComponent.createRowData(),
            // columnDefs: DynamicComponent.createColumnDefs(),
            // context: {
            //     componentParent: this
            // },
            //enableColResize: true
        };
        this.rowGroupPanelShow = "always";
    };

    columnDefs = [
        {
            headerName: "Add/Remove",
            suppressMenu: true,
            suppressSorting: true,
            width: 100,
            template:
                `<button type="button" data-action-type="view" class="btn btn-link">
                 Add
               </button>
               `
        },
        {
            headerName: "Delete",
            suppressMenu: true,
            suppressSorting: true,
            width: 100,
            template:
                `<button type="button" data-action-type="view" class="btn btn-link">
                 Delete
               </button>
               `
        },
        { headerName: 'LayerName', field: 'make', enableRowGroup: true },
        { headerName: 'Description', field: 'model', enableRowGroup: true },
        { headerName: 'Uploaded Date', field: 'price', enableRowGroup: true }
    ];

    rowData = [
    ];


}