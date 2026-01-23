/**
 * useAuth Hook
 * Manages authentication state and provides auth functions
 */

import { useState, useEffect, useCallback } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getStoredUser,
  getAccessToken,
  storeTokens,
  type User,
  type LoginCredentials,
  type RegisterData,
} from '@/lib/api/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface UseAuthReturn extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check authentication status on mount
  const checkAuth = useCallback(() => {
    const token = getAccessToken();
    const user = getStoredUser();

    if (token && user) {
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
      });
    } else {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await apiLogin(credentials);
      storeTokens(response.access_token, response.refresh_token, response.user);
      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await apiRegister(data);
      storeTokens(response.access_token, response.refresh_token, response.user);
      setState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      throw error;
    }
  };

  const logout = () => {
    apiLogout();
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return {
    ...state,
    login,
    register,
    logout,
    checkAuth,
  };
}
