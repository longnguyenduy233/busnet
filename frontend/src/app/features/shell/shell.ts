import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { merge, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { logout } from '../../store/auth/auth.actions';
import { selectDisplayName } from '../../store/auth/auth.selectors';

function pathIsTrackingFromRouterUrl(fullUrl: string): boolean {
  const path = fullUrl.split(/[?#]/)[0];
  return path === '/tracking' || path.startsWith('/tracking/');
}

@Component({
  selector: 'app-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterOutlet, RouterLink, RouterLinkActive,
    MatToolbarModule, MatButtonModule, MatIconModule, MatTooltipModule
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss'
})
export class ShellComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);

  /** Tracking is full-bleed: hide `shell-main` scrollbar (sidebar/table keep their own overflow). */
  readonly isTrackingRoute = toSignal(
    merge(
      of(pathIsTrackingFromRouterUrl(this.router.url)),
      this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map((e) => pathIsTrackingFromRouterUrl(e.urlAfterRedirects))
      )
    ),
    { initialValue: pathIsTrackingFromRouterUrl(this.router.url) }
  );

  displayName$ = this.store.select(selectDisplayName);

  logout() {
    this.store.dispatch(logout());
  }
}
