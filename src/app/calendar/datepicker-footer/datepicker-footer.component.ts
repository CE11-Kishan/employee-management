import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-datepicker-footer',
  imports: [MatIcon, DatePipe],
  templateUrl: './datepicker-footer.component.html',
  styleUrl: './datepicker-footer.component.css'
})
export class DatepickerFooterComponent {
  selectedDate: Date | null = null;

  @Output() dateSaved = new EventEmitter<Date | null>();
  @Output() dateCanceled = new EventEmitter<void>();

  save(): void {
    this.dateSaved.emit(this.selectedDate);
  }

  cancel(): void {
    this.dateCanceled.emit();
  }
}
