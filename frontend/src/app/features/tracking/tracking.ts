import {
  AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef,
  inject, NgZone, OnDestroy, OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Sort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Store } from '@ngrx/store';
import * as L from 'leaflet';
import 'leaflet-polylinedecorator';
import { BehaviorSubject, combineLatest, of, Subscription } from 'rxjs';
import { map, distinctUntilChanged, switchMap, catchError, take } from 'rxjs/operators';
import { Bus, BusQueryParams } from '../../core/models/bus.model';
import { Route } from '../../core/models/route.model';
import { RouteService } from '../../core/services/route.service';
import { SignalRService } from '../../core/services/signalr.service';
import {
  clearTrackingMapSelection,
  fetchBusForTrackingMap,
  loadBuses,
  removeBusFromTrackingMap,
} from '../../store/bus/bus.actions';
import {
  selectAllBuses,
  selectBusesForMap,
  selectBusLoading,
  selectBusPage,
  selectBusPageSize,
  selectBusPagination,
  selectBusSortBy,
  selectBusSortDir,
  selectBusTotal,
} from '../../store/bus/bus.selectors';
import { selectToken } from '../../store/auth/auth.selectors';
import { selectTrackingEntities } from '../../store/tracking/tracking.selectors';
import { BusTrackingEntry, GeoPoint } from '../../store/tracking/tracking.reducer';
import { environment } from '../../../environments/environment';

// ── Pure utility functions ────────────────────────────────────────────────────

/**
 * Calculates the compass bearing (0–360°) from one lat/lng point to another.
 * 0° = north, 90° = east, 180° = south, 270° = west.
 */
export function calculateBearing(
  from: [number, number],
  to: [number, number]
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const lat1 = toRad(from[0]);
  const lat2 = toRad(to[0]);
  const dLng = toRad(to[1] - from[1]);
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

/** Smooth ease-in-out curve: t must be in [0, 1]. */
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * Creates a Leaflet DivIcon containing the school-bus SVG rotated to `bearing`.
 * The SVG is naturally oriented upward (north), so bearing 0 = no rotation.
 */
export function createBusIcon(bearing: number): L.DivIcon {
  return L.divIcon({
    html: `<img src="school-bus.svg"
                style="width:15px;height:32px;
                       transform:rotate(${bearing.toFixed(1)}deg);
                       transform-origin:center;
                       display:block;">`,
    iconSize:    [15, 32],
    iconAnchor:  [8, 16],   // centre of the icon (rotation pivot)
    popupAnchor: [0, -16],
    className:   'bus-marker'
  });
}

// ── Constants ─────────────────────────────────────────────────────────────────

/** Fallback mock positions around default map centre used before real GPS arrives. */
const MOCK_POSITIONS: [number, number][] = [
  [36.845803, -76.196481],
  [36.854003, -76.200681],
  [36.860903, -76.183081],
  [36.836903, -76.208081],
  [36.869903, -76.177081],
  [36.841903, -76.167081],
  [36.828903, -76.192081],
  [36.858903, -76.217081],
  [36.873903, -76.202081],
  [36.850903, -76.172081],
];

const MAP_CENTER: [number, number] = [36.845803, -76.196481];

/** Chevrons on planned + live trails from this zoom upward (fewer arrows when zoomed out). */
const ARROW_DECORATOR_MIN_ZOOM = 18;

/** Animation duration in ms — intentionally shorter than the 1 s update interval. */
const ANIM_DURATION_MS = 800;

/** Live GPS history trail styling (solid blue + arrows in updatePath). */
const GPS_TRAIL_COLOR = 'rgba(21, 101, 192, 0.7)';
const GPS_TRAIL_WEIGHT = 3;
const GPS_TRAIL_ARROW = '#1565c0';

/** Stroke-only path options for open chevrons (paired with `polygon: false` on arrowHead). */
function hollowArrowPathOptions(color: string): L.PathOptions {
  return {
    fill: false,
    stroke: true,
    color,
    weight: 2.5,
    opacity: 1,
  };
}

/** leaflet-polylinedecorator: `polygon: false` → open chevron (two strokes meeting at tip), not filled triangle. */
function chevronArrowSymbol(pixelSize: number, strokeColor: string) {
  return L.Symbol.arrowHead({
    polygon: false,
    pixelSize,
    pathOptions: hollowArrowPathOptions(strokeColor),
  });
}

/**
 * Planned route from assignment (`Bus.routeId` → `Route.points`) — dashed purple,
 * layered under the GPS trail. Arrow tint matches polyline stroke.
 */
const PLANNED_ROUTE_ARROW = '#7b1fa2';

const PLANNED_ROUTE_STYLE: L.PathOptions = {
  color: '#7b1fa2',
  weight: 4,
  opacity: 0.88,
  dashArray: '10 14',
  lineJoin: 'round',
};

/** Sidebar header checkbox: rows on this page opted onto the map vs not (mixed → indeterminate). */
export function mapHeaderCheckboxTriState(
  sidebarPageBuses: Bus[],
  mapRosterBusIds: ReadonlySet<string>
): boolean | null {
  if (!sidebarPageBuses.length) return true;
  let onMap = 0;
  for (const b of sidebarPageBuses) {
    if (mapRosterBusIds.has(b.id)) onMap++;
  }
  if (onMap === sidebarPageBuses.length) return true;
  if (onMap === 0) return false;
  return null;
}

// ── Component ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-tracking',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './tracking.html',
  styleUrl: './tracking.scss'
})
export class TrackingComponent implements OnInit, AfterViewInit, OnDestroy {
  private store = inject(Store);
  private zone  = inject(NgZone);
  private destroyRef = inject(DestroyRef);
  private routeService = inject(RouteService);
  private signalR = inject(SignalRService);

