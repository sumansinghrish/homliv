import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectChannelComponent } from './select-channel.component';

describe('SelectChannelComponent', () => {
  let component: SelectChannelComponent;
  let fixture: ComponentFixture<SelectChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectChannelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
