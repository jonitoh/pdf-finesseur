import React from 'react';
import PropTypes from 'prop-types';
import './thumbnail-card.scoped.css';


const ThumbnailCard = ({ imgSrc, label, LeftIcon, RightIcon, onClickLeft = undefined, onClickRight = undefined }) => (
    <div className="card">
        <img src={imgSrc} alt={`image of ${label}`} />
        <div className="info-content">
            <div className="top-section">
                <div className="left-area">
                    <LeftIcon onClick={onClickLeft} />
                </div>
                <div className="right-area">
                    <RightIcon onClick={onClickRight} />
                </div>
            </div>
            <div className="bottom-section">
                <h3>{label}</h3>
            </div>
        </div>
    </div>
)


export default ThumbnailCard;

ThumbnailCard.propTypes = {
    imgSrc: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    LeftIcon: PropTypes.elementType.isRequired,
    RightIcon: PropTypes.elementType.isRequired,
    onClickLeft: PropTypes.func,
    onClickRight: PropTypes.func
}
