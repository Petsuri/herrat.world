#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CertificateStack } from '../lib/certificate-stack';
import { KalastajaHerratStack } from '../lib/kalastaja-herrat/kalastaja-herrat-stack';

const app = new cdk.App();

new CertificateStack(app, 'CertificateStack', {
  env: {
    account: '679687217907',
    region: 'us-east-1',
  },
});

new KalastajaHerratStack(app, 'KalastajaHerrat', {
  hostedZoneDomainName: 'herrat.world',
  certificateArn:
    'arn:aws:acm:us-east-1:679687217907:certificate/9b2aec89-2dab-42f9-8adf-56757be3ec56',
  loginCertificateArn:
    'arn:aws:acm:us-east-1:679687217907:certificate/28ffc23c-2602-4afd-bf4d-446b9b1e334e',
  env: {
    account: '679687217907',
    region: 'eu-west-1',
  },
});
