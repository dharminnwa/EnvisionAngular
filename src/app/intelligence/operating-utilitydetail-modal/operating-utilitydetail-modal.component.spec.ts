import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatingUtilitydetailModalComponent } from './operating-utilitydetail-modal.component';

describe('OperatingUtilitydetailModalComponent', () => {
  let component: OperatingUtilitydetailModalComponent;
  let fixture: ComponentFixture<OperatingUtilitydetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatingUtilitydetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatingUtilitydetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
