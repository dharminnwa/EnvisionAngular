import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLayerStylesComponent } from './map-layer-styles.component';

describe('MapLayerStylesComponent', () => {
  let component: MapLayerStylesComponent;
  let fixture: ComponentFixture<MapLayerStylesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapLayerStylesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapLayerStylesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
