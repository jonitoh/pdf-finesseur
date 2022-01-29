import React from 'react';
import PropTypes from 'prop-types';
import './page-wrapper.scoped.css';
import Icon from '@common/icon';
import NavigationButton from '@common/navigation-button/navigation-button';

const leftStyle = {};
//const rightStyle = {};

const PageWrapper = ({ putLeftButton = true, putRightButton = true, containerStyle = {}, children }) => {
    const LeftButton = <NavigationButton path={"/"} Icon={Icon.NavBackArrow} style={leftStyle} />;
    const RightButton = null;
    if (putLeftButton || putRightButton) {
        return (
            <div className="page">
                <div className="navbar">
                    {putLeftButton ? LeftButton : null}
                    {putRightButton ? RightButton : null}
                </div>
                <div className="main" style={containerStyle}>
                    {children}
                </div>
            </div>
        )
    }
    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}

export default PageWrapper;

PageWrapper.propTypes = {
    putLeftButton: PropTypes.bool,
    putRightButton: PropTypes.bool,
    children: PropTypes.node
}

export const withInnerNavigation = (Component, rest = { putLeftButton: true, putRightButton: false, containerStyle: {} }) => (props => {
    const { putLeftButton, putRightButton, containerStyle } = rest;
    return (
    <PageWrapper
        putLeftButton={putLeftButton}
        putRightButton={putRightButton}
        containerStyle={containerStyle}
    >
        <Component {...props} />
    </PageWrapper>
)});
