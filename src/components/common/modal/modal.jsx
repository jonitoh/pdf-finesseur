import React, { useState, useImperativeHandle, forwardRef, useCallback, useEffect } from 'react';
import "./modal.scoped.css";
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import Icon from '@common/icon';

const modalElement = document.getElementById('modal');

const Modal = ({ children, defaultOpened = false, allowHandleEscape = false, title = undefined, fade = false, disappear = false, timing = 5000 }, ref) => {
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


  // disappearing modal
  useEffect(() => {
    if (disappear) {
      const timeId = setTimeout(() => {
        // After 3 seconds set the show value to false
        close()
      }, timing)

      return () => {
        clearTimeout(timeId)
      }
    }
  }, [])

  return createPortal(
    isOpen ?
      (<div
        className={`modal${fade ? ' fade' : ''}`}
      >
        <div className="container">
          <header className="header">
            <h2 className="title"> {title} </h2>
            <button className="close" onClick={() => close()}>
              <Icon.Close alt="close" />
            </button>
          </header>
          <div className="content"> {children} </div>
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