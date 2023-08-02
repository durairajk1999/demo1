import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PennydropFtComponent } from './pennydrop-ft.component';

describe('PennydropFtComponent', () => {
  let component: PennydropFtComponent;
  let fixture: ComponentFixture<PennydropFtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PennydropFtComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PennydropFtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
