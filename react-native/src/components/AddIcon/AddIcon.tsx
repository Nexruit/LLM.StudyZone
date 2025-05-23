import React from 'react';
import { Button } from 'react-native-paper';
import { LocalizationContext } from '../../contexts/LocalizationContext';

export default function AddIcon({ onPress, title = null }) {
  const { t } = React.useContext(LocalizationContext);

  return (
    <Button icon="plus" mode="text" onPress={onPress} textColor="#27AE60">
      {title || t('AbpUi::AddNew')}
    </Button>
  );
}
