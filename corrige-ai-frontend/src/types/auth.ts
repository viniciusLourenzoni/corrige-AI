import { RoleEnum } from "./enums";

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: RoleEnum;
  phone: string;
  cep: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  surname: string;
  role: RoleEnum;
  phone: string;
  cep: string;
}
