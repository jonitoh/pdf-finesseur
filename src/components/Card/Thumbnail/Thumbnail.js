
import React from 'react';
import PropTypes from 'prop-types';
import './Thumbnail.css';
import propTypes from 'prop-types';


const Thumbnail = ({ src, label, iconLeft, iconRight, onClickLeft = undefined, onClickRight = undefined }) => {

    return (
        <div className="card">
            <img src={src} alt={label} />
            <div className="info-content">
                <div className="top-section">
                    <div className="left-area">
                        <img src={iconLeft} onClick={onClickLeft} />
                    </div>
                    <div className="right-area">
                        <img src={iconRight} onClick={onClickRight} />
                    </div>
                </div>
                <div className="bottom-section">
                    <h3>{label}</h3>
                </div>
            </div>
        </div>
    )
}


export default Thumbnail;

Thumbnail.propTypes = {
    src: propTypes.string.isRequired,
    label: propTypes.string.isRequired,
    iconLeft: propTypes.string.isRequired,
    iconRight: propTypes.string.isRequired,
    onClickLeft: propTypes.func,
    onClickRight: propTypes.func
}
