import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Modal, Portal, Text, RadioButton, useTheme, Divider } from 'react-native-paper';

const AbpSelect = ({
  visible,
  hideAfterSelect = true,
  hideModalFn,
  title,
  items = [],
  hasDefualtItem = false,
  selectedItem,
  setSelectedItem,
}) => {
  const sysTheme = useTheme();

  const setItem = newValue => {
    setSelectedItem(newValue);

    if (hideAfterSelect) {
      hideModalFn();
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModalFn}
        contentContainerStyle={{
          ...styles.themeModal,
          backgroundColor: sysTheme.colors.background,
        }}>
        <Text variant="titleLarge">{title}</Text>

        <Divider style={{ marginVertical: 10 }} />

        <ScrollView keyboardShouldPersistTaps="handled">
          <RadioButton.Group onValueChange={newVal => setItem(newVal)} value={selectedItem}>
            {hasDefualtItem && (
              <View key="-" style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton.Item mode="android" value={null} />
                <Text onPress={() => setItem(null)} variant="labelLarge">{'-'}</Text>
              </View>
            )}
            {items.map((item, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton.Item mode="android" key={item.id} value={item.id} />
                <Text onPress={() => setItem(item.id)} variant="labelLarge">{item.displayName}</Text>
              </View>
            ))}
          </RadioButton.Group>
        </ScrollView>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  themeModal: {
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
});

export default AbpSelect;
