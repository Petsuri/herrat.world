#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { HerratStack } from '../lib/herrat-stack';

const app = new cdk.App();

new HerratStack(app, 'InfrastructureStack', {
  env: {
    account: '679687217907',
    region: 'eu-west-1',
  },
});
