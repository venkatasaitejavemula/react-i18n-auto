import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { I18nContextValue, I18nConfig, LanguageCode, TranslationResources } from '../types';
import { translateTextBatch } from '../services/translator';
import { generateStableKey } from '../services/keygen';

const I18nContext = createContext<I18nContextValue | null>(null);

export interface TranslationProviderProps {
  children: React.ReactNode;
  language?: LanguageCode;
  resources?: TranslationResources; // key -> { lang: value }
  resourcesByLanguage?: Record<LanguageCode, Record<string, string>>; // lang -> { key: value }
  config: I18nConfig;
  mode?: 'dev' | 'prod';
  onResourcesChange?: (resources: TranslationResources) => void;
}

function normalizeResources(
  input?: TranslationResources,
  byLang?: Record<LanguageCode, Record<string, string>>
): TranslationResources {
  if (input) return input;
  const out: TranslationResources = {};
  if (!byLang) return out;
  for (const [lang, map] of Object.entries(byLang)) {
    for (const [key, value] of Object.entries(map)) {
      out[key] = out[key] || {};
      out[key][lang] = value;
    }
  }
  return out;
}

const defaultMode: 'dev' | 'prod' =
  (typeof globalThis !== 'undefined' && (globalThis as any).process?.env?.NODE_ENV === 'production')
    ? 'prod'
    : 'dev';

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
  language: initialLanguage,
  resources: initialResources,
  resourcesByLanguage,
  config,
  mode = defaultMode,
  onResourcesChange
}) => {
  const [language, setLanguage] = useState<LanguageCode>(
    initialLanguage ?? config.defaultLanguage
  );
  const resourcesRef = useRef<TranslationResources>(
    normalizeResources(initialResources, resourcesByLanguage)
  );
  const pendingRef = useRef<Set<string>>(new Set());

  const t = useCallback(
    (text: string, options?: { defaultValue?: string }) => {
      const key = generateStableKey(text);
      const langMap = resourcesRef.current[key] || {};

      const fallbackLanguage = config.fallbackLanguage ?? config.defaultLanguage;
      const chosen = langMap[language] ?? langMap[fallbackLanguage];
      const defaultValue = options?.defaultValue ?? text;

      if (chosen) return chosen;

      if (mode === 'dev' && !pendingRef.current.has(key)) {
        pendingRef.current.add(key);
        const targets = config.supportedLanguages.filter(Boolean);
        translateTextBatch(text, targets)
          .then((translations) => {
            const next = { ...resourcesRef.current };
            next[key] = next[key] || {};
            for (const [lang, value] of Object.entries(translations)) {
              next[key][lang] = value;
            }
            resourcesRef.current = next;
            onResourcesChange?.(next);
          })
          .finally(() => {
            pendingRef.current.delete(key);
          });
      }

      return defaultValue;
    },
    [language, config.defaultLanguage, config.fallbackLanguage, config.supportedLanguages, mode, onResourcesChange]
  );

  const value = useMemo<I18nContextValue>(
    () => ({ language, setLanguage, t, resources: resourcesRef.current, mode }),
    [language, t, mode]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18nContext = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('TranslationProvider missing in tree');
  return ctx;
};