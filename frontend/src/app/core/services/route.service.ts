import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateRouteDto, PagedRouteResult, Route, RouteQueryParams, UpdateRouteDto } from '../models/route.model';

@Injectable({ providedIn: 'root' })
export class RouteService {
  private readonly url = `${environment.apiUrl}/routes`;

  constructor(private http: HttpClient) {}

  getAll(query: RouteQueryParams) {
    const params = new HttpParams()
      .set('page', query.page)
      .set('pageSize', query.pageSize)
      .set('sortBy', query.sortBy)
      .set('sortDir', query.sortDir);
    return this.http.get<PagedRouteResult>(this.url, { params });
  }

  /** Batch-load route geometries (e.g. map buses assigned routeId); not constrained by admin list paging. */
  getByRouteIds(routeIds: string[]): Observable<Route[]> {
    if (!routeIds.length) {
      return of([]);
    }
    return this.http.post<Route[]>(`${this.url}/by-ids`, { routeIds });
  }

  create(dto: CreateRouteDto) {
    return this.http.post<Route>(this.url, dto);
  }

  update(id: string, dto: UpdateRouteDto) {
    return this.http.put<Route>(`${this.url}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
