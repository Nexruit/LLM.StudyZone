import React, { useEffect, useState } from 'react';
import i18n from 'i18n-js';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Modal, Portal, Text, RadioButton, useTheme, Divider } from 'react-native-paper';

function TenantEditionSelect({
  visible,
  editions = [],
  selectedEditon,
  setSelectedEdition,
  hideModal,
}) {
  const sysTheme = useTheme();

  const _setEdtion = newValue => {
    setSelectedEdition({
      id: newValue,
      displayName: editions.find(e => e.id === newValue)?.displayName ?? '',
    });
    hideModal();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={{
          ...styles.themeModal,
          backgroundColor: sysTheme.colors.background,
        }}>
        <Text variant="titleLarge">{i18n.t('Saas::Editions')}</Text>

        <Divider style={{ marginVertical: 10 }} />

        <ScrollView keyboardShouldPersistTaps="handled">
          <RadioButton.Group onValueChange={newVal => _setEdtion(newVal)} value={selectedEditon}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton value={null} />
              <Text variant="labelLarge">{'Edition'}</Text>
            </View>
            {editions.map(item => (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <RadioButton value={item.id} />
                <Text variant="labelLarge">{item.displayName}</Text>
              </View>
            ))}
          </RadioButton.Group>
        </ScrollView>
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

export default TenantEditionSelect;
