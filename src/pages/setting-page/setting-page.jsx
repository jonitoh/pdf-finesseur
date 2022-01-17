
import React from 'react';
import PropTypes from 'prop-types';
import './setting-page.css';
import Placeholder from '../../components/placeholder/placeholder';
import { withInnerNavigation } from '../page-wrapper/page-wrapper';

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