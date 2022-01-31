import React from 'react';
import PropTypes from 'prop-types';
import './two-click-card.scoped.css';
import Button from "@common/button/button";


const TwoClickCard = ({ imgSrc, label, leftLabel, rightLabel, onClickLeft = undefined, onClickRight = undefined }) => {

  return (
    <div className="card">
      <img src={imgSrc} alt={`image of ${label}`} />
      <div className="info-content">
        <h3>{label}</h3>
        <div className='button-area'>
          <Button className='left-btn' onClick={onClickLeft}>{leftLabel}</Button>
          <Button className='right-btn' onClick={onClickRight}>{rightLabel}</Button>
        </div>
      </div>
    </div>
  )
}

export default TwoClickCard;


TwoClickCard.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  leftLabel: PropTypes.string.isRequired,
  rightLabel: PropTypes.string.isRequired,
  onClickLeft: PropTypes.func,
  onClickRight: PropTypes.func,
}