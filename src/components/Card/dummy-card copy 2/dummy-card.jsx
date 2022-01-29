import React from 'react';
import PropTypes from 'prop-types';
import './dummy-card.css';

export const SimpleCard = ({ text = "fake text" }) => (
  <div className='border-card'>
    <p>{text}</p>
  </div>
);

SimpleCard.propTypes = {
  text: PropTypes.string,
}

export const OneClickCard = ({ text = "fake text", clickLabel = "Press it", onClick }) => (
  <div className='border-card'>
    <p>{text}</p>
    <button onClick={onClick}>{clickLabel}</button>
  </div>
);

OneClickCard.propTypes = {
  text: PropTypes.string,
  clickLabel: PropTypes.string,
  onClick: PropTypes.func.isRequired
}

export const TwoClickCard = ({ text = "fake text", firstLabel = "first", secondLabel = 'second', firstOnClick, secondOnClick }) => (
  <div className='border-card'>
    <p>{text}</p>
    <button onClick={firstOnClick}>{firstLabel}</button>
    <button onClick={secondOnClick}>{secondLabel}</button>
  </div>
);

TwoClickCard.propTypes = {
  text: PropTypes.string,
  firstLabel: PropTypes.string,
  firstOnClick: PropTypes.func.isRequired,
  secondLabel: PropTypes.string,
  secondOnClick: PropTypes.func.isRequired,
}

///
const CustomImg = props => <img {...props} />

///



export const TwoClickImg = ({ text = "fake text", firstLabel = "first", secondLabel = 'second', firstOnClick, secondOnClick, imgSrc, imgAlt = "image" }) => (
  <div className='border-card'>
    <p>{text}</p>
    <CustomImg src={imgSrc} alt={imgAlt} width="100" height="150" />
    <button onClick={firstOnClick}>{firstLabel}</button>
    <button onClick={secondOnClick}>{secondLabel}</button>
  </div>
);

TwoClickCard.propTypes = {
  text: PropTypes.string,
  firstLabel: PropTypes.string,
  firstOnClick: PropTypes.func.isRequired,
  secondLabel: PropTypes.string,
  secondOnClick: PropTypes.func.isRequired,
}