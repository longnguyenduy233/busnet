import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { busLocationReceived } from '../../store/tracking/tracking.actions';
import { BusLocation } from '../models/bus-location.model';
import { SignalRService } from './signalr.service';

// ── Shared mock state (vi.hoisted runs before vi.mock hoisting) ───────────────
const m = vi.hoisted(() => ({
  url:          '' as string,
  tokenFactory: null as (() => string) | null,
  reconnect:    null as any[] | null,
  handlers:     {} as Record<string, Function>,
  lifecycleHandlers: {} as Record<string, Function>,  // onreconnecting / onreconnected / onclose
  startCalled:  false,
  stopCalled:   false,
  state:        'Disconnected' as string,
}));

// ── @microsoft/signalr mock ───────────────────────────────────────────────────
// HubConnectionBuilder must be a class (constructable), not an arrow function.
vi.mock('@microsoft/signalr', () => ({
  HubConnectionBuilder: class MockHubConnectionBuilder {
    withUrl(url: string, opts: { accessTokenFactory: () => string }) {
      m.url          = url;
      m.tokenFactory = opts?.accessTokenFactory ?? null;
      return this;
    }
    withAutomaticReconnect(delays: any[]) {
      m.reconnect = delays;
      return this;
    }
    configureLogging() { return this; }
    build() {
      return {
        on(event: string, handler: Function)   { m.handlers[event] = handler; },
        onreconnecting(handler: Function)      { m.lifecycleHandlers['reconnecting'] = handler; },
        onreconnected(handler: Function)       { m.lifecycleHandlers['reconnected']  = handler; },
        onclose(handler: Function)             { m.lifecycleHandlers['close']        = handler; },
        start()  { m.startCalled = true; return Promise.resolve(); },
        stop()   { m.stopCalled  = true; return Promise.resolve(); },
        get state() { return m.state; },
      };
    }
  },
  HubConnectionState: { Connected: 'Connected', Disconnected: 'Disconnected' },
  LogLevel: { Warning: 1 },
}));

