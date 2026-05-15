import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Sort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs';
import { Route, RouteQueryParams } from '../../core/models/route.model';
import { createRoute, deleteRoute, loadRoutes, updateRoute } from '../../store/route/route.actions';
import {
  selectAllRoutes, selectRouteError, selectRouteLoading,
  selectRoutePage, selectRoutePageSize, selectRoutePagination,
  selectRouteSortBy, selectRouteSortDir, selectRouteTotal
} from '../../store/route/route.selectors';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { RouteFormDialogComponent } from './route-form-dialog';

@Component({
  selector: 'app-route',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    MatTableModule, MatSortModule, MatPaginatorModule,
    MatButtonModule, MatIconModule,
    MatProgressSpinnerModule, MatTooltipModule, MatChipsModule
  ],
  templateUrl: './route.html',
  styleUrl: './route.scss'
})
export class RouteComponent implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);

  loading$  = this.store.select(selectRouteLoading);
  error$    = this.store.select(selectRouteError);
  routes$   = this.store.select(selectAllRoutes);
  total$    = this.store.select(selectRouteTotal);
  page$     = this.store.select(selectRoutePage);
  pageSize$ = this.store.select(selectRoutePageSize);
  sortBy$   = this.store.select(selectRouteSortBy);
  sortDir$  = this.store.select(selectRouteSortDir);

  displayedColumns = ['name', 'pointCount', 'actions'];

  private currentParams: RouteQueryParams = { page: 1, pageSize: 10, sortBy: 'name', sortDir: 'asc' };

  constructor() {
    this.store.select(selectRoutePagination)
      .pipe(takeUntilDestroyed())
      .subscribe(params => { this.currentParams = params; });
  }

  ngOnInit() {
    this.store.dispatch(loadRoutes(this.currentParams));
  }

  onSortChange(sort: Sort) {
    this.store.dispatch(loadRoutes({
      ...this.currentParams,
      page: 1,
      sortBy: sort.active || 'name',
      sortDir: (sort.direction as 'asc' | 'desc') || 'asc',
    }));
  }

  onPageChange(event: PageEvent) {
    this.store.dispatch(loadRoutes({
      ...this.currentParams,
      page: event.pageIndex + 1,
      pageSize: event.pageSize,
    }));
  }

  openCreate() {
    this.dialog.open(RouteFormDialogComponent, { data: {} })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((dto) => this.store.dispatch(createRoute({ dto })));
  }

  openEdit(route: Route) {
    this.dialog.open(RouteFormDialogComponent, { data: { route } })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((dto) => this.store.dispatch(updateRoute({ id: route.id, dto })));
  }

  confirmDelete(route: Route) {
    this.dialog.open(ConfirmDialogComponent, {
      data: { message: `Delete route "${route.name}"?` }
    })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => this.store.dispatch(deleteRoute({ id: route.id })));
  }
}
