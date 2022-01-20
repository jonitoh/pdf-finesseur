
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './page-wrapper.css';
import Icon from '../../components/icon';

const BackButton = ({ path, Icon, onClick = undefined }) => (
    <div>
        <Link to={path} onClick={onClick}>
            <Icon />
        </Link>
    </div>
)

BackButton.propTypes = {
    path: PropTypes.string.isRequired,
    Icon: PropTypes.func.isRequired,
    onClick: PropTypes.func,
}

const PageWrapper = ({ putBackButton = true, children }) => {
    const leftStyle = {};
    const LeftButton = <BackButton path={"/"} Icon={Icon.NavBackArrow} style={leftStyle} />;
    if (putBackButton) {
        return (
            <div className="page-wrapper">
                <div className="page-wrapper__inner-nav">
                    {putBackButton ? LeftButton : null}
                </div>
                <div className="page-wrapper__main">
                    {children}
                </div>
            </div>
        )
    }
    return (
        <Fragment>
            {children}
        </Fragment>
    )
}

export default PageWrapper;

PageWrapper.propTypes = {
    putBackButton: PropTypes.bool,
    children: PropTypes.node
}

export const withInnerNavigation = (Component, putBackButton) => (props => (
    <PageWrapper putBackButton={putBackButton}>
        <Component {...props} />
    </PageWrapper>
));
