import { useI18nContext } from '../provider/TranslationProvider';

export function useI18n() {
  return useI18nContext();
}