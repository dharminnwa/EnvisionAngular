import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineActivityProjectsComponent } from './pipeline-activity-projects.component';

describe('PipelineActivityProjectsComponent', () => {
  let component: PipelineActivityProjectsComponent;
  let fixture: ComponentFixture<PipelineActivityProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipelineActivityProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineActivityProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