  loading$       = this.store.select(selectBusLoading);
  signalRStatus$ = this.signalR.status$;

  total$    = this.store.select(selectBusTotal);
  page$     = this.store.select(selectBusPage);
  pageSize$ = this.store.select(selectBusPageSize);
  sortBy$   = this.store.select(selectBusSortBy);
  sortDir$  = this.store.select(selectBusSortDir);

  /**
   * Route geometries for assigned `routeId`s on the map roster (POST /routes/by-ids).
   * Kept out of NgRx so the Routes admin list paging never drops tracking overlays.
   */
  private readonly assignmentRoutes = new Map<string, Route>();
  /** Invalidates combineLatest when by-ids fetch completes so planned polylines re-render. */
  private readonly assignmentRoutesVersion = new BehaviorSubject(0);

  /** Map overlay toggles — combined into `combineLatest` so Leaflet retriggers rendering. */
  readonly mapShowPlannedRoute$ = new BehaviorSubject(true);
  readonly mapShowLiveGpsLayers$ = new BehaviorSubject(true);

  /**
   * Snapshot of the last-seen tracking entities.
   * Used to skip marker updates for buses whose position has not changed.
   */
  private prevEntities: { [busId: string]: BusTrackingEntry } = {};

  sidebarVm$ = combineLatest([
    this.store.select(selectAllBuses),
    this.store.select(selectBusesForMap),
    this.store.select(selectTrackingEntities),
    this.store.select(selectBusTotal),
    this.store.select(selectBusPage),
    this.store.select(selectBusPageSize),
    this.store.select(selectBusSortBy),
    this.store.select(selectBusSortDir),
  ]).pipe(
    map(([sidebarBuses, mapBuses, entities, total, page, pageSize, sortBy, sortDir]) => {
      const mapBusIds = new Set(mapBuses.map((b) => b.id));
      return {
        sidebarBuses,
        mapBuses,
        mapBusIds,
        entities,
        headerMapCheckboxState: mapHeaderCheckboxTriState(sidebarBuses, mapBusIds),
        total,
        page,
        pageSize,
        sortBy,
        sortDir,
      };
    })
  );

