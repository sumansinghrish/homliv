import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBuyerDetailsComponent } from './edit-buyer-details.component';

describe('EditBuyerDetailsComponent', () => {
  let component: EditBuyerDetailsComponent;
  let fixture: ComponentFixture<EditBuyerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBuyerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditBuyerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
