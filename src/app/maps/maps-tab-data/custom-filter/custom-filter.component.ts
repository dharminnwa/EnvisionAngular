import { Component, ChangeDetectorRef } from '@angular/core';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IFilterParams, RowNode, IDoesFilterPassParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { MapServiceService } from '../../../services/map-service.service';
import { HttpRequestService } from '../../../services/all-http-request.service';
@Component({
    selector: 'app-custom-filter',
    templateUrl: './custom-filter.component.html',
    styleUrls: ['./custom-filter.component.scss']
})
export class CustomFilterComponent implements IFilterAngularComp {
    private params: IFilterParams;
    private valueGetter: (rowNode: RowNode) => any;
    public selectedValues: any[] = [];
    public isSelectAll: boolean = false;
    public filterText: string = '';
    Gridcolumns
    distinctCheckboxList: any[] = [];
    AlldistinctCheckboxList: any[] = [];
    displayCount: number = 50;
    take: number = this.displayCount;
    skip: number = 0;
    options = [
        { name: "Is equal to", value: "#EQUAL#" },
        { name: "Is not equal to", value: "#NOTEQUAL#" },
        { name: "Contains", value: "#LIKE#" },
        { name: "Is less than", value: "<" },
        { name: "Is less than or equal to", value: "<=" },
        { name: "Is greater than", value: ">" },
        { name: "Is greater than or equal to", value: ">=" }
    ];
    optionCompare = [
        { name: "And", value: ";" },
        { name: "Or", value: "#OR#" }
    ];
    isLodaing: boolean = false;

    filter1Option: string = '#EQUAL#';
    filter1Val: string = '';
    bothFilterOption: string = ';';
    filter2Option: string = '#EQUAL#';
    filter2Val: string = '';

    constructor(private mapService: MapServiceService, private httpRequest: HttpRequestService, private cdRef: ChangeDetectorRef) {

    }

    agInit(params: IFilterParams): void {
        this.params = params;
        this.valueGetter = params.valueGetter;
        this.GetFilterData();
    }

    GetFilterData() {
        this.isLodaing = true;
        this.mapService.CloseFilterOnToggle();
        let filedname = this.params.colDef.field;
        var TabList = this.mapService._GridTabData.getValue();
        let index = 0;
        for (let tab of TabList) {
            if (tab.ActiveClass == " active") {
                if (filedname == "Notes" && tab.energyLayer && tab.energyLayer.length > 0 && tab.energyLayer[0]) {
                    this.setNotesFilter(tab.energyLayer[0].EnergyLayerID)
                    return;
                }
                let default_filter = this.mapService.filterval(tab.IsFiltervalue);
                let cql_Filter = this.mapService.getForDistinctCqlFilter(default_filter, false);
                let lastIndexval = 60000;
                if (tab.EnergylayersavegridFilter.mapfilterval) {
                    this.params.context.thisComponent.ClearColumnEventListner(TabList, index);
                }
                if (tab.energyLayer && tab.energyLayer.length > 0 && tab.energyLayer[0]) {
                    this.httpRequest._NodeGetDatabasedonPropertyname(tab.energyLayer[0], 0, lastIndexval, cql_Filter, filedname, '', filedname, "")
                        .subscribe(data => {
                            if (data.features.length > 0) {
                                var checkBoxList = [];
                                var arr = data.features;
                                arr.forEach(x => {
                                    if (x) {
                                        let item = {
                                            name: x,
                                            value: false
                                        }
                                        checkBoxList.push(item);
                                    }
                                });
                                this.SortArrayByName(checkBoxList);
                                this.distinctCheckboxList = checkBoxList;
                                this.AlldistinctCheckboxList = checkBoxList;
                                this.distinctCheckboxList = this.AlldistinctCheckboxList.slice(this.skip, this.take);
                                this.isSelectAll = false;
                                this.isLodaing = false;
                                this.params.filterModifiedCallback();
                                this.cdRef.detectChanges();
                            };
                        }, error => {
                            console.log(error);
                            this.isLodaing = false;
                        });
                }
            }
            index++;
        }

    }

    setNotesFilter(energyLayerId) {
        let NotesData = this.mapService.LodedIsNotesArray.getValue();
        let NotesItem = NotesData.find(x => x.energylayerId == energyLayerId);
        if (NotesItem && NotesItem.NotesData && NotesItem.NotesData.length > 0) {
            let arr = this.GetDistinctNotes(NotesItem.NotesData);
            let checkBoxList = [];
            arr.forEach(x => {
                if (x) {
                    let item = {
                        name: x,
                        value: false
                    }
                    checkBoxList.push(item);
                }
            })
            this.SortArrayByName(checkBoxList);
            this.distinctCheckboxList = checkBoxList;
            this.AlldistinctCheckboxList = checkBoxList;
            this.distinctCheckboxList = this.AlldistinctCheckboxList.slice(this.skip, this.take);
            this.isLodaing = false;
            this.params.filterModifiedCallback();
            this.cdRef.detectChanges();
        }
    }

