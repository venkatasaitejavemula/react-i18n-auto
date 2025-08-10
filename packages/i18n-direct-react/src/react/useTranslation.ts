import { useI18nContext } from '../provider/TranslationProvider';

export function useTranslation() {
  const { t, language } = useI18nContext();
  return { t, i18n: { language } } as const;
}