  /** Latest sidebar query (for dispatches); kept in sync with store pagination. */
  private sidebarParams: BusQueryParams = {
    page: 1,
    pageSize: 10,
    sortBy: 'name',
    sortDir: 'asc',
    status: 'Active',
  };

  constructor() {
    this.store
      .select(selectBusPagination)
      .pipe(takeUntilDestroyed())
      .subscribe((p) => {
        this.sidebarParams = p;
      });

    this.store
      .select(selectBusesForMap)
      .pipe(
        map((buses) =>
          [...new Set(buses.map((b) => b.routeId).filter((id): id is string => !!id))].sort()
        ),
        distinctUntilChanged((a, b) => a.join('\0') === b.join('\0')),
        switchMap((ids) =>
          ids.length === 0
            ? of([] as Route[])
            : this.routeService.getByRouteIds(ids).pipe(catchError(() => of([] as Route[])))
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((routes) => {
        this.assignmentRoutes.clear();
        for (const r of routes) {
          this.assignmentRoutes.set(r.id, r);
        }
        const v = this.assignmentRoutesVersion.getValue();
        this.assignmentRoutesVersion.next(v + 1);
      });
  }

  displayedSidebarColumns = ['map', 'name', 'route', 'status', 'focus'];

  private map!: L.Map;
  private markers = new Map<string, L.Marker>();
  /** Live GPS trails (history points). */
  private polylines = new Map<string, L.Polyline>();
  /** Assigned route geometry from `Bus.routeId` → `Route.points` (planned path). */
  private plannedPolylines = new Map<string, L.Polyline>();
  /** Direction arrows along planned-route polylines (layered below live GPS). */
  private plannedDecorators = new Map<
    string,
    L.Layer & { remove(): L.Layer & { remove(): unknown } }
  >();
  /** Polyline decorator (direction arrows) on GPS trails only. */
  private decorators = new Map<string, L.Layer & { remove(): L.Layer & { remove(): unknown } }>();
  /** Active requestAnimationFrame IDs — cancelled on next update for same bus. */
  private animFrames = new Map<string, number>();
  /**
   * Last `coordsFor` result applied to each marker (not Leaflet’s animated midpoint).
   * Used so async route geometry updates resync the marker without comparing `getLatLng`
   * (avoids spurious moves when only overlay toggles rerender).
   */
  private lastLogicalTargetByBusId = new Map<string, [number, number]>();

  /** Map render subscription owned by initMap until destroy (bus + tracking + overlays). */
  private sub!: Subscription;

  /** Stable handler ref so `map.off('zoomend', …)` matches `map.on`. */
  private readonly onMapZoomEnd: L.LeafletEventHandlerFn = () => {
    this.syncArrowDecoratorsToZoom();
  };

  ngOnInit(): void {
    // Sidebar fleet only until the user selects rows for the map (GET /buses/:id per selection).
    this.store.dispatch(
      loadBuses({ page: 1, pageSize: 10, sortBy: 'name', sortDir: 'asc', status: 'Active' })
    );
    // Reconnect SignalR whenever the JWT changes (silent refresh rotates the hub access_token query).
    this.store
      .select(selectToken)
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((token) => {
        if (token) {
          this.signalR.stop();
          this.signalR.start(token);
        } else {
          this.signalR.stop();
        }
      });
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => this.initMap());
  }

  ngOnDestroy(): void {
    // Drop opted-in roster so returning to Tracking starts with no GET-by-id prefetch state.
    this.store.dispatch(clearTrackingMapSelection());

    // Cancel any in-flight animations
    this.animFrames.forEach((id) => cancelAnimationFrame(id));
    this.animFrames.clear();
    this.decorators.forEach((d) => d.remove());
    this.decorators.clear();
    this.polylines.forEach((p) => p.remove());
    this.polylines.clear();
    this.plannedDecorators.forEach((d) => d.remove());
    this.plannedDecorators.clear();
    this.plannedPolylines.forEach((p) => p.remove());
    this.plannedPolylines.clear();
    this.sub?.unsubscribe();
    this.map?.off('zoomend', this.onMapZoomEnd);
    this.map?.remove();
    this.signalR.stop();
  }

  // ── Map initialisation ─────────────────────────────────────────────────────

  private initMap(): void {
    // Google Mutant disables Google Maps UI (`disableDefaultUI`); hide Leaflet's +/- too (scroll/wheel pinch still zoom).
    this.map = L.map('tracking-map', { zoomControl: false })
      .setView(MAP_CENTER, 13);

    this.addTileLayer();

    this.sub = combineLatest([
      this.store.select(selectBusesForMap),
      this.store.select(selectTrackingEntities),
      this.assignmentRoutesVersion,
      this.mapShowPlannedRoute$,
      this.mapShowLiveGpsLayers$,
    ]).subscribe(([buses, entities, , showPlanned, showLiveGps]) =>
      this.zone.runOutsideAngular(() =>
        this.renderMarkers(buses, entities, { showPlanned, showLiveGps })
      )
    );

    // Sidebar reduces map width synchronously — refresh Leaflet's size once tiles mount.
    this.map.invalidateSize();

    this.map.on('zoomend', this.onMapZoomEnd);
  }

  private addTileLayer(): void {
    const apiKey = environment.googleMapsApiKey;
    if (apiKey) {
      this.loadGoogleMapsScript(apiKey)
        .then(() => import('leaflet.gridlayer.googlemutant'))
        .then((mod) => {
          const GoogleMutant = (mod as any).default ?? mod;
          new GoogleMutant({ type: 'roadmap' }).addTo(this.map);
        })
        .catch(() => this.addOsmLayer());
    } else {
      this.addOsmLayer();
    }
  }

  private addOsmLayer(): void {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);
  }

