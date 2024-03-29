import {StateCreator} from 'zustand';
import {createPersistedState} from './createPersistedState';
import {getSupportedLocale} from '../../contexts/IntlContext';
import {getLocales} from 'expo-localization';

type LocaleSlice = {
  locale: string;
  setLocale: (locale: string) => void;
};

const localeSlice: StateCreator<LocaleSlice> = (set, get) => ({
  locale: getSupportedLocale(getLocales()[0].languageTag) || 'en',
  setLocale: newlocale => set({locale: newlocale}),
});

export const usePersistedLocale = createPersistedState(
  localeSlice,
  'MapeoLocale',
);
