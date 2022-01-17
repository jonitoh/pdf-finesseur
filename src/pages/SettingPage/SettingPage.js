
import React from 'react';
import PropTypes from 'prop-types';
import './SettingPage.css';
import Placeholder from '../../components/Placeholder/Placeholder';
import { withInnerNavigation } from '../PageWrapper/PageWrapper';

const SettingPage = () => {
 
    return (
        <Placeholder>
            Here are the settings! (lang and dark mode)
        </Placeholder>
    )
}

export default withInnerNavigation(SettingPage);

SettingPage.propTypes = {
}