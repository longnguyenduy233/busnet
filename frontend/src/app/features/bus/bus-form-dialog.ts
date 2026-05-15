import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Bus } from '../../core/models/bus.model';

export interface BusDialogData { bus?: Bus }

@Component({
  selector: 'app-bus-form-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.bus ? 'Edit Bus' : 'New Bus' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="bus-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
          @if (form.get('name')?.invalid && form.get('name')?.touched) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>License Plate</mat-label>
          <input matInput formControlName="licensePlate" />
          @if (form.get('licensePlate')?.invalid && form.get('licensePlate')?.touched) {
            <mat-error>License plate is required</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Capacity</mat-label>
          <input matInput type="number" formControlName="capacity" min="1" max="200" />
          @if (form.get('capacity')?.invalid && form.get('capacity')?.touched) {
            <mat-error>Capacity must be between 1 and 200</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="Active">Active</mat-option>
            <mat-option value="Inactive">Inactive</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary"
              [disabled]="form.invalid"
              (click)="submit()">
        {{ data.bus ? 'Save' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`.bus-form { display:flex; flex-direction:column; gap:4px; min-width:360px; padding-top:8px; }
            .full-width { width:100%; }`]
})
export class BusFormDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<BusFormDialogComponent>);
  data: BusDialogData = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  form: FormGroup = this.fb.group({
    name: [this.data?.bus?.name ?? '', [Validators.required, Validators.maxLength(100)]],
    licensePlate: [this.data?.bus?.licensePlate ?? '', [Validators.required, Validators.maxLength(20)]],
    capacity: [this.data?.bus?.capacity ?? 50, [Validators.required, Validators.min(1), Validators.max(200)]],
    status: [this.data?.bus?.status ?? 'Active', Validators.required]
  });

  submit() {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }
}
