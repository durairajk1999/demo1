import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentMenusComponent } from './parent-menus.component';

describe('ParentMenusComponent', () => {
  let component: ParentMenusComponent;
  let fixture: ComponentFixture<ParentMenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentMenusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParentMenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
