import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyProfileDetailModalComponent } from './company-profile-detail-modal.component';

describe('CompanyProfileDetailModalComponent', () => {
  let component: CompanyProfileDetailModalComponent;
  let fixture: ComponentFixture<CompanyProfileDetailModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyProfileDetailModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyProfileDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
