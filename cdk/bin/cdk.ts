#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CdkStack } from '../lib/cdk-stack';

const app = new cdk.App();
new CdkStack(app, 'FargateCdkStack', {
    env: {
        region: app.node.tryGetContext('region') || process.env['AWS_DEFAULT_REGION']
    }
});
