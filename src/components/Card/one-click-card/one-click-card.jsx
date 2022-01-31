import React from 'react';
import PropTypes from 'prop-types';
import './one-click-card.scoped.css';
import Button from "@common/button/button";


const OneClickCard = ({ imgSrc, label, buttonLabel, onClick = undefined }) => {

  return (
    <div className="card">
      <img src={imgSrc} alt={`image of ${label}`} />
      <div className="info-content">
        <h3>{label}</h3>
        <Button onClick={onClick}>{buttonLabel}</Button>
      </div>
    </div>
  )
}

export default OneClickCard;


OneClickCard.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  buttonLabel: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}