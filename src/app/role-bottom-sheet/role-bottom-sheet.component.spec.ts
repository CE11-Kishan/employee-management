import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleBottomSheetComponent } from './role-bottom-sheet.component';

describe('RoleBottomSheetComponent', () => {
  let component: RoleBottomSheetComponent;
  let fixture: ComponentFixture<RoleBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoleBottomSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoleBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
