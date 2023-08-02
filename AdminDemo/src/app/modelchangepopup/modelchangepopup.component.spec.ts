import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelchangepopupComponent } from './modelchangepopup.component';

describe('ModelchangepopupComponent', () => {
  let component: ModelchangepopupComponent;
  let fixture: ComponentFixture<ModelchangepopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelchangepopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelchangepopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
