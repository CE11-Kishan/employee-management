import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-custom-datepicker',
  imports: [MatCalendar, MatIcon, DatePipe],
  templateUrl: './custom-datepicker.component.html',
  styleUrl: './custom-datepicker.component.css'
})
export class CustomDatepickerComponent {
  selectedDate: Date | null = null;

  goToToday(): void {
    this.selectedDate = new Date();
  }

  clearDate(): void {
    this.selectedDate = null;
  }

  dateChanged(date: Date): void {
    this.selectedDate = date;
  }

  cancel(): void {
    console.log('Date selection canceled');
  }

  save(): void {
    console.log('Selected date saved:', this.selectedDate);
  }

}
