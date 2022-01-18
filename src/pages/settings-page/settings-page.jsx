
import React from 'react';
import PropTypes from 'prop-types';
import './settings-page.css';
import Placeholder from '../../components/placeholder/placeholder';
import LanguageSelector from '../../components/language-selector/language-selector';
import { withInnerNavigation } from '../page-wrapper/page-wrapper';

const SettingsPage = () => {
    //Here are the settings! (to-do: dark mode)
    return (
        <Placeholder>
            <LanguageSelector/>
        </Placeholder>
    )
}

export default withInnerNavigation(SettingsPage);

SettingsPage.propTypes = {
}