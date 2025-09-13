import { useLanguage } from '../contexts/LanguageContext';

export const useTranslations = () => {
  return useLanguage();
};
