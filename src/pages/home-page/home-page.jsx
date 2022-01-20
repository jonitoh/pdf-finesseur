
import React from 'react';
import PropTypes from 'prop-types';
import './home-page.css';
import Placeholder from '../../components/placeholder/placeholder';
import Grid from '../../components/grid/grid-home';
import { withInnerNavigation } from '../page-wrapper/page-wrapper';
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

export default withInnerNavigation(HomePage, false);

HomePage.propTypes = {
}