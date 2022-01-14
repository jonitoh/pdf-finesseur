
import React from 'react';
import PropTypes from 'prop-types';
import './DummyCard.css';

const DummyCard = ({ text = "fake text", onClick }) => (
  <div>
    <p>{text}</p>
    <button onClick={onClick}>Press it</button>
  </div>
);

export default DummyCard;

DummyCard.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func.isRequired
}