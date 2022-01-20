import React, { useState, useImperativeHandle, forwardRef, useCallback, useEffect } from 'react';
import "./modal.css";
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import Icon from '../icon';

const modalElement = document.getElementById('modal');

const Modal = ({ children, defaultOpened = false, allowHandleEscape = false, title = undefined, fade = false }, ref) => {
  const [isOpen, setIsOpen] = useState(defaultOpened);

  const close = useCallback(() => setIsOpen(false), []);

  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  }), [close])

  const handleEscape = useCallback(event => {
    if (event.keyCode === 27) setIsOpen(false)
  }, [])

  useEffect(() => {
    if (allowHandleEscape) {
      if (isOpen) document.addEventListener('keydown', handleEscape, false)
      return (() => {
        document.removeEventListener('keydown', handleEscape, false)
      })
    }
  }, [handleEscape, isOpen])

  return createPortal(
    isOpen ?
      (<div
        className={`modal-wrapper ${fade ? 'modal-fade' : ''}`}
      >
        <div className="modal-container">
          <header className="modal_header">
            <h2 className="modal_header-title"> {title} </h2>
            <button className="close" onClick={() => close()}>
              <Icon.Close alt="close" />
            </button>
          </header>
          <div className="modal_content"> {children} </div>
        </div>
      </div>) :
      null,
    modalElement
  )
}

export default forwardRef(Modal);

const refProp = PropTypes.oneOfType([
  PropTypes.func,
  PropTypes.shape({ current: PropTypes.any })
]);

Modal.propTypes = {
  children: PropTypes.node,
  defaultOpened: PropTypes.bool,
  allowHandleEscape: PropTypes.bool,
  title: PropTypes.string,
  fade: PropTypes.bool,
  ref: refProp,
}