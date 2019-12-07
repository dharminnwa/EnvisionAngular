import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerPlantdetailModalComponent } from './power-plantdetail-modal.component';

describe('PowerPlantdetailModalComponent', () => {
  let component: PowerPlantdetailModalComponent;
  let fixture: ComponentFixture<PowerPlantdetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerPlantdetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerPlantdetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
