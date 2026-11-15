import type { ApiResponse, ApiErrorProblemDetails, SessionUser, LoginInput, RegisterInput } from '@akaytheory/shared';

export class ApiClient {
  public static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(endpoint, {
      ...options,
      credentials: 'include', // Ensures HTTP-only session cookies are sent/received
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    const data = await res.json();

    if (!res.ok) {
      const problem = data as ApiErrorProblemDetails;
      throw new Error(problem.detail || problem.title || `API error ${res.status}`);
    }

    return (data as ApiResponse<T>).data;
  }

  public static async getHealth(): Promise<{ status: string; database: string; uptimeSeconds: number }> {
    return this.request('/api/v1/health');
  }

  public static async getCurrentUser(): Promise<{ user: SessionUser }> {
    return this.request('/api/v1/auth/me');
  }

  public static async register(input: RegisterInput): Promise<{ user: SessionUser }> {
    return this.request('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  public static async login(input: LoginInput): Promise<{ user: SessionUser }> {
    return this.request('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  public static async logout(): Promise<{ message: string }> {
    return this.request('/api/v1/auth/logout', {
      method: 'POST',
    });
  }
}

export const apiClient = {
  get: async <T>(url: string): Promise<{ data?: T; error?: ApiErrorProblemDetails }> => {
    try {
      const path = url.startsWith('/api/v1') ? url : `/api/v1${url}`;
      const data = await ApiClient.request<T>(path);
      return { data };
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : 'An error occurred during API request';
      return {
        error: {
          success: false,
          type: 'about:blank',
          title: 'Request Failed',
          status: 500,
          code: 'REQUEST_FAILED',
          detail,
          instance: url,
          timestamp: new Date().toISOString(),
        },
      };
    }
  },
  post: async <T>(url: string, body?: unknown): Promise<{ data?: T; error?: ApiErrorProblemDetails }> => {
    try {
      const path = url.startsWith('/api/v1') ? url : `/api/v1${url}`;
      const data = await ApiClient.request<T>(path, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      return { data };
    } catch (err: unknown) {
      const detail = err instanceof Error ? err.message : 'An error occurred during API request';
      return {
        error: {
          success: false,
          type: 'about:blank',
          title: 'Request Failed',
          status: 500,
          code: 'REQUEST_FAILED',
          detail,
          instance: url,
          timestamp: new Date().toISOString(),
        },
      };
    }
  },
};
