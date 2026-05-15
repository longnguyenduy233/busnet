export interface RoutePoint {
  latitude: number;
  longitude: number;
  order: number;
}

export interface Route {
  id: string;
  name: string;
  points: RoutePoint[];
}

export interface CreateRouteDto {
  name: string;
  points: RoutePoint[];
}

export type UpdateRouteDto = CreateRouteDto;

export interface RouteQueryParams {
  page: number;
  pageSize: number;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}

export interface PagedRouteResult {
  items: Route[];
  totalCount: number;
  page: number;
  pageSize: number;
}
