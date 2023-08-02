import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailRootComponent } from './email-root.component';

describe('EmailRootComponent', () => {
  let component: EmailRootComponent;
  let fixture: ComponentFixture<EmailRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailRootComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
