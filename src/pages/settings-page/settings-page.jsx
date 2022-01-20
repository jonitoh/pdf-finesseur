
import React from 'react';
import PropTypes from 'prop-types';
import './settings-page.css';
import LanguageSelector from '../../components/language-selector/language-selector';
import ThemeSelector from '../../components/theme-selector/theme-selector';
import { withInnerNavigation } from '../page-wrapper/page-wrapper';

const SettingsPage = () => {
    //Here are the settings! (to-do: dark mode)
    return (
        <div className='settings-wrapper'>
            <LanguageSelector />
            <ThemeSelector />
        </div>
    )
}

export default withInnerNavigation(SettingsPage);

SettingsPage.propTypes = {
}