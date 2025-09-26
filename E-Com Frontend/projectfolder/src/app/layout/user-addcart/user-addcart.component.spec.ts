import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddcartComponent } from './user-addcart.component';

describe('UserAddcartComponent', () => {
  let component: UserAddcartComponent;
  let fixture: ComponentFixture<UserAddcartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAddcartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAddcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
