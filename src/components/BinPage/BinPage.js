
import React from 'react';
import PropTypes from 'prop-types';
import './BinPage.css';
import Placeholder from '../../components/Placeholder/Placeholder';
import { useStore } from '../../store';

const BinPage = () => {

    const { getNumberOfDeletedPages, deletedPages } = useStore();

    if (getNumberOfDeletedPages() === 0) {
        return (
            <Placeholder>
                Nothing here!
            </Placeholder>
        )
    }
    return (
        <Placeholder>
            <ul>
                {deletedPages
                    .map(page => {
                        return <li key={page.id}>Deleted page {page.id}</li>
                    })}
            </ul>
        </Placeholder>
    )
}

export default BinPage;

BinPage.propTypes = {
}