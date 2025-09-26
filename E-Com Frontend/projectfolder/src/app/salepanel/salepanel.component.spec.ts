import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalepanelComponent } from './salepanel.component';

describe('SalepanelComponent', () => {
  let component: SalepanelComponent;
  let fixture: ComponentFixture<SalepanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalepanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalepanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
