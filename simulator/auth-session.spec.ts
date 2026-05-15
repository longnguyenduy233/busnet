import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  FetchHttpError,
  getFetchHttpStatus,
  loginTokenPair,
  recoverSessionAfterUnauthorized,
  refreshTokenPair,
  resetRecoveryQueueForTests,
} from './auth-session';

describe('auth-session', () => {
  const api = 'http://localhost:5000/api';

  afterEach(() => {
    resetRecoveryQueueForTests();
  });

  it('loginTokenPair posts userName/password and returns pair', async () => {
    const fetchFn = vi.fn().mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          token: 'access',
          refreshToken: 'refresh',
          userName: 'admin',
          displayName: 'Administrator',
        }),
        { status: 200 }
      )
    );

    const pair = await loginTokenPair(api, 'admin', 'secret', fetchFn);

    expect(pair).toEqual({ accessToken: 'access', refreshToken: 'refresh' });
    expect(fetchFn).toHaveBeenCalledWith(`${api}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName: 'admin', password: 'secret' }),
    });
  });

  it('refreshTokenPair mutates pair in place', async () => {
    const pair = { accessToken: 'old', refreshToken: 'rt' };
    const fetchFn = vi.fn().mockResolvedValueOnce(
      new Response(
        JSON.stringify({ token: 'new-a', refreshToken: 'new-r' }),
        { status: 200 }
      )
    );

    await refreshTokenPair(api, pair, fetchFn);

    expect(pair).toEqual({ accessToken: 'new-a', refreshToken: 'new-r' });
    expect(fetchFn).toHaveBeenCalledWith(`${api}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: 'rt' }),
    });
  });

  it('recoverSessionAfterUnauthorized re-logins when refresh returns 401', async () => {
    const pair = { accessToken: 'expired', refreshToken: 'dead-rt' };
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(new Response('unauthorized', { status: 401 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            token: 'from-login',
            refreshToken: 'from-login-rt',
          }),
          { status: 200 }
        )
      );

    await recoverSessionAfterUnauthorized(api, pair, 'admin', 'pw', fetchFn);

    expect(pair).toEqual({
      accessToken: 'from-login',
      refreshToken: 'from-login-rt',
    });
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('getFetchHttpStatus reads status from FetchHttpError', () => {
    expect(getFetchHttpStatus(new FetchHttpError('x', 401))).toBe(401);
    expect(getFetchHttpStatus(new Error('other'))).toBeUndefined();
  });

  /**
   * Two trackers hit 401 simultaneously: recovery must serialize so only one `/auth/refresh`
   * is in flight — overlapping refresh mocks would violate real API concurrency limits.
   */
  it('concurrent recoverSessionAfterUnauthorized never overlaps refresh (serialized)', async () => {
    const pair = { accessToken: 'old', refreshToken: 'refresh-initial' };

    let refreshInflightCount = 0;
    let maxRefreshInflight = 0;

    const fetchFn = vi.fn(async (url: RequestInfo | URL) => {
      const u = typeof url === 'string' ? url : url.toString();

      if (u === `${api}/auth/refresh`) {
        refreshInflightCount++;
        maxRefreshInflight = Math.max(maxRefreshInflight, refreshInflightCount);
        await new Promise((r) => setTimeout(r, 40));
        refreshInflightCount--;
        const body = JSON.stringify({
          token: 'access-next',
          refreshToken: `rotated-after-${refreshInflightCount}`,
        });
        return new Response(body, { status: 200 });
      }

      return new Response('unexpected', { status: 599 });
    });

    await Promise.all([
      recoverSessionAfterUnauthorized(api, pair, 'admin', 'pw', fetchFn),
      recoverSessionAfterUnauthorized(api, pair, 'admin', 'pw', fetchFn),
    ]);

    const refreshUrls = fetchFn.mock.calls
      .map((c) => (typeof c[0] === 'string' ? c[0] : (c[0] as URL).toString()))
      .filter((u) => u.includes('/auth/refresh'));

    expect(maxRefreshInflight).toBe(1);
    expect(refreshUrls).toHaveLength(2);
  });
});
