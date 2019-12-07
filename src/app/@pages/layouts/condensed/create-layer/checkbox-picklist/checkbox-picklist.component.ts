import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox-picklist',
  templateUrl: './checkbox-picklist.component.html',
  styleUrls: ['./checkbox-picklist.component.scss']
})
export class CheckboxPicklistComponent implements OnInit {

  lessThenText: string = '<';
  dataToDisplay: any[] = [];
  displayCount: number = 200;
  take: number = this.displayCount;
  skip: number = 0;
  _sourceList: any[] = [];
  @Input() set sourceList(value: any[]) {
    this._sourceList = value;
    if (value && value.length >= 0) {
      this.FilterSourceList();
      this.skip = 0;
      this.take = this.displayCount;
      this.SortArrayByName(this.sourceList);
      this.dataToDisplay = this.sourceList.slice(this.skip, this.take);
      // this.SetDistinctValueosSourceList();
    }
  }
  get sourceList(): any[] {
    return this._sourceList;
  }
  filterText: string;
  @Input() listName;
  @Input() singularName;
  @Input() isTargetSelectAll = true;
  @Input() isSourceSelectAll = true;
  @Input() isFilterable = false;
  @Input() isLazyLoad = false;
  @Input() currentTab = 'Pipelines';
  @Output() OnChangeList: EventEmitter<any[]> = new EventEmitter<any[]>();

  sourceSelectAll: boolean = false;
  targetSelectAll: boolean = false;
  targetList = [];
  constructor() { }

  ngOnInit() {
  }

  FilterSourceList() {
    let deleteIndexs = [];
    if(this.targetList.length == 0)
      return;
    this.sourceList.forEach(x => {
      let itemIndex = this.targetList.findIndex(y => y.name == x.name && y.id == x.id);
      if (itemIndex > -1)
        deleteIndexs.push(itemIndex);
    });
    deleteIndexs.reverse();
    deleteIndexs.forEach(x => {
      this.sourceList.splice(x, 1);
    });
  }

  MoveToSourceList() {
    if (this.targetList && this.targetList.length > 0) {
      let selectedVal = this.targetList.filter(x => x.isChecked == true);
      this.AddToList(selectedVal, this.sourceList);
      this.RemoveFromList(selectedVal, this.targetList);
      this.SetDisplayList();
    }
    this.OnChangeList.emit(this.targetList);
    this.sourceSelectAll = false;
    this.targetSelectAll = false;
  }

  MoveToTargetList() {
    if (this.sourceList && this.sourceList.length > 0) {
      let selectedVal = this.sourceList.filter(x => x.isChecked == true);
      this.AddToList(selectedVal, this.targetList);
      this.RemoveFromList(selectedVal, this.sourceList);
      this.SetDisplayList();
    }
    this.OnChangeList.emit(this.targetList);
    this.sourceSelectAll = false;
    this.targetSelectAll = false;
  }

  AddToList(items: any[], List: any[]) {
    if (!List)
      List = [];
    if (items && items.length > 0) {
      items.forEach(x => {
        x.isChecked = false;
        List.push(x);
      });
      this.SortArrayByName(List);
    }
  }

  RemoveFromList(items: any[], List: any[]) {
    if (List && List.length > 0 && items && items.length > 0) {
      items.forEach(x => {
        let index = List.findIndex(y => y.id == x.id);
        if (index != -1) {
          List.splice(index, 1);
        }
      });
    }
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

  SelectAllSourceList() {
    this.sourceSelectAll = !this.sourceSelectAll;
    if (this.sourceSelectAll == true) {
      this.sourceList.forEach(x => {
        x.isChecked = true;
      })
    } else {
      this.sourceList.forEach(x => {
        x.isChecked = false;
      })
    }
  }

  SelectAllTargetList() {
    this.targetSelectAll = !this.targetSelectAll;
    if (this.targetSelectAll == true) {
      this.targetList.forEach(x => {
        x.isChecked = true;
      })
    } else {
      this.targetList.forEach(x => {
        x.isChecked = false;
      })
    }
  }

  SetDisplayList() {
    this.dataToDisplay = this.sourceList.slice(0, this.displayCount);
  }

  onScroll() {
    this.take = this.take + this.displayCount;
    this.skip = this.take - this.displayCount;
    if (this.skip < this.sourceList.length) {
      let data = this.sourceList.slice(this.skip, this.take);
      this.dataToDisplay = this.dataToDisplay.concat(data);
    }
  }

  // SetDistinctValueosSourceList() {
  //   
  //   var arr = [];
  //   for (var i = 0; i < this.sourceList.length; i++) {
  //     let item = this.sourceList[i];
  //     if (item) {
  //       let val = arr.find(x => x.name.trim() == item.name.trim());
  //       if (!val)
  //         arr.push(item);
  //     }
  //   }
  //   this.sourceList = arr;
  // }
}
