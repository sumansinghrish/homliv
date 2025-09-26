import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSelectChannelComponent } from './user-select-channel.component';

describe('UserSelectChannelComponent', () => {
  let component: UserSelectChannelComponent;
  let fixture: ComponentFixture<UserSelectChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserSelectChannelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserSelectChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
