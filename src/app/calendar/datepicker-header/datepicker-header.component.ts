import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCalendar } from '@angular/material/datepicker';

@Component({
  selector: 'app-datepicker-header',
  imports: [MatButton],
  templateUrl: './datepicker-header.component.html',
  styleUrl: './datepicker-header.component.css'
})
export class DatepickerHeaderComponent<D> {
  constructor(private calendar: MatCalendar<D>) { }

  goToToday(): void {
    const today = new Date();
    this.calendar.activeDate = today as unknown as D;
    this.calendar.selected = today as unknown as D;
  }

  goToNextMonday(): void {
    const nextMonday = this.getNextDayOfWeek(1);
    this.calendar.activeDate = nextMonday as unknown as D;
    this.calendar.selected = nextMonday as unknown as D;
  }

  goToNextTuesday(): void {
    const nextTuesday = this.getNextDayOfWeek(2);
    this.calendar.activeDate = nextTuesday as unknown as D;
    this.calendar.selected = nextTuesday as unknown as D;
  }

  goToAfterOneWeek(): void {
    const today = new Date();
    const afterOneWeek = new Date(today.setDate(today.getDate() + 7));
    this.calendar.activeDate = afterOneWeek as unknown as D;
    this.calendar.selected = afterOneWeek as unknown as D;
  }

  private getNextDayOfWeek(dayOfWeek: number): Date {
    const today = new Date();
    const day = today.getDay();
    const diff = (7 + dayOfWeek - day) % 7;
    return new Date(today.setDate(today.getDate() + diff || 7));
  }
}
