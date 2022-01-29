import React from 'react';
//import './language-selector.scoped.css';
import Selector from '@common/selector/selector';
import { useStore } from '../../store';

const LanguageSelector = () => {

    const {
        lang,
        setLang,
        getAllLanguagesAsOptions,
        t,
    } = useStore();

    const handleChange = event => {
        setLang(event.target.value);
    };

    return (
        <Selector
            label={t("choose-lang")}
            value={lang}
            options={getAllLanguagesAsOptions()}
            onChange={handleChange}
        />
    )
};

export default LanguageSelector;

LanguageSelector.propTypes = {
}
