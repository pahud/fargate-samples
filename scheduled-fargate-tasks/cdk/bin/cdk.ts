#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { CloudWatchScheduledEventsFargateTask, CloudWatchScheduledEventsLambdaFargateTask } from '../lib/cdk-stack';

const app = new cdk.App();

const env = {
  region: app.node.tryGetContext('region') || process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
  account: app.node.tryGetContext('account') || process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT
};

new CloudWatchScheduledEventsFargateTask(app, 'FargateScheduledTasks', { env });
new CloudWatchScheduledEventsLambdaFargateTask(app, 'FargateScheduledTasksLambda', { env });
