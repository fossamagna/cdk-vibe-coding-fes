#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VibeCodingStack } from '../lib/vibe-coding-stack';

const app = new cdk.App();
new VibeCodingStack(app, 'VibeCodingStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});