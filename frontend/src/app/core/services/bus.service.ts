import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Bus, BusQueryParams, CreateBusDto, PagedResult, UpdateBusDto } from '../models/bus.model';

@Injectable({ providedIn: 'root' })
export class BusService {
  private readonly url = `${environment.apiUrl}/buses`;

  constructor(private http: HttpClient) {}

  getAll(query: BusQueryParams) {
    let params = new HttpParams()
      .set('page', query.page)
      .set('pageSize', query.pageSize)
      .set('sortBy', query.sortBy)
      .set('sortDir', query.sortDir);
    if (query.status !== undefined)
      params = params.set('status', query.status);
    return this.http.get<PagedResult<Bus>>(this.url, { params });
  }

  getById(id: string) {
    return this.http.get<Bus>(`${this.url}/${id}`);
  }

  create(dto: CreateBusDto) {
    return this.http.post<Bus>(this.url, dto);
  }

  update(id: string, dto: UpdateBusDto) {
    return this.http.put<Bus>(`${this.url}/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  assignRoute(busId: string, routeId: string) {
    return this.http.put<Bus>(`${this.url}/${busId}/assign-route`, { routeId });
  }

  unassignRoute(busId: string) {
    return this.http.delete<Bus>(`${this.url}/${busId}/assign-route`);
  }
}
