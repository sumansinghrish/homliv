import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcartuserComponent } from './addcartuser.component';

describe('AddcartuserComponent', () => {
  let component: AddcartuserComponent;
  let fixture: ComponentFixture<AddcartuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcartuserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddcartuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
