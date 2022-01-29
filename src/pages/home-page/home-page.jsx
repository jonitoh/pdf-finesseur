import React from 'react';
import PropTypes from 'prop-types';
import './home-page.scoped.css';
import { withInnerNavigation } from '@pages/page-wrapper/page-wrapper';
import Placeholder from '@common/placeholder/placeholder';
import GridDND from '@components/grid/grid-dnd/grid-dnd';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useStore } from '@store';

const HomePage = ({ flexBasis = '25%' }) => {
    const {
        availablePages
    } = useStore();

    // GridWrapper props
    const gridWrapperProps = {
        backgroundImg: "",
        isEmpty: availablePages.length === 0,
        emptyChildren: (<Placeholder>Go upload some files!!</Placeholder>)
    }

    // GridItemWrapper custom style
    const gridItemWrapperStyle = {};



    return (
        <DndProvider backend={HTML5Backend}>
            <GridDND
                gridWrapperProps={gridWrapperProps}
                gridItemWrapperStyle={gridItemWrapperStyle}
                flexBasis={flexBasis}
            />
        </DndProvider>
    )
}


export default withInnerNavigation(HomePage, { putLeftButton: false, putRightButton: false, containerStyle: {} });

HomePage.propTypes = {
    flexBasis: PropTypes.string,
}