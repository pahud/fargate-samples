import cdk = require('@aws-cdk/core');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns');
import * as logs from '@aws-cdk/aws-logs';
import path = require('path');

export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', { 
      isDefault: true
     })

     const cluster = new ecs.Cluster(this, 'Cluster', {
       vpc
     })

     const taskDef = new ecs.TaskDefinition(this, 'Task', {
       compatibility: ecs.Compatibility.FARGATE,
       cpu: '4096',
       memoryMiB: '8192',
     })

    const nginx = taskDef.addContainer('nginx', {
      image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../../', 'dockerAssets.d/nginx')),
      logging: ecs.AwsLogDriver.awsLogs({
        logRetention: logs.RetentionDays.ONE_MONTH,
        streamPrefix: 'nginx'
      })
    })

    nginx.addPortMappings({
      containerPort: 80
    })

     const express = taskDef.addContainer('express', {
        image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../../', 'dockerAssets.d/expressService')),
        logging: ecs.AwsLogDriver.awsLogs({
          logRetention: logs.RetentionDays.ONE_MONTH,
          streamPrefix: 'express'
        })
     })


     const svc = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Svc', {
       taskDefinition: taskDef,
       cluster,
       listenerPort: 80
     })

    svc.targetGroup.setAttribute('deregistration_delay.timeout_seconds', '30')
    svc.targetGroup.configureHealthCheck({
      interval: cdk.Duration.seconds(5),
      healthyHttpCodes: '200',
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 3,
      timeout: cdk.Duration.seconds(4),
    })
  }
}
