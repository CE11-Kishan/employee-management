import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  MatBottomSheetRef, 
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetModule 
} from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-role-bottom-sheet',
  standalone: true,
  imports: [
    CommonModule, 
    MatBottomSheetModule, 
    MatListModule
  ],
  templateUrl: './role-bottom-sheet.component.html',
  styleUrl: './role-bottom-sheet.component.css'
})
export class RoleBottomSheetComponent {
  private bottomSheetRef = inject(MatBottomSheetRef);
  roles = inject(MAT_BOTTOM_SHEET_DATA)?.roles || [
    'Developer', 
    'Designer', 
    'Manager', 
    'Tester'
  ];

  selectRole(role: string): void {
    this.bottomSheetRef.dismiss(role);
  }
}