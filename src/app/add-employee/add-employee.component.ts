import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators, 
  FormControl 
} from '@angular/forms';

// Angular Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';

import { IndexedDBService } from '../services/indexdbservice.service';
import { Employee } from '../model/employee';
import { Router } from '@angular/router';
import { RoleBottomSheetComponent } from '../role-bottom-sheet/role-bottom-sheet.component';
import { DatepickerHeaderComponent } from '../calendar/datepicker-header/datepicker-header.component';
import { DatepickerFooterComponent } from '../calendar/datepicker-footer/datepicker-footer.component';

interface EmployeeForm {
  name: FormControl<string | null>;
  role: FormControl<string | null>;
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
}

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatBottomSheetModule,
    MatListModule,
    DatepickerHeaderComponent,
    DatepickerFooterComponent
  ],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent implements OnInit {
  // Dependency Injection using inject()
  private fb = inject(FormBuilder);
  private indexedDBService = inject(IndexedDBService);
  private router = inject(Router);
  private bottomSheet = inject(MatBottomSheet);
  public startDate = new Date();
  datepickerHeader = DatepickerHeaderComponent;



  // Signals
  isFormValid = signal<boolean>(false);
  availableRoles = signal<string[]>(['Developer', 'Designer', 'Manager', 'Tester']);

  // Form Group with typed controls
  employeeForm: FormGroup<EmployeeForm>;

  constructor() {
    // Create form with typed controls and validators
    this.employeeForm = this.fb.group<EmployeeForm>({
      name: new FormControl<string | null>('', [Validators.required]),
      role: new FormControl<string | null>('', [Validators.required]),
      startDate: new FormControl<Date | null>(null, [Validators.required]),
      endDate: new FormControl<Date | null>(null, [Validators.required])
    });

    // Watch form validity
    this.employeeForm.statusChanges.subscribe(() => {
      this.isFormValid.set(this.employeeForm.valid);
    });
  }

  ngOnInit(): void {}

  openRoleBottomSheet(): void {
    const sheetRef = this.bottomSheet.open(RoleBottomSheetComponent, {
      data: { roles: this.availableRoles() }
    });

    sheetRef.afterDismissed().subscribe((selectedRole: string) => {
      if (selectedRole) {
        this.employeeForm.patchValue({ role: selectedRole });
      }
    });
  }

  saveEmployee(): void {
    if (this.employeeForm.valid) {
      const employeeData: Employee = this.employeeForm.getRawValue() as Employee;
      this.indexedDBService.addEmployee(employeeData);
      this.router.navigate(['/']);
      this.employeeForm.reset();
    }
  }

  cancelForm(): void {
    this.employeeForm.reset();
    this.router.navigate(['/']);
  }

  onDateSaved(selectedDate: Date | null): void {
    console.log('Saved Date:', selectedDate);
    // Perform additional actions like updating the form or closing the datepicker
  }

  onDateCanceled(): void {
    console.log('Date selection canceled');
    // Handle cancel action (e.g., reset datepicker state)
  }
}