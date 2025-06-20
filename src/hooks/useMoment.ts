import { useState, useCallback } from 'react';
import { useToastContext } from '../components/ToastProvider';
import { useLoadingContext } from '../components/LoadingProvider';

interface Moment {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  timestamp: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  status: 'pending' | 'confirmed' | 'rejected';
}

interface MomentState {
  moments: Moment[];
  isLoading: boolean;
}

export const useMoment = () => {
  const [momentState, setMomentState] = useState<MomentState>({
    moments: [],
    isLoading: false,
  });

  const { show: showToast } = useToastContext();
  const { show: showLoading, hide: hideLoading } = useLoadingContext();

  const detectMoment = useCallback(async (location?: { latitude: number; longitude: number }) => {
    try {
      showLoading();
      // TODO: Implement actual moment detection logic
      const mockMoment: Moment = {
        id: Date.now().toString(),
        userId: '1',
        username: 'testuser',
        avatar: 'https://via.placeholder.com/150',
        timestamp: Date.now(),
        location,
        status: 'pending',
      };

      setMomentState((prevState: MomentState) => ({
        ...prevState,
        moments: [mockMoment, ...prevState.moments],
      }));

      showToast({
        message: 'Moment detected!',
        type: 'success',
      });
    } catch (error) {
      showToast({
        message: 'Failed to detect moment',
        type: 'error',
      });
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading, showToast]);

  const confirmMoment = useCallback(async (momentId: string) => {
    try {
      showLoading();
      // TODO: Implement actual moment confirmation logic
      setMomentState((prevState: MomentState) => ({
        ...prevState,
        moments: prevState.moments.map((moment: Moment) =>
          moment.id === momentId
            ? { ...moment, status: 'confirmed' }
            : moment
        ),
      }));

      showToast({
        message: 'Moment confirmed!',
        type: 'success',
      });
    } catch (error) {
      showToast({
        message: 'Failed to confirm moment',
        type: 'error',
      });
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading, showToast]);

  const rejectMoment = useCallback(async (momentId: string) => {
    try {
      showLoading();
      // TODO: Implement actual moment rejection logic
      setMomentState((prevState: MomentState) => ({
        ...prevState,
        moments: prevState.moments.map((moment: Moment) =>
          moment.id === momentId
            ? { ...moment, status: 'rejected' }
            : moment
        ),
      }));

      showToast({
        message: 'Moment rejected',
        type: 'info',
      });
    } catch (error) {
      showToast({
        message: 'Failed to reject moment',
        type: 'error',
      });
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading, showToast]);

  const getMomentHistory = useCallback(async () => {
    try {
      showLoading();
      // TODO: Implement actual moment history fetching logic
      const mockMoments: Moment[] = [
        {
          id: '1',
          userId: '1',
          username: 'testuser1',
          avatar: 'https://via.placeholder.com/150',
          timestamp: Date.now() - 3600000,
          status: 'confirmed',
        },
        {
          id: '2',
          userId: '2',
          username: 'testuser2',
          avatar: 'https://via.placeholder.com/150',
          timestamp: Date.now() - 7200000,
          status: 'rejected',
        },
      ];

      setMomentState((prevState: MomentState) => ({
        ...prevState,
        moments: mockMoments,
      }));
    } catch (error) {
      showToast({
        message: 'Failed to fetch moment history',
        type: 'error',
      });
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading, showToast]);

  return {
    ...momentState,
    detectMoment,
    confirmMoment,
    rejectMoment,
    getMomentHistory,
  };
}; 