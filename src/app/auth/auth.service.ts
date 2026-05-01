import { inject, Injectable, signal } from '@angular/core';
import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

interface RefreshResponse {
  accessToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Auth calls bypass the interceptor chain to avoid circular dependency
  private http: HttpClient;

  user = signal<AuthUser | null>(null);
  initialized = signal(false);

  private accessToken: string | null = null;
  private refreshInProgress: Promise<string> | null = null;

  constructor() {
    const backend = inject(HttpBackend);
    this.http = new HttpClient(backend);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return this.user() !== null;
  }

  async initialize(): Promise<void> {
    try {
      const res = await this.doRefresh();
      this.accessToken = res;
      const me = await firstValueFrom(
        this.http.get<{ user: AuthUser }>(`${environment.apiUrl}/auth/me`, {
          headers: new HttpHeaders({ Authorization: `Bearer ${res}` }),
        }),
      );
      this.user.set(me.user);
    } catch {
      // no active session — user needs to log in
    } finally {
      this.initialized.set(true);
    }
  }

  async login(email: string, password: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(
        `${environment.apiUrl}/auth/login`,
        { email, password },
        { withCredentials: true },
      ),
    );
    this.accessToken = res.accessToken;
    this.user.set(res.user);
  }

  async signup(name: string, email: string, password: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(
        `${environment.apiUrl}/auth/signup`,
        { name, email, password },
        { withCredentials: true },
      ),
    );
    this.accessToken = res.accessToken;
    this.user.set(res.user);
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true }),
      );
    } finally {
      this.accessToken = null;
      this.user.set(null);
    }
  }

  // Shared refresh — multiple concurrent callers get the same promise
  refreshToken(): Promise<string> {
    if (!this.refreshInProgress) {
      this.refreshInProgress = this.doRefresh()
        .then((token) => {
          this.accessToken = token;
          return token;
        })
        .catch((err) => {
          this.accessToken = null;
          this.user.set(null);
          throw err;
        })
        .finally(() => {
          this.refreshInProgress = null;
        });
    }
    return this.refreshInProgress;
  }

  private async doRefresh(): Promise<string> {
    const res = await firstValueFrom(
      this.http.post<RefreshResponse>(
        `${environment.apiUrl}/auth/refresh`,
        {},
        { withCredentials: true },
      ),
    );
    return res.accessToken;
  }
}
