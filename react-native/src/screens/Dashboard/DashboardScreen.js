import React from 'react';
import { View } from 'react-native';
import { usePermission } from '../../hooks/UsePermission';
import HostDashboard from './HostDashboard';
import TenantDashboard from './TenantDashboard';

function DashboardScreen() {
  const host = usePermission('StudyZone.Dashboard.Host');
  return (
    <View style={{ paddingLeft: 16, paddingTop: 16 }}>
      {host ? <HostDashboard /> : <TenantDashboard />}
    </View>
  );
}

export default DashboardScreen;
