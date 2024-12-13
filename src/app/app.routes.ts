import { Routes } from '@angular/router';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { EmployeeListComponent } from './employee-list/employee-list.component';

export const routes: Routes = [
    {
        path: 'add-employee-detail',
        component: AddEmployeeComponent
    },
    {
        path: 'edit-employee-detail/:id',
        component: EditEmployeeComponent
    },
    {
        path: '',
        component: EmployeeListComponent
    }
];
