export type UserRole =
  | 'LEARNER'
  | 'CONTENT_AUTHOR'
  | 'CONTENT_REVIEWER'
  | 'CONTENT_PUBLISHER'
  | 'CONTENT_ADMINISTRATOR'
  | 'SYSTEM_ADMINISTRATOR';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  role: UserRole;
  isEmailVerified: boolean;
}

export interface AuthResponse {
  user: SessionUser;
  token?: string; // Optional if cookie-based
}

