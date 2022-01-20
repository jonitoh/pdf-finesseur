
import React from 'react';
import PropTypes from 'prop-types';
import './bin-page.css';
import { withInnerNavigation } from '../page-wrapper/page-wrapper';
import Placeholder from '../../components/placeholder/placeholder';
import { useStore } from '../../store';
import Grid from '../../components/grid/grid-bin';

const BinPage = () => {

    const {
        getNumberOfDeletedPages,
    } = useStore();

    if (getNumberOfDeletedPages() === 0) {
        return (
            <Placeholder>
                Nothing here!
            </Placeholder>
        )
    }
    return (
        <Grid/>
    )
}

export default withInnerNavigation(BinPage);

BinPage.propTypes = {
}