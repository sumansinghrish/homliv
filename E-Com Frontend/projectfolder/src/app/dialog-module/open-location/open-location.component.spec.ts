import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenLocationComponent } from './open-location.component';

describe('OpenLocationComponent', () => {
  let component: OpenLocationComponent;
  let fixture: ComponentFixture<OpenLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenLocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
