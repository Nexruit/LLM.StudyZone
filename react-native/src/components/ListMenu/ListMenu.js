import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Menu } from 'react-native-paper';

export default function ListMenu({ items, onSelect, visibleStatus = false, ...props }) {
  const [visible, setVisible] = useState(false);

  const hideModal = () => setVisible(false);

  useEffect(() => {
    setVisible(visibleStatus);
  }, [visibleStatus]);

  return (
    <Portal>
      <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.container}>
        <View>
          {items.map((item, index) => (
            <Menu.Item
              key={index}
              leadingIcon={item.icon}
              title={item.title}
              onPress={item.onPress}
            />
          ))}
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 10,
  },
});
