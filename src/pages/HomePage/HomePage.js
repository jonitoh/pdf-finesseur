
import React from 'react';
import PropTypes from 'prop-types';
import './HomePage.css';
import Placeholder from '../../components/Placeholder/Placeholder';
import Grid from '../../components/Grid/Grid';

const HomePage = () => {

    const files = [1, 2];

    if (files.length === 0) {
        return (
            <Placeholder>
                Go upload some files!
            </Placeholder>
        )
    }
    return (
        <Grid/>
    )
}

export default HomePage;

HomePage.propTypes = {
}