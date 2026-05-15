import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Route } from '../../core/models/route.model';

export interface AssignRouteDialogData {
  busName: string;
  routes: Route[];
  currentRouteId?: string | null;
}

@Component({
  selector: 'app-assign-route-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Assign Route — {{ data.busName }}</h2>
    <mat-dialog-content style="padding-top:8px; min-width:320px">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Route</mat-label>
        <mat-select [formControl]="routeCtrl">
          <mat-option [value]="null">— None (unassign) —</mat-option>
          @for (r of data.routes; track r.id) {
            <mat-option [value]="r.id">{{ r.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancel</button>
      <button mat-raised-button color="primary" (click)="submit()">Save</button>
    </mat-dialog-actions>
  `,
  styles: [`.full-width { width: 100%; }`]
})
export class AssignRouteDialogComponent {
  private dialogRef = inject(MatDialogRef<AssignRouteDialogComponent>);
  data: AssignRouteDialogData = inject(MAT_DIALOG_DATA);

  routeCtrl = new FormControl<string | null>(this.data.currentRouteId ?? null);

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close({ routeId: this.routeCtrl.value });
  }
}
