import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { usePermission } from '../hooks/UsePermission';

export function withPermission(Component, policyKey) {
  const Forwarded = forwardRef((props: { policyKey: string }, ref) => {
    const key = policyKey || props.policyKey;
    const isGranted = !!key ? usePermission(key) : true;
    return isGranted ? <Component ref={ref} {...props} /> : null;
  });

  Forwarded.propTypes = { policyKey: PropTypes.string };

  return Forwarded;
}
