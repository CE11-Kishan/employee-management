import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../model/employee';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private db: IDBDatabase | null = null;
  private employees: BehaviorSubject<Employee[]> = new BehaviorSubject<Employee[]>([]);
  private _snackBar = inject(MatSnackBar);

  constructor() {
    this.initializeDB();
  }

  private initializeDB() {
    const request = window.indexedDB.open('employeeDB', 1);

    request.onupgradeneeded = (event) => {
      this.db = (event.target as IDBRequest<IDBDatabase>).result;
      this.db.createObjectStore('employees', { keyPath: 'id', autoIncrement: true });
    };

    request.onsuccess = (event) => {
      this.db = (event.target as IDBRequest<IDBDatabase>).result;
      this.getEmployees();
    };

    request.onerror = (event) => {
      console.error('Error initializing IndexedDB', event);
    };
  }

  getEmployees(): Observable<Employee[]> {
    const transaction = this.db?.transaction(['employees'], 'readonly');
    const store = transaction?.objectStore('employees');
    const request = store?.getAll();

    if (request) {
      request.onsuccess = (event) => {
        this.employees.next((event.target as IDBRequest<Employee[]>).result);
      };

      request.onerror = (event) => {
        console.error('Error fetching employees from IndexedDB', event);
      };
    }

    return this.employees.asObservable();
  }

  addEmployee(employee: Employee): void {
    const transaction = this.db?.transaction(['employees'], 'readwrite');
    const store = transaction?.objectStore('employees');
    const request = store?.add(employee);

    if (request) {
      request.onsuccess = () => {
        this.getEmployees();
      };

      request.onerror = (event) => {
        console.error('Error adding employee to IndexedDB', event);
      };
    }
  }

  deleteEmployee(id: number): any {
    const transaction = this.db?.transaction(['employees'], 'readwrite');
    const store = transaction?.objectStore('employees');
    
    if (!store) {
      console.error('Store not found.');
      return;
    }
  
    const request = store.get(id); // Get the employee to restore if needed
  
    request.onsuccess = (event) => {
      const deletedEmployee = (event.target as IDBRequest<Employee>).result;
  
      if (deletedEmployee) {
        const deleteRequest = store.delete(id); // No optional chaining here for assignment
  
        deleteRequest.onsuccess = () => {
          // Show Snackbar with Undo option
          const snackBarRef: MatSnackBarRef<any> = this._snackBar.open(
            'Employee data has been deleted', 
            'Undo', 
            { duration: 5000 }
          );
  
          // Handle Undo click
          snackBarRef.onAction().subscribe(() => {
            this.restoreEmployee(deletedEmployee);
          });
  
          // Update employee list after deletion
          this.getEmployees();
        };
  
        deleteRequest.onerror = (event) => {
          console.error('Error deleting employee from IndexedDB', event);
        };
      }
    };
  
    request.onerror = (event) => {
      console.error('Error fetching employee to delete from IndexedDB', event);
    };
  }
  

  restoreEmployee(employee: Employee): void {
    const transaction = this.db?.transaction(['employees'], 'readwrite');
    const store = transaction?.objectStore('employees');
    
    if (!store) {
      console.error('Store not found.');
      return;
    }
    
    const addRequest = store.add(employee);
    addRequest.onsuccess = () => {
      this.getEmployees();
    };

    addRequest.onerror = (event) => {
      console.error('Error restoring employee to IndexedDB', event);
    };
  }

  getEmployeeById(id: number): Observable<Employee | null> {
    // Ensure the database is initialized
    if (!this.db) {
      console.error('Database not initialized');
    }

    return new Observable<Employee | null>((observer) => {
      const transaction = this.db?.transaction(['employees'], 'readonly');
      const store = transaction?.objectStore('employees');
      
      if (!store) {
        console.error('Store not found.');
        return;
      }
      
      const request = store.get(id);
      request.onsuccess = (event) => {
        const employee = (event.target as IDBRequest<Employee>).result;
        observer.next(employee || null);
        observer.complete();
      };

      request.onerror = (event) => {
        console.error('Error fetching employee by ID', event);
        observer.next(null);
        observer.complete();
      };
    });
  }
}
