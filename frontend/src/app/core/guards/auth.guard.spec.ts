import { provideRouter, Router, UrlTree } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { authGuard } from './auth.guard';
import { selectIsLoggedIn } from '../../store/auth/auth.selectors';
import { firstValueFrom, isObservable, of } from 'rxjs';

async function runGuard(isLoggedIn: boolean): Promise<boolean | UrlTree> {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      provideMockStore({
        selectors: [{ selector: selectIsLoggedIn, value: isLoggedIn }]
      })
    ]
  });

  const result = TestBed.runInInjectionContext(() =>
    authGuard({} as any, {} as any)
  );

  if (isObservable(result)) return firstValueFrom(result as any);
  return result as boolean | UrlTree;
}

describe('authGuard', () => {
  afterEach(() => {
    try {
      TestBed.inject(MockStore).resetSelectors();
    } catch {
      /* configureTestingModule skipped or already torn down */
    }
    TestBed.resetTestingModule();
  });

  it('returns true when the user is logged in', async () => {
    const result = await runGuard(true);
    expect(result).toBe(true);
  });

  it('returns a UrlTree redirecting to /login when not logged in', async () => {
    const result = await runGuard(false);
    const router = TestBed.inject(Router);
    expect(result).toBeInstanceOf(UrlTree);
    expect(router.serializeUrl(result as UrlTree)).toBe('/login');
  });
});
