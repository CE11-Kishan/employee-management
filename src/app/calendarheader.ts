import { Component } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';

@Component({
  selector: 'app-datepicker-header',
  template: `
    <div class="custom-header">
      <button mat-button (click)="goToToday()">Today</button>
      <button mat-button (click)="goToNextMonday()">Next Monday</button>
      <button mat-button (click)="goToNextTuesday()">Next Tuesday</button>
      <button mat-button (click)="goToAfterOneWeek()">After 1 week</button>
    </div>
  `,
  styles: [
    `
      .custom-header {
        display: flex;
        justify-content: space-between;
        padding: 8px;
      }
      button {
        margin-right: 8px;
        text-transform: none;
      }
    `,
  ],
})
export class DatepickerHeaderComponent<D> {
  constructor(private calendar: MatCalendar<D>) {}

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
