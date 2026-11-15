export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    timestamp: string;
  };
}

export interface ApiErrorProblemDetails {
  success: false;
  type: string;        // URI identifier, e.g. "urn:akaytheory:error:unauthorized"
  title: string;       // Human-readable summary
  status: number;      // HTTP status code
  detail: string;      // Specific error description
  instance: string;    // Request URL / endpoint
  code: string;        // Machine-readable code, e.g. "INVALID_CREDENTIALS"
  invalidParams?: Array<{
    name: string;
    reason: string;
  }>;
  timestamp: string;
}

