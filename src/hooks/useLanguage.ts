import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '@/i18n/config';

export const useLanguage = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
  };

  const getCurrentLanguage = () => {
    return i18n.language;
  };

  const getSupportedLanguages = () => {
    return supportedLanguages;
  };

  const getLanguageFlag = (langCode: string) => {
    return supportedLanguages[langCode as keyof typeof supportedLanguages]?.flag || '🌐';
  };

  const getLanguageName = (langCode: string) => {
    return supportedLanguages[langCode as keyof typeof supportedLanguages]?.name || langCode;
  };

  return {
    changeLanguage,
    getCurrentLanguage,
    getSupportedLanguages,
    getLanguageFlag,
    getLanguageName,
    currentLanguage: i18n.language,
    isRTL: false, // European languages are LTR
  };
};