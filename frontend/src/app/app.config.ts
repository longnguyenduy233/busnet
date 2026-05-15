import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { AuthEffects } from './store/auth/auth.effects';
import { authReducer } from './store/auth/auth.reducer';
import { BusEffects } from './store/bus/bus.effects';
import { busReducer } from './store/bus/bus.reducer';
import { RouteEffects } from './store/route/route.effects';
import { routeReducer } from './store/route/route.reducer';
import { trackingReducer } from './store/tracking/tracking.reducer';
import { UserFeedbackEffects } from './store/user-feedback.effects';

/** Everything in `appConfig` except zone-backed change detection (for TestBed without loading Zone.js). */
export const appEnvironmentProviders = [
  provideRouter(routes),
  // No provideAnimations* — those APIs are deprecated (use animate.enter/leave or CSS for app code).
  // Angular Material 21 uses CSS animation classes; this app has no @angular/animations triggers.
  importProvidersFrom(MatSnackBarModule),
  provideHttpClient(withInterceptors([authInterceptor])),
  provideStore({ auth: authReducer, buses: busReducer, routes: routeReducer, tracking: trackingReducer }),
  provideEffects([AuthEffects, BusEffects, RouteEffects, UserFeedbackEffects]),
  provideStoreDevtools({ maxAge: 25, logOnly: false })
];

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), ...appEnvironmentProviders]
};
