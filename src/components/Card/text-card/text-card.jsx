import React from 'react';
import PropTypes from 'prop-types';
import './text-card.scoped.css';


const TextCard = ({ text }) => {

    return (
        <div className="card">
            <h3>{text}</h3>
        </div>
    )
}


export default TextCard;

TextCard.propTypes = {
    text: PropTypes.string.isRequired,
}
