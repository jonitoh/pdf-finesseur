import React from 'react';
import './language-selector.css';
import Selector from '../selector/selector';
import { useStore } from '../../store';

const LanguageSelector = () => {

    const {
        lang,
        setLang,
        getOptions,
        t,
    } = useStore();

    const handleChange = event => {
        setLang(event.target.value);
    };

    return (
        <Selector
            label={t("choose-lang")}
            value={lang}
            options={getOptions()}
            onChange={handleChange}
        />
    )
};

export default LanguageSelector;

LanguageSelector.propTypes = {
}
