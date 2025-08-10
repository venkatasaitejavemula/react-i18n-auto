import React from 'react';
import type { I18nContextValue, I18nConfig, LanguageCode, TranslationResources } from '../types';
export interface TranslationProviderProps {
    children: React.ReactNode;
    language?: LanguageCode;
    resources?: TranslationResources;
    resourcesByLanguage?: Record<LanguageCode, Record<string, string>>;
    config: I18nConfig;
    mode?: 'dev' | 'prod';
    onResourcesChange?: (resources: TranslationResources) => void;
}
export declare const TranslationProvider: React.FC<TranslationProviderProps>;
export declare const useI18nContext: () => I18nContextValue;
