import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

const oAuthConfig = {
  issuer: 'https://localhost:44386/',
  redirectUri: baseUrl,
  clientId: 'StudyZone_App',
  responseType: 'code',
  scope: 'offline_access StudyZone',
  requireHttps: true,
  impersonation: {
    tenantImpersonation: true,
    userImpersonation: true,
  }
};

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'StudyZone',
  },
  oAuthConfig,
  apis: {
    default: {
      url: 'https://localhost:44357',
      rootNamespace: 'LLM.StudyZone',
    },
    AbpAccountPublic: {
      url: oAuthConfig.issuer,
      rootNamespace: 'AbpAccountPublic',
    },
  },
  remoteEnv: {
    url: '/getEnvConfig',
    mergeStrategy: 'deepmerge'
  }
} as Environment;
