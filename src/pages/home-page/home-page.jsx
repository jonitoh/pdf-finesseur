
import React from 'react';
import PropTypes from 'prop-types';
import './home-page.css';
import Placeholder from '../../components/placeholder/placeholder';
import Grid from '../../components/grid/grid-dnd-home';
import { withInnerNavigation } from '../page-wrapper/page-wrapper';
import { useStore } from '../../store';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

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
        <DndProvider backend={HTML5Backend}>
            <Grid />
        </DndProvider>
    )
}

export default withInnerNavigation(HomePage, false);

HomePage.propTypes = {
}