import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { createLanguageSelector } from '../store/selectors/AppSelectors';
import i18n from 'i18n-js';

const useLocalizedTitle = key => {
    const language = useSelector(state => createLanguageSelector()(state));
    const [localizedTitle, setLocalizedTitle] = useState('');

    useEffect(() => {
        if (language?.cultureName) {
            try {
                i18n.locale = language.cultureName;

                const title = i18n.t(key, { defaultValue: key });
                setLocalizedTitle(title);
            } catch (error) {
                console.error('Error updating language or fetching translation:', error);
            }
        } else {
            setLocalizedTitle(i18n.t(key, { defaultValue: key }));
        }
    }, [language, key]);

    return localizedTitle;
};

export default useLocalizedTitle;
