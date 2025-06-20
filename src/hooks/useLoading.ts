import { useState, useCallback } from 'react';

interface LoadingState {
  visible: boolean;
  message?: string;
}

export const useLoading = () => {
  const [loading, setLoading] = useState<LoadingState>({
    visible: false,
  });

  const show = useCallback((message?: string) => {
    setLoading({
      visible: true,
      message,
    });
  }, []);

  const hide = useCallback(() => {
    setLoading({
      visible: false,
    });
  }, []);

  return {
    loading,
    show,
    hide,
  };
}; 