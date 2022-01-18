import React from 'react';
import './language-selector.css';
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
        <div>
            <h3>{t("choose-lang")}</h3>
            <select
                value={lang}
                onChange={handleChange}
            >
                {getOptions()
                    .map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))
                }
            </select>
        </div>
    )
};

export default LanguageSelector;

LanguageSelector.propTypes = {
}
