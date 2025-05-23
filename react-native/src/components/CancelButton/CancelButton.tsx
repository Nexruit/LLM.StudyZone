import React from 'react';
import { Button } from 'react-native-paper';
import { LocalizationContext } from '../../contexts/LocalizationContext';

export default function CancelButton({ onPress, title = null, icon = null }) {
  const { t } = React.useContext(LocalizationContext);

  return (
    <Button icon={icon} mode="text" onPress={onPress}>
      {title || t('AbpUi::Cancel')}
    </Button>
  );
}
