import React from 'react';
import PropTypes from 'prop-types';
import './upload-grid.scoped.css';
import Placeholder from '@common/placeholder/placeholder';
import GridCore from '@components/grid/grid-core/grid-core';
import { TwoClickImg } from '@components/card/dummy-card/dummy-card';
import { useStore } from '@store';

const UploadGrid = ({ flexBasis = '25%' }) => {
    const {
        documents: gridItems,
        deletedPages,
        removePagesByDocumentFromDeletedPages,
        removeDocument,
        addAvailablePage,
        removePageByIdFromDeletedPages,
    } = useStore();

    // GridWrapper props
    const gridWrapperProps = {
        backgroundImg: "",
        isEmpty: gridItems.length === 0,
        emptyChildren: (<Placeholder>Upload some file !</Placeholder>),
        style: {flexGrow: 1},
    }

    // GridItemWrapper props
    const gridItemWrapperProps = {};

    // removeFromGrid aka remove document forever
    const removeFromGrid = itemId => {
        console.log(`WE are TRYING TO REMOVE A DOCUMENT WITH THE ID ${itemId}`)
        removeDocument(itemId);
        removePagesByDocumentFromDeletedPages(itemId);
    }

    // restaurer à la chaine
    const restoreAll = itemId => {
        console.log(`restore all the pages from the document ${itemId}`);
        [...deletedPages]
            .filter(page => page.docId === itemId)
            .forEach(page => {
                addAvailablePage(page);
                removePageByIdFromDeletedPages(page.id);
            })
    }

    const renderItem = item => (
        <TwoClickImg
            text={item.name}
            firstLabel="Remove All"
            firstOnClick={() => removeFromGrid(item.id)}
            secondLabel="Restore All"
            secondOnClick={() => restoreAll(item.id)}
            imgSrc={item.url}
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

export default UploadGrid;

UploadGrid.propTypes = {
    fBasis: PropTypes.string
}