  private loadGoogleMapsScript(apiKey: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any)['google']?.maps) { resolve(); return; }
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.onload  = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Maps API'));
      document.head.appendChild(script);
    });
  }

  /**
   * Per-row checkbox: opt bus onto Tracking map roster (GET /buses/:id) or remove without extra fetch.
   */
  onMapVisibilityChange(busId: string, checked: boolean): void {
    if (checked) {
      this.store.dispatch(fetchBusForTrackingMap({ busId }));
    } else {
      this.store.dispatch(removeBusFromTrackingMap({ busId }));
    }
  }

  /** Sidebar / global layer: dashed itinerary + directional chevrons. */
  setMapShowPlannedRoute(checked: boolean): void {
    if (this.mapShowPlannedRoute$.value !== checked) {
      this.mapShowPlannedRoute$.next(checked);
    }
  }

  /** Sidebar / global layer: bus markers, live trails, GPS chevron decorators (planned routes unaffected). */
  setMapShowLiveGpsLayers(checked: boolean): void {
    if (this.mapShowLiveGpsLayers$.value !== checked) {
      this.mapShowLiveGpsLayers$.next(checked);
    }
  }

  /** Toolbar icon clicks — flip visibility without syncing from async pipe math in the template. */
  toggleMapShowPlannedRoute(): void {
    this.setMapShowPlannedRoute(!this.mapShowPlannedRoute$.value);
  }

  toggleMapShowLiveGpsLayers(): void {
    this.setMapShowLiveGpsLayers(!this.mapShowLiveGpsLayers$.value);
  }

  /**
   * Header checkbox: checked ⇒ opt every row on this sidebar page onto the map (fetch IDs not yet rostered).
   */
  onHeaderMapVisibilityChange(checked: boolean, buses: Bus[]): void {
    if (!buses.length) return;
    if (checked) {
      this.store
        .select(selectBusesForMap)
        .pipe(take(1))
        .subscribe((roster) => {
          const onMap = new Set(roster.map((b) => b.id));
          for (const b of buses) {
            if (!onMap.has(b.id)) {
              this.store.dispatch(fetchBusForTrackingMap({ busId: b.id }));
            }
          }
        });
    } else {
      buses.forEach((b) => this.store.dispatch(removeBusFromTrackingMap({ busId: b.id })));
    }
  }

  /** Server-side sorting for the sidebar table (does not affect map roster sorting). */
  onSidebarSortChange(sort: Sort): void {
    this.store.dispatch(
      loadBuses({
        ...this.sidebarParams,
        page: 1,
        sortBy: sort.active || 'name',
        sortDir: (sort.direction as 'asc' | 'desc') || 'asc',
      })
    );
  }

  /** Server-side paging for the sidebar table. */
  onSidebarPageChange(event: PageEvent): void {
    this.store.dispatch(
      loadBuses({
        ...this.sidebarParams,
        page: event.pageIndex + 1,
        pageSize: event.pageSize,
      })
    );
  }

  centerMapOnBus(bus: Bus, allBuses: Bus[], entities: { [busId: string]: BusTrackingEntry }): void {
    if (!this.map) return;
    const idx = allBuses.findIndex((b) => b.id === bus.id);
    const listIdx = idx >= 0 ? idx : 0;
    const routesById = new Map(this.assignmentRoutes);
    const pos = this.coordsFor(bus, entities[bus.id], listIdx, routesById);
    const z = Math.max(this.map.getZoom() ?? 13, 15);
    this.map.setView(pos, z);
    const marker = this.markers.get(bus.id);
    // Marker exists only while the bus is shown on the map; map still pans when hidden.
    marker?.openPopup();
  }

  // ── Marker rendering ───────────────────────────────────────────────────────

  /** First route vertex (sorted by point `order`), for pre‑GPS placement on the itinerary. */
  private routeStartLatLng(bus: Bus, routesById: Map<string, Route>): [number, number] | null {
    const rid = bus.routeId ?? null;
    if (!rid) return null;
    const route = routesById.get(rid);
    if (!route?.points?.length) return null;
    const ordered = [...route.points].sort((a, b) => a.order - b.order);
    const p = ordered[0];
    return p ? [p.latitude, p.longitude] : null;
  }

  private coordsFor(
    bus: Bus,
    tracking: BusTrackingEntry | undefined,
    listIndexInAllBuses: number,
    routesById: Map<string, Route>
  ): [number, number] {
    const start = this.routeStartLatLng(bus, routesById);
    const hasRenderableTrail =
      !!tracking && tracking.history.length >= 2;

    // Assigned route: keep the bus icon on departure until SignalR supplies enough history to draw a trail.
    if (!hasRenderableTrail && start) {
      return start;
    }
    if (tracking) {
      return [tracking.currentPosition.latitude, tracking.currentPosition.longitude];
    }
    if (start) return start;
    return MOCK_POSITIONS[listIndexInAllBuses % MOCK_POSITIONS.length];
  }

  /** Keep live GPS overlays above planned route lines for the same bus. */
  private raiseGpsTrailAbovePlanned(busId: string): void {
    const trail = this.polylines.get(busId);
    const bring = trail as unknown as { bringToFront?: () => void } | undefined;
    bring?.bringToFront?.();
    const dec = this.decorators.get(busId);
    (dec as unknown as { bringToFront?: () => void } | undefined)?.bringToFront?.();
  }

  /** Open chevrons at zoom >= `ARROW_DECORATOR_MIN_ZOOM` only (omit when zoomed out). */
  private polylineDecoratorsShownAtCurrentZoom(): boolean {
    return !!this.map && this.map.getZoom() >= ARROW_DECORATOR_MIN_ZOOM;
  }

  /**
   * Polylines always render; leaflet-polylinedecorator layers follow zoom so arrows aren’t piled on when zoomed out.
   * Invoked from `zoomend` (outside Angular, like the store-driven map render subscription).
   */
  private syncArrowDecoratorsToZoom(): void {
    if (!this.map) return;

    this.plannedPolylines.forEach((pl, busId) => {
      const latlngs = pl.getLatLngs() as L.LatLng[];
      this.refreshPlannedRouteDecorator(busId, latlngs?.length ?? 0);
    });

    const showChevrons = this.polylineDecoratorsShownAtCurrentZoom();
    this.polylines.forEach((_poly, busId) => {
      if (showChevrons) {
        this.attachLiveTrailDecorator(busId);
      } else {
        const layer = this.decorators.get(busId);
        if (layer) {
          layer.remove();
          this.decorators.delete(busId);
        }
      }
    });

    this.polylines.forEach((_line, busId) => this.raiseGpsTrailAbovePlanned(busId));
  }

  private attachLiveTrailDecorator(busId: string): void {
    const polyline = this.polylines.get(busId);
    if (!polyline) return;
    const latlngs = polyline.getLatLngs() as L.LatLng[];
    if (!latlngs || latlngs.length < 2) return;

    const prior = this.decorators.get(busId);
    if (prior) {
      prior.remove();
      this.decorators.delete(busId);
    }

    const decorator = L.polylineDecorator(polyline, {
      patterns: [{
        offset: '12%',
        repeat: '25%',
        symbol: chevronArrowSymbol(6, GPS_TRAIL_ARROW),
      }],
    }).addTo(this.map);
    this.decorators.set(
      busId,
      decorator as unknown as L.Layer & { remove(): L.Layer & { remove(): unknown } }
    );
  }

  private syncPlannedRoutePolyline(bus: Bus, routesById: Map<string, Route>): void {
    const rid = bus.routeId ?? null;
    const route = rid ? routesById.get(rid) : undefined;
    const ordered = route?.points ? [...route.points].sort((a, b) => a.order - b.order) : [];
    const latlngs: [number, number][] = ordered.map((p) => [p.latitude, p.longitude]);

    const existing = this.plannedPolylines.get(bus.id);
    if (latlngs.length < 2) {
      this.removePlannedPolyline(bus.id);
      return;
    }

    if (existing) {
      existing.setLatLngs(latlngs);
    } else {
      const pl = L.polyline(latlngs, PLANNED_ROUTE_STYLE).addTo(this.map);
      this.plannedPolylines.set(bus.id, pl);
    }
    // Rebuild decorator so arrows follow dashed polyline edits (mirror updatePath GPS flow).
    this.refreshPlannedRouteDecorator(bus.id, latlngs.length);
    this.raiseGpsTrailAbovePlanned(bus.id);
  }

  /** Arrows along the dashed planned path; recreated when vertices change like the GPS trail. */
  private refreshPlannedRouteDecorator(busId: string, vertexCount: number): void {
    const old = this.plannedDecorators.get(busId);
    if (old) {
      old.remove();
      this.plannedDecorators.delete(busId);
    }
    const pl = this.plannedPolylines.get(busId);
    if (!pl || vertexCount < 2) return;
    if (!this.polylineDecoratorsShownAtCurrentZoom()) return;

    const decorator = L.polylineDecorator(pl, {
      patterns: [
        {
          offset: '12%',
          repeat: '25%',
          symbol: chevronArrowSymbol(13, PLANNED_ROUTE_ARROW),
        },
      ],
    }).addTo(this.map);
    this.plannedDecorators.set(
      busId,
      decorator as unknown as L.Layer & { remove(): L.Layer & { remove(): unknown } }
    );
  }

  private removePlannedPolyline(busId: string): void {
    const dec = this.plannedDecorators.get(busId);
    if (dec) {
      dec.remove();
      this.plannedDecorators.delete(busId);
    }
    const pl = this.plannedPolylines.get(busId);
    if (pl) {
      pl.remove();
      this.plannedPolylines.delete(busId);
    }
  }

  /** Drops live marker, RAF, GPS polyline/chevons only (planned-route layers untouched). */
  private removeMarkerAndLiveTrail(busId: string): void {
    const frame = this.animFrames.get(busId);
    if (frame !== undefined) cancelAnimationFrame(frame);
    this.animFrames.delete(busId);
    this.removePath(busId);
    this.lastLogicalTargetByBusId.delete(busId);
    const m = this.markers.get(busId);
    if (m) {
      m.remove();
      this.markers.delete(busId);
    }
  }

  private renderMarkers(
    buses: Bus[],
    trackingEntities: { [busId: string]: BusTrackingEntry },
    opts: { showPlanned: boolean; showLiveGps: boolean }
  ): void {
    const seen = new Set<string>();
    const routesById = new Map(this.assignmentRoutes);

    buses.forEach((bus, idx) => {
      seen.add(bus.id);
      const tracking     = trackingEntities[bus.id];
      const prevTracking = this.prevEntities[bus.id];
      // NgRx immutable updates mean a changed reference == new GPS data.
      const trackingChanged = tracking !== prevTracking;

      const targetPos = this.coordsFor(bus, tracking, idx, routesById);

      if (!opts.showLiveGps) {
        this.removeMarkerAndLiveTrail(bus.id);
      } else {
        // ── Path: drawn whenever tracking data carries new history points ────
        if (trackingChanged && tracking && tracking.history.length >= 2) {
          this.updatePath(bus.id, tracking.history);
        }

        if (!this.markers.has(bus.id)) {
          const marker = L.marker(targetPos, { icon: createBusIcon(0) })
            .bindPopup(this.buildPopup(bus, tracking, routesById))
            .addTo(this.map);
          this.markers.set(bus.id, marker);
          this.lastLogicalTargetByBusId.set(bus.id, targetPos);
          if (tracking && tracking.history.length >= 2 && !trackingChanged) {
            this.updatePath(bus.id, tracking.history);
          }
        } else {
          const marker = this.markers.get(bus.id)!;
          marker.setPopupContent(this.buildPopup(bus, tracking, routesById));

          const prevLogical = this.lastLogicalTargetByBusId.get(bus.id);
          const logicalTargetChanged =
            prevLogical === undefined ||
            Math.abs(prevLogical[0] - targetPos[0]) > 1e-6 ||
            Math.abs(prevLogical[1] - targetPos[1]) > 1e-6;

          if (trackingChanged) {
            const hadLiveGps = !!prevTracking;
            const hasLiveGps = !!tracking;
            const firstLiveSnap = hasLiveGps && !hadLiveGps;

            if (firstLiveSnap) {
              const existingFrame = this.animFrames.get(bus.id);
              if (existingFrame !== undefined) cancelAnimationFrame(existingFrame);
              this.animFrames.delete(bus.id);
              marker.setLatLng(targetPos);
              marker.setIcon(createBusIcon(0));
              this.lastLogicalTargetByBusId.set(bus.id, targetPos);
            } else {
              const fromLatLng = marker.getLatLng();
              const bearing = calculateBearing(
                [fromLatLng.lat, fromLatLng.lng],
                targetPos
              );
              const existingFrame = this.animFrames.get(bus.id);
              if (existingFrame !== undefined) cancelAnimationFrame(existingFrame);

              marker.setIcon(createBusIcon(bearing));
              this.lastLogicalTargetByBusId.set(bus.id, targetPos);
              this.animateTo(bus.id, marker, fromLatLng, L.latLng(targetPos[0], targetPos[1]));
            }
          } else if (logicalTargetChanged) {
            // Usually async route `/by-ids` filling in after the marker was drawn at fallback coords.
            const existingFrame = this.animFrames.get(bus.id);
            if (existingFrame !== undefined) cancelAnimationFrame(existingFrame);
            this.animFrames.delete(bus.id);
            marker.setLatLng(targetPos);
            marker.setIcon(createBusIcon(0));
            this.lastLogicalTargetByBusId.set(bus.id, targetPos);
          }
        }
      }

      if (opts.showPlanned) {
        this.syncPlannedRoutePolyline(bus, routesById);
      } else {
        this.removePlannedPolyline(bus.id);
      }
    });

    // Persist the snapshot for the next render cycle comparison.
    this.prevEntities = trackingEntities;

    // Remove markers for buses no longer in the bus list
    this.markers.forEach((marker, id) => {
      if (!seen.has(id)) {
        const frame = this.animFrames.get(id);
        if (frame !== undefined) cancelAnimationFrame(frame);
        this.animFrames.delete(id);
        this.lastLogicalTargetByBusId.delete(id);
        this.removePath(id);
        this.removePlannedPolyline(id);
        marker.remove();
        this.markers.delete(id);
      }
    });
  }

  /**
   * Draws or updates the live GPS polyline path for a bus from its history points,
   * then attaches direction markers using open chevrons (`polygon: false`) along the trail.
   */
  private updatePath(busId: string, history: GeoPoint[]): void {
    const latlngs: [number, number][] = history.map(p => [p.latitude, p.longitude]);

    if (this.polylines.has(busId)) {
      this.polylines.get(busId)!.setLatLngs(latlngs);
    } else {
      const polyline = L.polyline(latlngs, {
        color: GPS_TRAIL_COLOR,
        weight: GPS_TRAIL_WEIGHT,
        lineJoin: 'round'
      }).addTo(this.map);
      this.polylines.set(busId, polyline);
    }

    const priorDec = this.decorators.get(busId);
    if (priorDec) priorDec.remove();
    this.decorators.delete(busId);

    if (latlngs.length >= 2 && this.polylineDecoratorsShownAtCurrentZoom()) {
      this.attachLiveTrailDecorator(busId);
    }

    this.raiseGpsTrailAbovePlanned(busId);
  }

  private removePath(busId: string): void {
    const decorator = this.decorators.get(busId);
    if (decorator) { decorator.remove(); this.decorators.delete(busId); }
    const polyline = this.polylines.get(busId);
    if (polyline) { polyline.remove(); this.polylines.delete(busId); }
  }

  /**
   * Smoothly animates `marker` from `from` to `to` using ease-in-out over
   * ANIM_DURATION_MS milliseconds via requestAnimationFrame.
   */
  private animateTo(
    busId: string,
    marker: L.Marker,
    from: L.LatLng,
    to: L.LatLng
  ): void {
    const startTime = performance.now();

    const step = (now: number) => {
      const raw   = Math.min((now - startTime) / ANIM_DURATION_MS, 1);
      const eased = easeInOut(raw);
      const lat   = from.lat + (to.lat - from.lat) * eased;
      const lng   = from.lng + (to.lng - from.lng) * eased;
      marker.setLatLng([lat, lng]);

      // Keep the polyline tip in sync with the marker so they move together
      const polyline = this.polylines.get(busId);
      if (polyline) {
        const pts = polyline.getLatLngs() as L.LatLng[];
        if (pts.length > 0) {
          pts[pts.length - 1] = L.latLng(lat, lng);
          polyline.setLatLngs(pts);
        }
      }

      if (raw < 1) {
        this.animFrames.set(busId, requestAnimationFrame(step));
      } else {
        this.animFrames.delete(busId);
      }
    };

    this.animFrames.set(busId, requestAnimationFrame(step));
  }

  private buildPopup(
    bus: Bus,
    tracking: BusTrackingEntry | undefined,
    routesById: Map<string, Route>
  ): string {
    const start = this.routeStartLatLng(bus, routesById);
    const hasRenderableTrail =
      !!tracking && tracking.history.length >= 2;
    const subtitle =
      !hasRenderableTrail && start
        ? 'Route departure'
        : tracking
          ? 'Live GPS'
          : start
            ? 'Route departure'
            : 'Mock position';
    return `
      <strong>${bus.name}</strong><br>
      ${bus.licensePlate} · ${bus.status}
      ${bus.routeId ? '<br>Route assigned' : ''}
      <br><small>${subtitle}</small>
    `;
  }
}
