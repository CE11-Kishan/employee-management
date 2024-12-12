import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IndexedDBService } from '../services/indexdbservice.service';
import { Employee } from '../model/employee';
import { DatePipe, CommonModule } from '@angular/common';
import { 
  CdkDragDrop, 
  CdkDrag, 
  CdkDragMove, 
  CdkDragRelease, 
  CdkDropList,
  CdkDragStart
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [RouterLink, DatePipe, CommonModule, CdkDrag, CdkDropList],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  public currentEmployees: Employee[] = [];
  public previousEmployees: Employee[] = [];
  public draggedEmployee: Employee | null = null;
  public dragProgress: { [key: string]: number } = {};

  constructor(private indexedDBService: IndexedDBService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.indexedDBService.getEmployees().subscribe((employees) => {
      const currentDate = new Date();
      
      this.currentEmployees = employees.filter(emp => 
        !emp.endDate || new Date(emp.endDate) > currentDate
      );

      this.previousEmployees = employees.filter(emp => 
        emp.endDate && new Date(emp.endDate) <= currentDate
      );
    });
  }

  onDragStarted(employee: Employee) {
    this.draggedEmployee = employee;
  }

  onDragMoved(event: CdkDragMove, employee: Employee) {
    const dragRef = event.source;
    const newX = event.distance.x;
  
    // Restrict movement to left only
    const restrictedX = newX < 0 ? newX : 0;  
  
    // Prevent vertical dragging
    dragRef.setFreeDragPosition({
      x: restrictedX,
      y: 0
    });
  
    this.dragProgress[employee.id] = restrictedX;
  }

  deleteEmployee(employee: Employee) {
    this.indexedDBService.deleteEmployee(employee.id).subscribe({
      next: () => {
        // Remove from local arrays
        this.currentEmployees = this.currentEmployees.filter(e => e.id !== employee.id);
        this.previousEmployees = this.previousEmployees.filter(e => e.id !== employee.id);
        
        // Reset drag progress
        delete this.dragProgress[employee.id];
      },
      error: (error: any) => {
        console.error('Error deleting employee', error);
      }
    });
  }

  onDragReleased(event: CdkDragRelease, employee: Employee) {
    const dragProgress = this.dragProgress[employee.id] || 0;
    
    // If dragged far enough to the left, delete
    if (dragProgress < -50) {
      this.deleteEmployee(employee);
    } else {
      // Reset position if not dragged far enough
      event.source.reset();
    }

    // Clear drag progress and dragged employee
    delete this.dragProgress[employee.id];
    this.draggedEmployee = null;
  }
}