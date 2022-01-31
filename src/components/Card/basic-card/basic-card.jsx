import React from 'react';
import PropTypes from 'prop-types';
import './basic-card.scoped.css';


const BasicCard = ({ imgSrc, label }) => {

    return (
        <div className="card">
            <img src={imgSrc} alt={`image of ${label}`} />
            <div className="info-content">
                <h3>{label}</h3>
            </div>
        </div>
    )
}


export default BasicCard;

BasicCard.propTypes = {
    imgSrc: PropTypes.string,
    label: PropTypes.string,
}
