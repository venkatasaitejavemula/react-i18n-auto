import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { TranslationProvider, useTranslation } from 'i18n-direct-react';
import en from './translations/en.json';
import fr from './translations/fr.json';
import de from './translations/de.json';
const config = {
    defaultLanguage: 'en',
    supportedLanguages: ['en', 'fr', 'de'],
    fallbackLanguage: 'en'
};
function Inner() {
    const { t, i18n } = useTranslation();
    return (_jsxs("div", { children: [_jsx("h1", { children: t('Hello world!') }), _jsx("p", { children: t('This is a demo showing direct-text i18n.') }), _jsxs("p", { children: ["Current: ", i18n.language] })] }));
}
export default function App() {
    const [lang, setLang] = useState('en');
    return (_jsx(TranslationProvider, { language: lang, resourcesByLanguage: { en, fr, de }, config: config, children: _jsxs("div", { style: { padding: 16 }, children: [_jsxs("select", { value: lang, onChange: (e) => setLang(e.target.value), children: [_jsx("option", { value: "en", children: "English" }), _jsx("option", { value: "fr", children: "Fran\u00E7ais" }), _jsx("option", { value: "de", children: "Deutsch" })] }), _jsx(Inner, {})] }) }));
}
