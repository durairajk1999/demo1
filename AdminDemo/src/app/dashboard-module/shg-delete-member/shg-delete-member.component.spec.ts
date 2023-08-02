import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShgDeleteMemberComponent } from './shg-delete-member.component';

describe('ShgDeleteMemberComponent', () => {
  let component: ShgDeleteMemberComponent;
  let fixture: ComponentFixture<ShgDeleteMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShgDeleteMemberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShgDeleteMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
