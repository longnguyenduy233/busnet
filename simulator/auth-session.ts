/**
 * Access + refresh JWT helpers for long-running CLI processes (simulator).
 */

export class FetchHttpError extends Error {
  override readonly name = 'FetchHttpError';

  constructor(
    message: string,
    readonly status: number
  ) {
    super(message);
  }
}

export function getFetchHttpStatus(err: unknown): number | undefined {
  return err instanceof FetchHttpError ? err.status : undefined;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export async function loginTokenPair(
  apiUrl: string,
  userName: string,
  password: string,
  fetchFn: typeof fetch
): Promise<TokenPair> {
  const res = await fetchFn(`${apiUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, password }),
  });
  if (!res.ok) {
    throw new FetchHttpError(`Login failed: ${res.status} ${await res.text()}`, res.status);
  }
  const data = (await res.json()) as { token?: string; refreshToken?: string };
  if (!data.token || !data.refreshToken) {
    throw new FetchHttpError('Login response missing token or refreshToken', 500);
  }
  return { accessToken: data.token, refreshToken: data.refreshToken };
}

/** Rotates tokens in place. Throws FetchHttpError when the server rejects refresh. */
export async function refreshTokenPair(
  apiUrl: string,
  pair: TokenPair,
  fetchFn: typeof fetch
): Promise<void> {
  const res = await fetchFn(`${apiUrl}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: pair.refreshToken }),
  });
  if (!res.ok) {
    throw new FetchHttpError(
      `Refresh failed: ${res.status} ${await res.text()}`,
      res.status
    );
  }
  const data = (await res.json()) as { token?: string; refreshToken?: string };
  if (!data.token || !data.refreshToken) {
    throw new FetchHttpError('Refresh response missing token or refreshToken', 500);
  }
  pair.accessToken = data.token;
  pair.refreshToken = data.refreshToken;
}

/**
 * After an API 401 (expired access JWT): try refresh; if refresh JWT is dead (401), full login.
 * Serializes overlapping recovery calls so parallel HTTP failures share one refresh.
 */
let recoverQueue: Promise<void> = Promise.resolve();

/** Resets queued recovery chains between Vitest cases (singleton `recoverQueue` state). */
export function resetRecoveryQueueForTests(): void {
  recoverQueue = Promise.resolve();
}

export async function recoverSessionAfterUnauthorized(
  apiUrl: string,
  pair: TokenPair,
  userName: string,
  password: string,
  fetchFn: typeof fetch
): Promise<void> {
  const scheduled = recoverQueue.then(async () => {
    try {
      await refreshTokenPair(apiUrl, pair, fetchFn);
      return;
    } catch (err) {
      if (getFetchHttpStatus(err) === 401) {
        const next = await loginTokenPair(apiUrl, userName, password, fetchFn);
        pair.accessToken = next.accessToken;
        pair.refreshToken = next.refreshToken;
        return;
      }
      throw err;
    }
  });
  recoverQueue = scheduled.catch(() => undefined);
  await scheduled;
}
