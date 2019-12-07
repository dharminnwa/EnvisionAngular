import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmissionProjectDetailModalComponent } from './transmission-project-detail-modal.component';

describe('TransmissionProjectDetailModalComponent', () => {
  let component: TransmissionProjectDetailModalComponent;
  let fixture: ComponentFixture<TransmissionProjectDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransmissionProjectDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmissionProjectDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
