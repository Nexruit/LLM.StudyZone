import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { getAllRoles } from '../../api/IdentityAPI';

type EditingUser = { id: string };

function UserRoles({ editingUser = {} as EditingUser, ownedRoles = [], onChangeRoles }) {
  const [roles, setRoles] = useState([]);

  const onPress = index => {
    setRoles(
      roles.map((role, i) => ({
        ...role,
        isSelected: index === i ? !role.isSelected : role.isSelected,
      })),
    );
  };

  useEffect(() => {
    getAllRoles().then((allRoles = []) => {
      if (editingUser.id) {
        setRoles(
          allRoles.map(role => ({
            ...role,
            isSelected: editingUser.id
              ? !!ownedRoles?.find(userRole => userRole?.id === role?.id)
              : role.isDefault,
          })),
        );
      } else {
        setRoles(
          allRoles.map(role => {
            role.isSelected = role.isDefault;

            if (ownedRoles?.find(userRole => userRole?.id === role?.id)) {
              role.isSelected = true;
            }

            return role;
          }),
        );
      }
    });
  }, []);

  useEffect(() => {
    onChangeRoles(roles.filter(role => role.isSelected));
  }, [roles]);

  return (
    <>
      {roles.map((role, index) => (
        <View key={index} style={rolesStyles.checkbox}>
          <Checkbox.Item
            key={index}
            label={role.name}
            labelVariant="bodyLarge"
            mode="android"
            status={role.isSelected ? 'checked' : 'unchecked'}
            position="leading"
            onPress={() => onPress(index)}
            labelStyle={{ fontWeight: '500', fontSize: 16 }}></Checkbox.Item>
        </View>
      ))}
    </>
  );
}

const rolesStyles = StyleSheet.create({
  checkbox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

UserRoles.propTypes = {
  editingUser: PropTypes.objectOf(PropTypes.any).isRequired,
  ownedRoles: PropTypes.array.isRequired,
  onChangeRoles: PropTypes.func.isRequired,
};

export default UserRoles;
