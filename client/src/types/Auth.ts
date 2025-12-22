export interface AuthResponse {
  message: string;
  status: number;
  timestamp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: Array<'user' | 'admin'>;
  };
  message: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: Array<'user' | 'admin'>;
  };
  message: string;
}
