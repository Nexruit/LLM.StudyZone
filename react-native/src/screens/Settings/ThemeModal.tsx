import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Modal, Portal, Text, RadioButton, useTheme, Divider } from 'react-native-paper';

function ThemeModal({ visible, hideModal, inputTheme, outSetTheme }) {
  const [theme, setTheme] = useState('System');
  const sysTheme = useTheme();

  const _setTheme = newValue => {
    setTheme(newValue);
    outSetTheme(newValue);
  };

  useEffect(() => setTheme(inputTheme));

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={{
          ...styles.themeModal,
          backgroundColor: sysTheme.colors.background,
        }}>
        <Text variant="titleLarge">Device theme</Text>

        <Divider style={{ marginVertical: 10 }} />

        <RadioButton.Group onValueChange={newVal => _setTheme(newVal)} value={theme}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton.Item mode="android" value="System" />
            <Text onPress={() => _setTheme('System')} variant="labelLarge">
              System
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton.Item mode="android" value="Light" />
            <Text onPress={() => _setTheme('Light')} variant="labelLarge">
              Light
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <RadioButton.Item mode="android" value="Dark" />
            <Text onPress={() => _setTheme('Dark')} variant="labelLarge">
              Dark
            </Text>
          </View>
        </RadioButton.Group>
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
});

export default ThemeModal;
