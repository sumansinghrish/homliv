import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUserlocationComponent } from './select-userlocation.component';

describe('SelectUserlocationComponent', () => {
  let component: SelectUserlocationComponent;
  let fixture: ComponentFixture<SelectUserlocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectUserlocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectUserlocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
