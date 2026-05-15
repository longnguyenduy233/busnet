import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, inject,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Route } from '../../core/models/route.model';
import { parseRoutePointsFromCsv } from './route-csv';

export interface RouteDialogData { route?: Route }

@Component({
  selector: 'app-route-form-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatTooltipModule,
    MatSnackBarModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ data.route ? 'Edit Route' : 'New Route' }}</h2>
    <mat-dialog-content class="route-dialog-content">
      <form [formGroup]="form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Route Name</mat-label>
          <input matInput formControlName="name" />
          @if (form.get('name')?.invalid && form.get('name')?.touched) {
            <mat-error>Name is required</mat-error>
          }
        </mat-form-field>

        <div class="points-section">
          <div class="points-header">
            <span class="points-label">Route Points ({{ pointsArray.length }})</span>
            <span class="points-actions">
              <input
                #csvFileInput
                type="file"
                class="csv-file-input"
                accept=".csv,text/csv,text/plain"
                (change)="onCsvFileSelected($event, csvFileInput)" />
              <button
                mat-button
                type="button"
                matTooltip="Replace all points. Two columns: latitude, longitude (decimal .). Optional header row."
                (click)="csvFileInput.click()">
                <mat-icon>upload_file</mat-icon> Import CSV
              </button>
              <button mat-button type="button" (click)="addPoint()">
                <mat-icon>add</mat-icon> Add Point
              </button>
            </span>
          </div>
          <p class="csv-hint">CSV format: <code>latitude,longitude</code> per line.</p>

          @for (point of pointsArray.controls; track $index) {
            <div [formGroup]="asGroup(point)" class="point-row">
              <span class="point-index">{{ $index + 1 }}</span>
              <mat-form-field appearance="outline" class="coord-field">
                <mat-label>Latitude</mat-label>
                <input matInput type="number" formControlName="latitude" step="0.000001" />
              </mat-form-field>
              <mat-form-field appearance="outline" class="coord-field">
                <mat-label>Longitude</mat-label>
                <input matInput type="number" formControlName="longitude" step="0.000001" />
              </mat-form-field>
              <button mat-icon-button type="button" color="warn"
                      matTooltip="Remove point" (click)="removePoint($index)">
                <mat-icon>remove_circle_outline</mat-icon>
              </button>
            </div>
          }

          @if (pointsArray.length === 0) {
            <p class="no-points">No points added yet.</p>
          }
        </div>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary"
              [disabled]="form.invalid"
              (click)="submit()">
        {{ data.route ? 'Save' : 'Create' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .route-dialog-content { min-width: 480px; max-height: 60vh; }
    .route-dialog-content.mat-mdc-dialog-content { padding-top: 8px; }
    .full-width { width: 100%; }
    .points-section { margin-top: 8px; }
    .points-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
    .points-label { font-weight: 500; color: rgba(0,0,0,.6); font-size: .875rem; }
    .points-actions { display: flex; flex-wrap: wrap; align-items: center; gap: 4px; }
    .csv-file-input {
      position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
      overflow: hidden; clip: rect(0,0,0,0); border: 0;
    }
    .csv-hint { margin: 4px 0 8px; font-size: .75rem; color: rgba(0,0,0,.45); }
    .csv-hint code { font-size: .7rem; background: rgba(0,0,0,.06); padding: 1px 4px; border-radius: 2px; }
    .point-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .point-index { min-width: 24px; font-size: .8rem; color: #888; text-align: center; }
    .coord-field { flex: 1; }
    .no-points { color: #aaa; font-size: .875rem; text-align: center; padding: 16px 0; }
  `]
})
export class RouteFormDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<RouteFormDialogComponent>);
  private snack = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);
  data: RouteDialogData = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  form: FormGroup = this.fb.group({
    name: [this.data?.route?.name ?? '', [Validators.required, Validators.maxLength(100)]],
    points: this.fb.array(
      (this.data?.route?.points ?? []).map((p) => this.makePointGroup(p.latitude, p.longitude))
    )
  });

  get pointsArray(): FormArray { return this.form.get('points') as FormArray; }

  asGroup(ctrl: any): FormGroup { return ctrl as FormGroup; }

  addPoint() {
    this.pointsArray.push(this.makePointGroup());
  }

  removePoint(i: number) {
    this.pointsArray.removeAt(i);
  }

  /** Loads points from a user CSV file; replaces existing rows (same payload as Create/Update routes). */
  onCsvFileSelected(event: Event, input: HTMLInputElement): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    input.value = '';
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (): void => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const parsed = parseRoutePointsFromCsv(text);
      if (!parsed.ok) {
        this.snack.open(parsed.error, 'Dismiss', { duration: 8000 });
        this.cdr.markForCheck();
        return;
      }
      this.replaceAllPoints(parsed.points);
      this.snack.open(`Imported ${parsed.points.length} points.`, undefined, { duration: 3000 });
      this.cdr.markForCheck();
    };
    reader.onerror = (): void => {
      this.snack.open('Could not read the CSV file.', 'Dismiss', { duration: 5000 });
      this.cdr.markForCheck();
    };
    reader.readAsText(file, 'UTF-8');
  }

  private replaceAllPoints(points: ReadonlyArray<{ latitude: number; longitude: number }>): void {
    while (this.pointsArray.length > 0) {
      this.pointsArray.removeAt(0);
    }
    for (const p of points) {
      this.pointsArray.push(this.makePointGroup(p.latitude, p.longitude));
    }
  }

  submit() {
    if (this.form.invalid) return;
    const value = this.form.value;
    this.dialogRef.close({
      name: value.name,
      points: value.points.map((p: any, i: number) => ({ ...p, order: i }))
    });
  }

  private makePointGroup(lat = 0, lng = 0) {
    return this.fb.group({
      latitude: [
        lat,
        [Validators.required, Validators.min(-90), Validators.max(90)],
      ],
      longitude: [
        lng,
        [Validators.required, Validators.min(-180), Validators.max(180)],
      ],
    });
  }
}
