import React from 'react';
import PropTypes from 'prop-types';
import './bin-page.scoped.css';
import { withInnerNavigation } from '@pages/page-wrapper/page-wrapper';
import Placeholder from '@common/placeholder/placeholder';
import GridCore from '@components/grid/grid-core/grid-core';
import { OneClickCard } from '@components/card/dummy-card/dummy-card';
import { useStore } from '@store';


const BinPage = ({ flexBasis = '25%' }) => {
    const {
        deletedPages: gridItems,
        removePageByIdFromDeletedPages,
        addAvailablePage
    } = useStore();

    // GridWrapper props
    const gridWrapperProps = {
        backgroundImg: "",
        isEmpty: gridItems.length === 0,
        emptyChildren: (<Placeholder>Nothing here!</Placeholder>)
    }

    // GridItemWrapper props
    const gridItemWrapperProps = {};

    // removeFromGrid aka restaurer aka remove deleted page and add into available pages
    const removeFromGrid = itemId => {
        console.log(`WE are TRYING TO RESTORE A CARD WITH THE ID ${itemId}`)
        const removedItem = gridItems.find(item => item.id === itemId);
        removePageByIdFromDeletedPages(itemId);
        if (removedItem) {
            addAvailablePage(removedItem);
        }
    }

    const renderItem = item => (
        <OneClickCard
            text={item.name}
            onClick={() => removeFromGrid(item.id)}
            clickLabel={"restore"}
        />
    );


    return (
        <GridCore
            gridItems={gridItems}
            gridWrapperProps={gridWrapperProps}
            gridItemWrapperProps={gridItemWrapperProps}
            renderItem={renderItem}
            flexBasis={flexBasis}
        />
    )
}

export default withInnerNavigation(BinPage);

BinPage.propTypes = {
    flexBasis: PropTypes.string,
}
