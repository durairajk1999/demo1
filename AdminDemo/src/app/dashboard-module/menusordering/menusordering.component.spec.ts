import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenusorderingComponent } from './menusordering.component';

describe('MenusorderingComponent', () => {
  let component: MenusorderingComponent;
  let fixture: ComponentFixture<MenusorderingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenusorderingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenusorderingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
