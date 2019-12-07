import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmissionProjectsComponent } from './transmission-projects.component';

describe('TransmissionProjectsComponent', () => {
  let component: TransmissionProjectsComponent;
  let fixture: ComponentFixture<TransmissionProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransmissionProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmissionProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
