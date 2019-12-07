import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapSearchDataComponent } from './map-search-data.component';

describe('MapSearchDataComponent', () => {
  let component: MapSearchDataComponent;
  let fixture: ComponentFixture<MapSearchDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapSearchDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapSearchDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
