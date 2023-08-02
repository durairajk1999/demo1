import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IaviewViewPopuoComponent } from './iaview-view-popuo.component';

describe('IaviewViewPopuoComponent', () => {
  let component: IaviewViewPopuoComponent;
  let fixture: ComponentFixture<IaviewViewPopuoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IaviewViewPopuoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IaviewViewPopuoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
