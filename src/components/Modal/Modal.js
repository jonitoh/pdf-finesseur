import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import './Modal.css';
import closeIcon from 'images/icons/close-button.svg'

const Modal = ({ show, closeModal, title, children }) => {
  return ReactDOM.createPortal(
    <>
     {
     show ?
     
      <div className="modal-wrapper">
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <header className="modal-header">
            <h2 className="modal-header__title"> {title} </h2>
            <button className="modal-header__close" onClick={() => closeModal()}>
              <img src={closeIcon} alt="close" />
            </button>
          </header>
          <main className="modal-content"> {children} </main>
        </div>
      </div>
      : null
     },
    document.getElementById("modal")
    </>
  );
};

export default Modal;

Modal.propTypes = {
    show: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
}


