import { createI18n } from 'vue-i18n';

const messages = {
  en: {
    welcome: 'Welcome',
  },
  uz: {
    welcome: 'Xush kelibsiz',
  },
  ru: {
    welcome: 'Добро пожаловать',
  }
};

const i18n = createI18n({
  locale: 'uz', // Boshlang'ich til
  fallbackLocale: 'en', // Agar til topilmasa, zaxira til
  messages,
});

export default i18n;
