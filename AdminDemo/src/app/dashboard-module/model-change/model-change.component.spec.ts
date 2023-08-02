import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelChangeComponent } from './model-change.component';

describe('ModelChangeComponent', () => {
  let component: ModelChangeComponent;
  let fixture: ComponentFixture<ModelChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
