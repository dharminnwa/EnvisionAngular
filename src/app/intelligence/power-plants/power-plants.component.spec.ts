import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerPlantsComponent } from './power-plants.component';

describe('PowerPlantsComponent', () => {
  let component: PowerPlantsComponent;
  let fixture: ComponentFixture<PowerPlantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerPlantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerPlantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
