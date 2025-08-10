import React, { useState } from 'react';
import { TranslationProvider, useTranslation } from 'i18n-direct-react';
import en from './translations/en.json';
import fr from './translations/fr.json';
import de from './translations/de.json';

const config = {
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'fr', 'de'],
  fallbackLanguage: 'en'
} as const satisfies { defaultLanguage: string; supportedLanguages: string[]; fallbackLanguage: string };

function Inner() {
  const { t, i18n } = useTranslation();
  return (
    <div>
      <h1>{t('Hello world!')}</h1>
      <p>{t('This is a demo showing direct-text i18n.')}</p>
      <p>Current: {i18n.language}</p>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState('en');

  return (
    <TranslationProvider language={lang} resourcesByLanguage={{ en, fr, de }} config={config}>
      <div style={{ padding: 16 }}>
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
        </select>
        <Inner />
      </div>
    </TranslationProvider>
  );
}