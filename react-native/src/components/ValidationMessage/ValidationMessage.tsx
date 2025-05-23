import i18n from 'i18n-js';
import React, { forwardRef } from 'react';
import { HelperText } from 'react-native-paper';

const ValidationMessage = ({ children, translationParams = {}, ...props }) =>
    children ? (
        <HelperText type="error" {...props} visible={!!children}>
            {i18n.t(children, translationParams)}
        </HelperText>
    ) : null;

const Forwarded = forwardRef((props, ref) => <ValidationMessage children={ref} {...props} />);

export default Forwarded;
