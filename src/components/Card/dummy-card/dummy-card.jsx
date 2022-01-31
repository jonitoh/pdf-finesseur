import React from 'react';
import PropTypes from 'prop-types';
import './dummy-card.scoped.css';


const DummyCard = (props) => {
    const propertyDiv = (keyProp, key, value) => (<li key={keyProp}><b>{key}</b>: {value.toString()}</li>)

    return (
        <div className="card">
            <ul>
                {Object.entries(props).map(([key,value])=>propertyDiv(key, key, value))}
            </ul>
        </div>
    )
}


export default DummyCard;

DummyCard.propTypes = {
    label: PropTypes.string.isRequired,
}
