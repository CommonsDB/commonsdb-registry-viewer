import React, { type FC, type ReactNode, useCallback } from 'react';
import { Button, Modal, type ModalProps } from 'flowbite-react';

import { useTranslation } from '~/shared/utils/i18n/client';

interface IBaseModalProps extends ModalProps {
  children: ReactNode;
  title?: string;
  showCancelButton?: boolean;
  showOkButton?: boolean;
  onClose: () => void;
  onOk?: () => void;
}

export const BaseModal: FC<IBaseModalProps> = (props) => {
  const { children, title, showCancelButton, showOkButton, onClose, onOk, ...rest } = props;
  const { t } = useTranslation();

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClose?.();
    },
    [onClose],
  );

  const handleContentClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return (
    <Modal {...rest} onClose={onClose} dismissible onClick={handleBackdropClick}>
      <div onClick={handleContentClick} className="contents">
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer className="flex items-center justify-end gap-2 border-t-0 pt-0">
          {showCancelButton && (
            <Button className="w-fit" color="teal" onClick={onClose}>
              {t('modal.cancel')}
            </Button>
          )}
          {showOkButton && (
            <Button className="w-fit" onClick={onOk}>
              {t('modal.ok')}
            </Button>
          )}
        </Modal.Footer>
      </div>
    </Modal>
  );
};
