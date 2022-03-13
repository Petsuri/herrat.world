#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { InfrastructureStack } from '../lib/infrastructure-stack';
import { CertificateStack } from '../lib/certificate-stack';

const app = new cdk.App();

const certificate = new CertificateStack(app, 'CertificateStack', {
  env: {
    account: '679687217907',
    region: 'eu-west-1',
  },
});
new InfrastructureStack(app, 'InfrastructureStack', {
  certificate,
  env: {
    account: '679687217907',
    region: 'eu-west-1',
  },
});
