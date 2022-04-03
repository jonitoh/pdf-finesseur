import React, {
  useState,
  useCallback,
  useEffect,
  ReactNode,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { createPortal } from 'react-dom';
import Button from '#common/buttons/button';
import Icon from '#common/icon';
import classNames from 'classnames';
import styles from './modal.module.css';

export type Props = {
  children?: ReactNode;
  isOpenedAtDefault?: boolean;
  shouldHandleEscape?: boolean;
  title?: string;
  isFading?: boolean;
  isDisappearing?: boolean;
  timing?: number;
};

export type Ref = {
  current: HTMLDivElement | null;
  open: () => void;
};

const modalElement = document.getElementById('modal') as HTMLElement;

const Modal = forwardRef<Ref, Props>(function Modal(
  { children, isOpenedAtDefault, shouldHandleEscape, title, isFading, isDisappearing, timing },
  ref
) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(isOpenedAtDefault);

  const onClose = useCallback(() => setIsOpen(false), []);
  const onOpen = useCallback(() => setIsOpen(true), []);

  // close modal with keyboard
  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Escape') setIsOpen(false);
  }, []);
  useEffect(() => {
    if (shouldHandleEscape) {
      if (isOpen) document.addEventListener('keydown', handleEscape, false);
      return () => {
        document.removeEventListener('keydown', handleEscape, false);
      };
    }
  }, [handleEscape, isOpen]);

  // disappearing modal
  useEffect(() => {
    if (isDisappearing) {
      const timeId = setTimeout(() => {
        // After 3 seconds set the show value to false
        onClose();
      }, timing);

      return () => {
        clearTimeout(timeId);
      };
    }
  }, []);

  useImperativeHandle(ref, () => ({
    current: divRef.current,
    open: onOpen,
  }));

  return createPortal(
    isOpen ? (
      <div className={classNames([styles.container, isFading ? styles.fade : false])} ref={divRef}>
        <div className={styles.modal}>
          <header className={styles.header}>
            <h2 className={styles.title}> {title} </h2>
            <Button
              type="button"
              className={styles.close}
              icon={<Icon.Close />}
              onClick={onClose}
              variant="basic"
            />
          </header>
          <div className={styles.content}> {children} </div>
        </div>
      </div>
    ) : null,
    modalElement
  );
});

Modal.defaultProps = {
  children: undefined,
  isOpenedAtDefault: false,
  shouldHandleEscape: false,
  title: undefined,
  isFading: false,
  isDisappearing: false,
  timing: 5000,
};

export default Modal;
