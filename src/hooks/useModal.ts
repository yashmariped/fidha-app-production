import { useState, useCallback } from 'react';

interface ModalOptions {
  content: React.ReactNode;
  showCloseButton?: boolean;
  animationType?: 'fade' | 'slide' | 'none';
  transparent?: boolean;
  fullScreen?: boolean;
}

interface ModalState extends ModalOptions {
  id: number;
  visible: boolean;
}

export const useModal = () => {
  const [modals, setModals] = useState<ModalState[]>([]);

  const show = useCallback(({ content, showCloseButton = true, animationType = 'fade', transparent = true, fullScreen = false }: ModalOptions) => {
    const id = Date.now();
    setModals((prevModals) => [
      ...prevModals,
      { id, content, showCloseButton, animationType, transparent, fullScreen, visible: true },
    ]);
    return id;
  }, []);

  const hide = useCallback((id: number) => {
    setModals((prevModals) =>
      prevModals.map((modal) =>
        modal.id === id ? { ...modal, visible: false } : modal
      )
    );

    setTimeout(() => {
      setModals((prevModals) =>
        prevModals.filter((modal) => modal.id !== id)
      );
    }, 300);
  }, []);

  const hideAll = useCallback(() => {
    setModals((prevModals) =>
      prevModals.map((modal) => ({ ...modal, visible: false }))
    );

    setTimeout(() => {
      setModals([]);
    }, 300);
  }, []);

  return {
    modals,
    show,
    hide,
    hideAll,
  };
}; 