    GetDistinctNotes(arr) {
        let result = [];
        arr.forEach(x => {
            let item = result.find(y => y == x.NoteValue);
            if (!item)
                result.push(x.NoteValue);
        });
        return result;
    }

    isFilterActive(): boolean {
        this.selectedValues = this.distinctCheckboxList.filter(x => x.value == true);
        if (this.selectedValues && this.selectedValues.length > 0)
            return true;
        else
            return false;
    }

    doesFilterPass(params: IDoesFilterPassParams): boolean {
        this.selectedValues = this.distinctCheckboxList.filter(x => x.value == true);
        if (this.selectedValues && this.selectedValues.length > 0) {
            let val = [];
            this.selectedValues.forEach(x => {
                val.push(x.name);
            });
            return val.every((filterWord) => {
                return this.valueGetter(params.node).toString().toLowerCase().indexOf(filterWord) >= 0;
            });
        }
        return false;
    }

    getModel(): any {
        //this.selectedValues = this.distinctCheckboxList.filter(x => x.value == true);
        this.selectedValues = this.AlldistinctCheckboxList.filter(x => x.value == true);
        if ((this.selectedValues && this.selectedValues.length > 0) || (this.filter1Val.trim() != '' || this.filter2Val.trim() != '')) {
            let val = [];
            this.selectedValues.forEach(x => {
                val.push(x.name);
            });
            let textFilterval = this.getTextFilterVal();
            return { values: val, textFilterVal: textFilterval };
        } else {
            return { values: [], textFilterVal: '' };
        }
    }

    setModel(model: any): void {
        this.selectedValues = model ? model.values : [];
    }

    onChangeCheckboxVal(item): void {
        this.isSelectAll = false;
        this.AlldistinctCheckboxList.forEach(x => {
            if (item.name == x.name) {
                x.value = item.value;
            }
        });
        this.params.filterChangedCallback();
    }

    filterClick() {
        this.params.filterChangedCallback();
    }

    onSelectAll() {
        if (this.isSelectAll == true) {
            this.UpdateAllCheckValue(true);
        } else {
            this.UpdateAllCheckValue(false);
        }
        this.cdRef.detectChanges();
        //this.params.filterChangedCallback();
    }

    UpdateAllCheckValue(val: boolean) {
        this.distinctCheckboxList.forEach(x => {
            x.value = val;
        });
        this.AlldistinctCheckboxList.forEach(x => {
            x.value = val;
        });
    }

    SortArrayByName(List: any[]) {
        if (List && List.length > 0) {
            List.sort((a: any, b: any) => {
                if (a['name'] < b['name']) {
                    return -1;
                } else if (a['name'] > b['name']) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
    }

    onScroll() {
        this.take = this.take + this.displayCount;
        this.skip = this.take - this.displayCount;
        if (this.skip < this.AlldistinctCheckboxList.length) {
            let data = this.AlldistinctCheckboxList.slice(this.skip, this.take);
            data.forEach(x => {
                x.value = this.isSelectAll;
            });
            this.distinctCheckboxList = this.distinctCheckboxList.concat(data);

        }
    }

    getTextFilterVal(): string {
        let filter = '';
        // if (this.filter1Val.trim() != '' || this.filter2Val.trim() != '') {
        //     filter += '( ';
        //     if (this.filter1Val.trim() != '') {

        //             filter += ' (' + this.params.colDef.field + ' ' + this.filter1Option + " '" + encodeURIComponent(this.filter1Val) + "' )";

        //     }
        //     if (filter != '( ' && this.filter2Val.trim() != '') {
        //         filter += ' ' + this.bothFilterOption + ' ';
        //     }
        //     if (this.filter2Val.trim() != '') {

        //             filter += ' (' + this.params.colDef.field + ' ' + this.filter2Option + " '" + encodeURIComponent(this.filter2Val) + "' )";

        //     }
        //     filter += ' )';
        // }
        if (this.filter1Val.trim() != '' || this.filter2Val.trim() != '') {
            // filter += '( ';
            if (this.filter1Val.trim() != '') {

                filter += this.params.colDef.field + this.filter1Option + this.filter1Val;

            }
            if (filter != '' && this.filter2Val.trim() != '') {
                filter += this.bothFilterOption;
            }
            if (this.filter2Val.trim() != '') {

                filter += this.params.colDef.field + this.filter2Option + this.filter2Val;

            }
            // filter += ' )';
        }
        return filter;
    }
}
