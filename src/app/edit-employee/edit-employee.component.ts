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
import { ActivatedRoute, Router } from '@angular/router';
import { RoleBottomSheetComponent } from '../role-bottom-sheet/role-bottom-sheet.component';
import { ButtonModule } from 'primeng/button';

interface EmployeeForm {
  name: FormControl<string | null>;
  role: FormControl<string | null>;
  startDate: FormControl<Date | null>;
  endDate: FormControl<Date | null>;
}

@Component({
  selector: 'app-edit-employee',
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
    ButtonModule
  ],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.css'
})
export class EditEmployeeComponent implements OnInit {
  private fb = inject(FormBuilder);
  private indexedDBService = inject(IndexedDBService);
  private router = inject(Router);
  private bottomSheet = inject(MatBottomSheet);
  employeeId!: number;

  // Signals
  isFormValid = signal<boolean>(false);
  availableRoles = signal<string[]>(['Developer', 'Designer', 'Manager', 'Tester']);

  employeeForm: FormGroup<EmployeeForm>;

  constructor(
    private route: ActivatedRoute,
  ) {
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

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      
      if (idParam) {
        this.employeeId = parseInt(idParam, 10);
        
        // Fetch the employee details using the ID
        this.indexedDBService.getEmployeeById(this.employeeId).subscribe(employee => {
          if (employee) {
            // Populate the form with existing employee data
            this.employeeForm.patchValue({
              name: employee.name,
              role: employee.role,
              startDate: employee.startDate,
              endDate: employee.endDate
            });
          } else {
            // Handle case where employee is not found
            console.error('Employee not found');
            this.router.navigate(['/']);
          }
        });
      }
    });
  }

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
      
      if (this.employeeId) {
        this.indexedDBService.addEmployee(employeeData);
      }
      
      this.router.navigate(['/']);
      this.cancelForm();
    }
  }

  cancelForm(): void {
    this.employeeForm.reset();
    this.router.navigate(['/']);
  }

  deleteEmployee(): void {
    this.indexedDBService.deleteEmployee(this.employeeId);
    this.router.navigate(['/']);
  }
}