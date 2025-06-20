import { useState, useCallback } from 'react';
import { useToastContext } from '../components/ToastProvider';
import { useLoadingContext } from '../components/LoadingProvider';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  const { show: showToast } = useToastContext();
  const { show: showLoading, hide: hideLoading } = useLoadingContext();

  const login = useCallback(async (email: string, password: string) => {
    try {
      showLoading();
      // TODO: Implement actual login logic
      const mockUser: User = {
        id: '1',
        username: 'testuser',
        email,
        avatar: 'https://via.placeholder.com/150',
      };

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });

      showToast({
        message: 'Successfully logged in',
        type: 'success',
      });
    } catch (error) {
      showToast({
        message: 'Failed to login',
        type: 'error',
      });
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading, showToast]);

  const register = useCallback(async (username: string, email: string, password: string) => {
    try {
      showLoading();
      // TODO: Implement actual registration logic
      const mockUser: User = {
        id: '1',
        username,
        email,
        avatar: 'https://via.placeholder.com/150',
      };

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });

      showToast({
        message: 'Successfully registered',
        type: 'success',
      });
    } catch (error) {
      showToast({
        message: 'Failed to register',
        type: 'error',
      });
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading, showToast]);

  const logout = useCallback(async () => {
    try {
      showLoading();
      // TODO: Implement actual logout logic
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      showToast({
        message: 'Successfully logged out',
        type: 'success',
      });
    } catch (error) {
      showToast({
        message: 'Failed to logout',
        type: 'error',
      });
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading, showToast]);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    try {
      showLoading();
      // TODO: Implement actual profile update logic
      setAuthState((prevState) => ({
        ...prevState,
        user: prevState.user ? { ...prevState.user, ...updates } : null,
      }));

      showToast({
        message: 'Profile updated successfully',
        type: 'success',
      });
    } catch (error) {
      showToast({
        message: 'Failed to update profile',
        type: 'error',
      });
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading, showToast]);

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
  };
}; 