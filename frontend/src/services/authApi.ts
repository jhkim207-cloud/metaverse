import api from './api';
import type { LoginRequest, LoginResponse } from '../types/auth.types';

export const authApi = {
  login: (request: LoginRequest) => api.post<LoginResponse>('/v1/auth/login', request),
};
