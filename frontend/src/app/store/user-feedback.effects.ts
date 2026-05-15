import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MatSnackBar } from '@angular/material/snack-bar';
import { tap } from 'rxjs/operators';
import { loginSuccess } from './auth/auth.actions';
import {
  assignRouteSuccess,
  createBusSuccess,
  deleteBusSuccess,
  unassignRouteSuccess,
  updateBusSuccess,
} from './bus/bus.actions';
import {
  createRouteSuccess,
  deleteRouteSuccess,
  updateRouteSuccess,
} from './route/route.actions';

/** User-visible feedback for mutations and login. Intentionally excludes load/refetch/update-token actions to avoid noisy toasts. */
function successMessage(action: unknown): string {
  if (!(typeof action === 'object' && action && 'type' in action))
    return 'Done.';
  switch ((action as { type: string }).type) {
    case loginSuccess.type: {
      const a = action as ReturnType<typeof loginSuccess>;
      return `Signed in${a.displayName ? ` — ${a.displayName}` : ''}.`;
    }
    case createBusSuccess.type:
      return `Bus "${(action as ReturnType<typeof createBusSuccess>).bus.name}" created.`;
    case updateBusSuccess.type:
      return `Bus "${(action as ReturnType<typeof updateBusSuccess>).bus.name}" saved.`;
    case deleteBusSuccess.type:
      return 'Bus deleted.';
    case assignRouteSuccess.type: {
      const b = (action as ReturnType<typeof assignRouteSuccess>).bus;
      const r = b.routeName?.trim();
      return r
        ? `Route "${r}" assigned to "${b.name}".`
        : `Route assigned to "${b.name}".`;
    }
    case unassignRouteSuccess.type:
      return `Route unassigned from "${(action as ReturnType<typeof unassignRouteSuccess>).bus.name}".`;
    case createRouteSuccess.type:
      return `Route "${(action as ReturnType<typeof createRouteSuccess>).route.name}" created.`;
    case updateRouteSuccess.type:
      return `Route "${(action as ReturnType<typeof updateRouteSuccess>).route.name}" saved.`;
    case deleteRouteSuccess.type:
      return 'Route deleted.';
    default:
      return 'Done.';
  }
}

@Injectable()
export class UserFeedbackEffects {
  private readonly actions$ = inject(Actions);
  private readonly snackBar = inject(MatSnackBar);

  showSuccessSnack$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          loginSuccess,
          createBusSuccess,
          updateBusSuccess,
          deleteBusSuccess,
          assignRouteSuccess,
          unassignRouteSuccess,
          createRouteSuccess,
          updateRouteSuccess,
          deleteRouteSuccess
        ),
        tap((action) => {
          this.snackBar.open(successMessage(action), 'Dismiss', {
            duration: 4000,
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
          });
        })
      ),
    { dispatch: false }
  );
}
