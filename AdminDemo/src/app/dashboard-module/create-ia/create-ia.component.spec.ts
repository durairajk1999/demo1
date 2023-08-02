import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIaComponent } from './create-ia.component';

describe('CreateIaComponent', () => {
  let component: CreateIaComponent;
  let fixture: ComponentFixture<CreateIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateIaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
