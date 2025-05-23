import { Environment } from '@study-zone/models';

const yourIP = 'Your Local IP Address etc 192.168.1.64'; // See the docs https://docs.abp.io/en/abp/latest/Getting-Started-React-Native?Tiered=No
const apiUrl = `http://${yourIP}:44357`;
const dev = {
    apiUrl,
    appUrl: `exp://${yourIP}:19000`,
    oAuthConfig: {
        issuer: apiUrl,
        clientId: 'StudyZone_Mobile',
        scope: 'offline_access StudyZone',
    },
    localization: {
        defaultResourceName: 'StudyZone',
    },
} as Environment;

const prod = {
    apiUrl,
    appUrl: `exp://${yourIP}:19000`,
    oAuthConfig: {
        issuer: `http://${yourIP}:44386`,
        clientId: 'StudyZone_Mobile',
        scope: 'offline_access StudyZone',
    },
    localization: {
        defaultResourceName: 'StudyZone',
    },
} as Environment;

const ENV = { dev, prod };

export const getEnvVars = () => {
    // eslint-disable-next-line no-undef
    return __DEV__ ? ENV.dev : ENV.prod;
};
