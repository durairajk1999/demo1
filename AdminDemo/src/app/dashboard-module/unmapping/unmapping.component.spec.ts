import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnmappingComponent } from './unmapping.component';

describe('UnmappingComponent', () => {
  let component: UnmappingComponent;
  let fixture: ComponentFixture<UnmappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnmappingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnmappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
