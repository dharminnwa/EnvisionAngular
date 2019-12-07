import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyIntelligenceComponent } from './company-intelligence.component';

describe('CompanyIntelligenceComponent', () => {
  let component: CompanyIntelligenceComponent;
  let fixture: ComponentFixture<CompanyIntelligenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyIntelligenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyIntelligenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
