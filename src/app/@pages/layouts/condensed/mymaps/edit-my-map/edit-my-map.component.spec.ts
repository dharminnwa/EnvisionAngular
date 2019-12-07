import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMyMapComponent } from './edit-my-map.component';

describe('EditMyMapComponent', () => {
  let component: EditMyMapComponent;
  let fixture: ComponentFixture<EditMyMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMyMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMyMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
