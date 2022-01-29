import React from 'react';
import PropTypes from 'prop-types';
import './grid-core.scoped.css';
import GridWrapper from '@components/grid/grid-wrapper/grid-wrapper';
import GridItemWrapper from '@components/grid/grid-item-wrapper/grid-item-wrapper';

const GridCore = ({ gridItems, renderItem, gridWrapperProps = {}, gridItemWrapperProps = {}, flexBasis = '25%' }) => {
    // gridWrapperProps = { backgroundImg = "", isEmpty = true, emptyChildren = null }
    // gridItemWrapperProps = { wrapperStyle = {} }

    const calculateFlexBasis = (flexBasis) => {
        if (window.innerWidth >= 767) {
            return flexBasis
        } else if (window.innerWidth >= 480) {
            return '50%'
        } else {
            return '100%'
        }
    }
    // in order to customize the number of rows
    const responsiveStyle = { flexBasis: calculateFlexBasis(flexBasis) };

    return (
        <GridWrapper {...gridWrapperProps} >
            {gridItems.map(item =>(
                <GridItemWrapper key={item.id} {...{...gridItemWrapperProps, ...responsiveStyle}}>
                    {renderItem(item)}
                </GridItemWrapper>)
            )}
        </GridWrapper>
    )
}

export default GridCore;



GridCore.propTypes = {
    gridItems: PropTypes.array,
    renderItem: PropTypes.func,
    gridWrapperProps: PropTypes.object,
    gridItemWrapperProps: PropTypes.object,
    flexBasis: PropTypes.string
}