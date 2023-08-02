import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantpopUpViewComponent } from './merchantpop-up-view.component';

describe('MerchantpopUpViewComponent', () => {
  let component: MerchantpopUpViewComponent;
  let fixture: ComponentFixture<MerchantpopUpViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantpopUpViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantpopUpViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
