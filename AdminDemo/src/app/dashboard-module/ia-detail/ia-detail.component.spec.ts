import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IaDetailComponent } from './ia-detail.component';

describe('IaDetailComponent', () => {
  let component: IaDetailComponent;
  let fixture: ComponentFixture<IaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IaDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
