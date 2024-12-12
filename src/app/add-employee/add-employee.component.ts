import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Angular Material Imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { IndexedDBService } from '../services/indexdbservice.service';
import { Employee } from '../model/employee';
import { Router } from '@angular/router';


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
    MatButtonModule
  ],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css'],
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  roles: string[] = ['Developer', 'Designer', 'Manager', 'Tester'];

  constructor(
    private fb: FormBuilder,
    private indexedDBService: IndexedDBService,
    private router: Router
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    });
  }

  ngOnInit(): void {}

  saveEmployee() {
    if (this.employeeForm.valid) {
      const employeeData: Employee = this.employeeForm.value;
      this.indexedDBService.addEmployee(employeeData);
      this.router.navigate(['/']);
      this.employeeForm.reset();
    }
  }

  resetForm() {
    this.employeeForm.reset();
  }
}