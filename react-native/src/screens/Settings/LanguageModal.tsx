import React, { useEffect } from 'react';
import { StyleSheet, View, ScrollView, Platform } from 'react-native';
import { Modal, Portal, Text, RadioButton, useTheme, Divider } from 'react-native-paper';
import i18n from 'i18n-js';

function LanguageModal({ visible, languages, hideModal, inputLang, setLanguage }) {
  const [value, setValue] = React.useState('en');
  const theme = useTheme();

  useEffect(() => setValue(inputLang));

  const _setLanguage = selectedLang => {
    setValue(selectedLang);
    setLanguage(selectedLang);
  };

  const languageSelectionView = (
    <RadioButton.Group onValueChange={_setLanguage} value={value}>
      {languages.map(language => (
        <View key={language.cultureName} style={styles.option}>
          <RadioButton.Item mode="android" value={language.cultureName} />
          <Text onPress={() => _setLanguage(language.cultureName)} variant="labelLarge">
            {language.displayName}
          </Text>
        </View>
      ))}
    </RadioButton.Group>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        dismissableBackButton={true}
        contentContainerStyle={{
          ...styles.themeModal,
          backgroundColor: theme.colors.background,
        }}>
        <Text variant="titleLarge">{i18n.t('AbpUi::Language')}</Text>
        <Divider style={{ marginVertical: 10 }} />
        {Platform.OS === 'ios' ? (
          <ScrollView>{languageSelectionView}</ScrollView>
        ) : (
          languageSelectionView
        )}
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  themeModal: {
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  option: { flexDirection: 'row', alignItems: 'center' },
});

export default LanguageModal;