describe('SignalRService', () => {
  let service: SignalRService;
  let store: MockStore;

  beforeEach(async () => {
    // Reset shared mock state before each test
    m.url               = '';
    m.tokenFactory      = null;
    m.reconnect         = null;
    m.handlers          = {};
    m.lifecycleHandlers = {};
    m.startCalled       = false;
    m.stopCalled        = false;
    m.state             = 'Disconnected';

    await TestBed.configureTestingModule({
      providers: [SignalRService, provideMockStore()]
    }).compileComponents();

    service = TestBed.inject(SignalRService);
    store   = TestBed.inject(MockStore);
    vi.spyOn(store, 'dispatch');
  });

  afterEach(() => vi.clearAllMocks());

  // ── start() — connection setup ─────────────────────────────────────────────

  it('connects to the /tracking hub endpoint', () => {
    service.start('tok');
    expect(m.url).toContain('/tracking');
  });

  it('passes an accessTokenFactory that returns the given token', () => {
    service.start('my-jwt');
    expect(m.tokenFactory?.()).toBe('my-jwt');
  });

  it('configures automatic reconnect with a delay list', () => {
    service.start('tok');
    expect(Array.isArray(m.reconnect)).toBe(true);
    expect(m.reconnect!.length).toBeGreaterThan(0);
  });

  it('calls connection.start()', () => {
    service.start('tok');
    expect(m.startCalled).toBe(true);
  });

  it('registers a ReceiveBusLocation handler on the connection', () => {
    service.start('tok');
    expect(m.handlers['ReceiveBusLocation']).toBeTypeOf('function');
  });

  it('does not start a second connection when already connected', () => {
    service.start('tok');       // first call — creates the connection
    m.startCalled = false;      // reset flag to isolate second call
    m.state = 'Connected';      // mark connection as established
    service.start('tok');       // second call — guard should short-circuit
    expect(m.startCalled).toBe(false);
  });

  // ── ReceiveBusLocation handler ─────────────────────────────────────────────

  it('dispatches busLocationReceived when ReceiveBusLocation fires', () => {
    service.start('tok');
    const location: BusLocation = {
      busId: 'bus-1', latitude: 10.7769, longitude: 106.7009,
      timestamp: '2026-04-29T00:00:00Z'
    };
    m.handlers['ReceiveBusLocation'](location);
    expect(store.dispatch).toHaveBeenCalledWith(busLocationReceived({ location }));
  });

  it('dispatches with correct busId, latitude and longitude', () => {
    service.start('tok');
    const location: BusLocation = {
      busId: 'bus-42', latitude: 10.8, longitude: 106.8,
      timestamp: '2026-04-29T00:00:00Z'
    };
    m.handlers['ReceiveBusLocation'](location);

    const action = (store.dispatch as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(action.location.busId).toBe('bus-42');
    expect(action.location.latitude).toBe(10.8);
    expect(action.location.longitude).toBe(106.8);
  });

  it('dispatches once per received event', () => {
    service.start('tok');
    const loc = (id: string): BusLocation =>
      ({ busId: id, latitude: 10, longitude: 106, timestamp: '' });

    m.handlers['ReceiveBusLocation'](loc('bus-1'));
    m.handlers['ReceiveBusLocation'](loc('bus-2'));
    m.handlers['ReceiveBusLocation'](loc('bus-3'));

    expect(store.dispatch).toHaveBeenCalledTimes(3);
  });

  // ── stop() ────────────────────────────────────────────────────────────────

  it('calls connection.stop() when the connection is active', () => {
    service.start('tok');
    m.state = 'Connected';
    service.stop();
    expect(m.stopCalled).toBe(true);
  });

  it('does not call connection.stop() when already disconnected', () => {
    service.start('tok');
    m.state = 'Disconnected';
    service.stop();
    expect(m.stopCalled).toBe(false);
  });

  it('does not throw if stop() is called before start()', () => {
    expect(() => service.stop()).not.toThrow();
  });

  // ── ngOnDestroy ───────────────────────────────────────────────────────────

  it('calls stop() on ngOnDestroy', () => {
    service.start('tok');
    m.state = 'Connected';
    const stopSpy = vi.spyOn(service, 'stop');
    service.ngOnDestroy();
    expect(stopSpy).toHaveBeenCalled();
  });

  // ── Phase 9: status$ observable ──────────────────────────────────────────

  it('status$ starts as disconnected', () => {
    const statuses: string[] = [];
    service.status$.subscribe((s) => statuses.push(s));
    expect(statuses[0]).toBe('disconnected');
  });

  it('status$ emits "connected" after start() resolves', async () => {
    const statuses: string[] = [];
    service.status$.subscribe((s) => statuses.push(s));
    service.start('tok');
    await Promise.resolve(); // flush the .then() from start()
    expect(statuses).toContain('connected');
  });

  it('registers onreconnecting handler on the connection', () => {
    service.start('tok');
    expect(m.lifecycleHandlers['reconnecting']).toBeTypeOf('function');
  });

  it('status$ emits "reconnecting" when the hub fires onreconnecting', () => {
    const statuses: string[] = [];
    service.status$.subscribe((s) => statuses.push(s));
    service.start('tok');
    m.lifecycleHandlers['reconnecting']();
    expect(statuses).toContain('reconnecting');
  });

  it('registers onreconnected handler on the connection', () => {
    service.start('tok');
    expect(m.lifecycleHandlers['reconnected']).toBeTypeOf('function');
  });

  it('status$ emits "connected" when the hub fires onreconnected', () => {
    const statuses: string[] = [];
    service.status$.subscribe((s) => statuses.push(s));
    service.start('tok');
    m.lifecycleHandlers['reconnected']();
    expect(statuses).toContain('connected');
  });

  it('registers onclose handler on the connection', () => {
    service.start('tok');
    expect(m.lifecycleHandlers['close']).toBeTypeOf('function');
  });

  it('status$ emits "disconnected" when the hub fires onclose', () => {
    const statuses: string[] = [];
    service.status$.subscribe((s) => statuses.push(s));
    service.start('tok');
    m.lifecycleHandlers['reconnected'](); // pretend connected first
    m.lifecycleHandlers['close']();
    expect(statuses.at(-1)).toBe('disconnected');
  });

  it('status$ emits "disconnected" when stop() is called', async () => {
    const statuses: string[] = [];
    service.status$.subscribe((s) => statuses.push(s));
    service.start('tok');
    await Promise.resolve();
    m.state = 'Connected';
    service.stop();
    expect(statuses.at(-1)).toBe('disconnected');
  });
});
