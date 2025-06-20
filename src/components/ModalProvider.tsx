import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from './Modal';
import { useModal } from '../hooks/useModal';

interface ModalContextType {
  show: (options: {
    content: React.ReactNode;
    showCloseButton?: boolean;
    animationType?: 'fade' | 'slide' | 'none';
    transparent?: boolean;
    fullScreen?: boolean;
  }) => number;
  hide: (id: number) => void;
  hideAll: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { modals, show, hide, hideAll } = useModal();

  return (
    <ModalContext.Provider value={{ show, hide, hideAll }}>
      {children}
      <View style={styles.container}>
        {modals.map((modal) => (
          <Modal
            key={modal.id}
            visible={modal.visible}
            onClose={() => hide(modal.id)}
            showCloseButton={modal.showCloseButton}
            animationType={modal.animationType}
            transparent={modal.transparent}
            fullScreen={modal.fullScreen}
          >
            {modal.content}
          </Modal>
        ))}
      </View>
    </ModalContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
}); 