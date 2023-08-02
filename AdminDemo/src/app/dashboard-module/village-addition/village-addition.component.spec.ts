import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VillageAdditionComponent } from './village-addition.component';

describe('VillageAdditionComponent', () => {
  let component: VillageAdditionComponent;
  let fixture: ComponentFixture<VillageAdditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VillageAdditionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VillageAdditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
