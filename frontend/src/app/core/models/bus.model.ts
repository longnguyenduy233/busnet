export type BusStatus = 'Active' | 'Inactive';

export interface Bus {
  id: string;
  name: string;
  licensePlate: string;
  capacity: number;
  status: BusStatus;
  routeId?: string | null;
  /** Populated by the API when a route is assigned so list views do not need a separate routes query. */
  routeName?: string | null;
}

export interface CreateBusDto {
  name: string;
  licensePlate: string;
  capacity: number;
  status: BusStatus;
}

export type UpdateBusDto = CreateBusDto;

export interface BusQueryParams {
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
  /** When set, the API returns only buses with this status. */
  status?: BusStatus;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}
