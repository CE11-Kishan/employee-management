import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerFooterComponent } from './datepicker-footer.component';

describe('DatepickerFooterComponent', () => {
  let component: DatepickerFooterComponent;
  let fixture: ComponentFixture<DatepickerFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatepickerFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatepickerFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
