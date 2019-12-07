import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelineActivityProjectModalComponent } from './pipeline-activity-project-modal.component';

describe('PipelineActivityProjectModalComponent', () => {
  let component: PipelineActivityProjectModalComponent;
  let fixture: ComponentFixture<PipelineActivityProjectModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipelineActivityProjectModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelineActivityProjectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
