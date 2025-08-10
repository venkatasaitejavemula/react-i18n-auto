export type LanguageCode = string;
export type TranslationResources = Record<string, Record<LanguageCode, string>>;
export type TranslationResourcesByLanguage = Record<LanguageCode, Record<string, string>>;
export interface I18nConfig {
    defaultLanguage: LanguageCode;
    supportedLanguages: LanguageCode[];
    fallbackLanguage?: LanguageCode;
}
export interface I18nContextValue {
    language: LanguageCode;
    setLanguage: (lang: LanguageCode) => void;
    t: (text: string, options?: {
        defaultValue?: string;
    }) => string;
    resources: TranslationResources;
    mode: 'dev' | 'prod';
}
