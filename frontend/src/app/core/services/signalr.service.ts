import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel
} from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { BusLocation } from '../models/bus-location.model';
import { busLocationReceived } from '../../store/tracking/tracking.actions';
import { environment } from '../../../environments/environment';

export type SignalRStatus = 'connected' | 'reconnecting' | 'disconnected';

@Injectable({ providedIn: 'root' })
export class SignalRService implements OnDestroy {
  private store = inject(Store);
  private connection!: HubConnection;

  private readonly _status = new BehaviorSubject<SignalRStatus>('disconnected');
  /** Observable connection status — emits whenever the hub connects, reconnects or drops. */
  readonly status$ = this._status.asObservable();

  start(token: string): void {
    if (this.connection?.state === HubConnectionState.Connected) return;

    this.connection = new HubConnectionBuilder()
      .withUrl(`${environment.hubUrl}/tracking`, {
        accessTokenFactory: () => token
      })
      // Retry delays: immediate, 2 s, 5 s, 10 s, then 30 s indefinitely
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build();

    this.connection.on('ReceiveBusLocation', (location: BusLocation) => {
      this.store.dispatch(busLocationReceived({ location }));
    });

    this.connection.onreconnecting(() => this._status.next('reconnecting'));
    this.connection.onreconnected(() => this._status.next('connected'));
    this.connection.onclose(() => this._status.next('disconnected'));

    this.connection
      .start()
      .then(() => this._status.next('connected'))
      .catch((err) => {
        console.error('[SignalR] Connection failed:', err);
        this._status.next('disconnected');
      });
  }

  stop(): void {
    if (
      this.connection &&
      this.connection.state !== HubConnectionState.Disconnected
    ) {
      this.connection.stop();
    }
    this._status.next('disconnected');
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
