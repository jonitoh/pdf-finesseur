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
import styles from './alert.module.css';

export type Props = {
  children?: ReactNode;
  isOpenedAtDefault?: boolean;
  shouldHandleEscape?: boolean;
  title?: string;
  isFading?: boolean;
  isDisappearing?: boolean;
  type?: 'modal' | 'toast';
  position?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'center-left'
    | 'center'
    | 'center-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';
  timing?: number;
};

export type Ref = {
  current: HTMLDivElement | null;
  open: () => void;
};

const modalElement = document.getElementById('modal') as HTMLElement;
const toastElement = document.getElementById('toast') as HTMLElement;

const Alert = forwardRef<Ref, Props>(function Alert(
  {
    children,
    isOpenedAtDefault,
    shouldHandleEscape,
    title,
    isFading,
    isDisappearing,
    type,
    position,
    timing,
  },
  ref
) {
  const isToast = type === 'toast';
  const divRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(isOpenedAtDefault);
  const [mustDisappear, setMustDisappear] = useState(false);

  const onClose = useCallback(() => setIsOpen(false), []);
  const onOpen = useCallback(() => setIsOpen(true), []);
  const onDisappear = useCallback(() => {
    setMustDisappear(true);
    setTimeout(() => setIsOpen(false), 900);
  }, []);

  // close modal with keyboard
  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Escape') setIsOpen(false);
  }, []);

  useEffect(() => {
    if (shouldHandleEscape && !isToast) {
      if (isOpen) document.addEventListener('keydown', handleEscape, false);
      return () => {
        document.removeEventListener('keydown', handleEscape, false);
      };
    }
  }, [handleEscape, isOpen]);

  // disappearing modal
  useEffect(() => {
    if (isDisappearing) {
      const timerId = setTimeout(() => onDisappear(), timing);

      return () => {
        clearTimeout(timerId);
      };
    }
  }, []);

  useImperativeHandle(ref, () => ({
    current: divRef.current,
    open: onOpen,
  }));

  return createPortal(
    isOpen ? (
      <div className={classNames([styles.wrapper, isToast ? styles.toast : styles.modal])}>
        <div
          className={classNames([
            styles.container,
            isFading && !mustDisappear ? styles.fade : false,
            mustDisappear ? styles.disappear : false,
            styles[`position-${position}`],
          ])}
          ref={divRef}
        >
          <header className={classNames([styles.header, title ? styles.withTitle : false])}>
            <h2 className={styles.title}> {title} </h2>
            <Button
              type="button"
              className={styles.close}
              icon={<Icon.Close />}
              onClick={onClose}
              variant="transparent"
            />
          </header>
          <div className={styles.content}> {children} </div>
        </div>
      </div>
    ) : null,
    isToast ? toastElement : modalElement
  );
});

Alert.defaultProps = {
  children: undefined,
  isOpenedAtDefault: false,
  shouldHandleEscape: false,
  title: undefined,
  isFading: false,
  isDisappearing: false,
  type: 'modal',
  position: 'center',
  timing: 5000,
};

export default Alert;
