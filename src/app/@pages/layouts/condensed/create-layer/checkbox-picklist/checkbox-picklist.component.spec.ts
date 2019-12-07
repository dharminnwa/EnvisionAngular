import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxPicklistComponent } from './checkbox-picklist.component';

describe('CheckboxPicklistComponent', () => {
  let component: CheckboxPicklistComponent;
  let fixture: ComponentFixture<CheckboxPicklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxPicklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxPicklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
