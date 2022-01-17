
import React from 'react';
import PropTypes from 'prop-types';
import './HomePage.css';
import Placeholder from '../../components/Placeholder/Placeholder';
import Grid from '../../components/Grid/Grid';
import { useStore } from '../../store';

const HomePage = () => {
 
    const { getNumberOfDocuments } = useStore();

    if (getNumberOfDocuments() === 0) {
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