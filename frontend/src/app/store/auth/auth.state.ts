export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  userName: string | null;
  displayName: string | null;
  loading: boolean;
  error: string | null;
}

export const initialAuthState: AuthState = {
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  userName: localStorage.getItem('userName'),
  displayName: localStorage.getItem('displayName'),
  loading: false,
  error: null
};
