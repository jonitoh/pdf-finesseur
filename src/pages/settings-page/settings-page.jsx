
import React from 'react';
import PropTypes from 'prop-types';
import './settings-page.scoped.css';
import LanguageSelector from '@components/language-selector/language-selector';
import ThemeSelector from '@components/theme-selector/theme-selector';
import { withInnerNavigation } from '@pages/page-wrapper/page-wrapper';

const SettingsPage = () => {
    return (
        <div className='wrapper'>
            <LanguageSelector />
            <br/>
            <ThemeSelector />
        </div>
    )
}

export default withInnerNavigation(SettingsPage);

SettingsPage.propTypes = {
}