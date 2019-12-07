import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratingUnitsComponent } from './generating-units.component';

describe('GeneratingUnitsComponent', () => {
  let component: GeneratingUnitsComponent;
  let fixture: ComponentFixture<GeneratingUnitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneratingUnitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneratingUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
