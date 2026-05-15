import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Sort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';
import { Bus, BusQueryParams } from '../../core/models/bus.model';
import { RouteService } from '../../core/services/route.service';
import {
  assignRoute, createBus, deleteBus,
  loadBuses, unassignRoute, updateBus
} from '../../store/bus/bus.actions';
import {
  selectAllBuses, selectBusError, selectBusLoading,
  selectBusPage, selectBusPageSize, selectBusPagination,
  selectBusSortBy, selectBusSortDir, selectBusTotal
} from '../../store/bus/bus.selectors';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { AssignRouteDialogComponent } from './assign-route-dialog';
import { BusFormDialogComponent } from './bus-form-dialog';

@Component({
  selector: 'app-bus',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    MatTableModule, MatSortModule, MatPaginatorModule,
    MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatDialogModule, MatTooltipModule
  ],
  templateUrl: './bus.html',
  styleUrl: './bus.scss'
})
export class BusComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private routeService = inject(RouteService);

  loading$  = this.store.select(selectBusLoading);
  error$    = this.store.select(selectBusError);
  buses$    = this.store.select(selectAllBuses);
  total$    = this.store.select(selectBusTotal);
  page$     = this.store.select(selectBusPage);
  pageSize$ = this.store.select(selectBusPageSize);
  sortBy$   = this.store.select(selectBusSortBy);
  sortDir$  = this.store.select(selectBusSortDir);

  displayedColumns = ['name', 'licensePlate', 'capacity', 'status', 'route', 'actions'];

  private currentParams: BusQueryParams = { page: 1, pageSize: 10, sortBy: 'name', sortDir: 'asc' };

  constructor() {
    this.store.select(selectBusPagination)
      .pipe(takeUntilDestroyed())
      .subscribe(params => { this.currentParams = params; });
  }

  ngOnInit() {
    // Explicit initial query so we never inherit Tracking's Active-only filter from store history.
    this.store.dispatch(loadBuses({ page: 1, pageSize: 10, sortBy: 'name', sortDir: 'asc' }));
  }

  onSortChange(sort: Sort) {
    this.store.dispatch(loadBuses({
      ...this.currentParams,
      page: 1,
      sortBy: sort.active || 'name',
      sortDir: (sort.direction as 'asc' | 'desc') || 'asc',
    }));
  }

  onPageChange(event: PageEvent) {
    this.store.dispatch(loadBuses({
      ...this.currentParams,
      page: event.pageIndex + 1,
      pageSize: event.pageSize,
    }));
  }

  openCreate() {
    this.dialog.open(BusFormDialogComponent, { data: {} })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((dto) => this.store.dispatch(createBus({ dto })));
  }

  openEdit(bus: Bus) {
    this.dialog.open(BusFormDialogComponent, { data: { bus } })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((dto) => this.store.dispatch(updateBus({ id: bus.id, dto })));
  }

  openAssignRoute(bus: Bus) {
    // Full route list (up to API max pageSize) is only needed for the assign dialog, not the grid.
    this.routeService
      .getAll({ page: 1, pageSize: 100, sortBy: 'name', sortDir: 'asc' })
      .pipe(take(1))
      .subscribe({
        next: (page) => {
          this.dialog
            .open(AssignRouteDialogComponent, {
              data: { busName: bus.name, routes: page.items, currentRouteId: bus.routeId },
            })
            .afterClosed()
            .subscribe((result?: { routeId: string | null }) => {
              if (!result) return;
              const newRouteId = result.routeId ?? null;
              const currentRouteId = bus.routeId ?? null;
              if (newRouteId === currentRouteId) return;
              if (newRouteId) {
                this.store.dispatch(assignRoute({ busId: bus.id, routeId: newRouteId }));
              } else {
                this.store.dispatch(unassignRoute({ busId: bus.id }));
              }
            });
        },
      });
  }

  confirmDelete(bus: Bus) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Delete bus "${bus.name}"?` }
    })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.store.dispatch(deleteBus({ id: bus.id })));
  }
}
