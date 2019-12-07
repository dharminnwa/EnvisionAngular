import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteExternalsymbolsComponent } from './delete-externalsymbols.component';

describe('DeleteExternalsymbolsComponent', () => {
  let component: DeleteExternalsymbolsComponent;
  let fixture: ComponentFixture<DeleteExternalsymbolsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteExternalsymbolsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteExternalsymbolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
