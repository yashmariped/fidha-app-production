import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface NotificationToastProps {
  message: string;
  type: 'success' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

const ToastContainer = styled.div<{ visible: boolean; type: string }>`
  position: fixed;
  top: 20px;
  right: 20px;
  background: ${props => {
    switch (props.type) {
      case 'success': return '#00FF9D';
      case 'warning': return '#FFD700';
      default: return '#7B4AE2';
    }
  }};
  color: ${props => props.type === 'success' ? '#000' : '#fff'};
  padding: 16px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transform: translateX(${props => props.visible ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
  max-width: 300px;
  font-weight: 500;
`;

const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  type,
  duration = 5000,
  onClose
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <ToastContainer visible={visible} type={type}>
      {message}
    </ToastContainer>
  );
};

export default NotificationToast; 