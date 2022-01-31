import React from 'react';
import PropTypes from 'prop-types';
import './one-click-closeable-card.scoped.css';
import Button from "@common/button/button";
import Icon from '@common/icon'


const OneClickCloseableCard = ({ imgSrc, label, buttonLabel, onClick = undefined, onClose = undefined }) => (
    <div className="wrapper">
      <div className="card">
        <img src={imgSrc} alt={`image of ${label}`} />
        <div className="info-content">
          <h3>{label}</h3>
          <Button onClick={onClick}>{buttonLabel}</Button>
        </div>
      </div>
      <Button className='closing-btn' onClick={onClose}>{<Icon.Close/>}</Button>
    </div>
)

export default OneClickCloseableCard;


OneClickCloseableCard.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
}