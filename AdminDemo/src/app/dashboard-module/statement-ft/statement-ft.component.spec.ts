import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementFtComponent } from './statement-ft.component';

describe('StatementFtComponent', () => {
  let component: StatementFtComponent;
  let fixture: ComponentFixture<StatementFtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatementFtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatementFtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
