import React from 'react';
import './Modal.scss';

const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null; // Don't render modal if it's not open

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-modal" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Dynamic content passed as children */}
        <div className="modal-body">
          {children}
        </div>

        {/* Dynamic footer passed as a prop */}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
