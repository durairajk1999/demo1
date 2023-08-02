import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnmappingRequestPopUpComponent } from './unmapping-request-pop-up.component';

describe('UnmappingRequestPopUpComponent', () => {
  let component: UnmappingRequestPopUpComponent;
  let fixture: ComponentFixture<UnmappingRequestPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnmappingRequestPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnmappingRequestPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
