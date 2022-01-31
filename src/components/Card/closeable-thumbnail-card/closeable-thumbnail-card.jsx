import React from 'react';
import PropTypes from 'prop-types';
import './closeable-thumbnail-card.scoped.css';
import Button from "@common/button/button";
import Icon from '@common/icon'


const CloseableThumbnailCard = ({ imgSrc, label, buttonLabel, onClick = undefined, onClose = undefined }) => (
    <div className="wrapper">
      <div className="card">
        <img src={imgSrc} alt={`image of ${label}`} />
        <div className="info-content">
          <Button onClick={onClick}>{buttonLabel}</Button>
        </div>
      </div>
      <Button className='closing-btn' onClick={onClose}>{<Icon.Close/>}</Button>
    </div>
)

export default CloseableThumbnailCard;


CloseableThumbnailCard.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
}