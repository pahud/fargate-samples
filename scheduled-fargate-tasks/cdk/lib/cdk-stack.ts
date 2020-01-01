import cdk = require('@aws-cdk/core');
import { Rule, Schedule } from '@aws-cdk/aws-events';
import { EcsTask, LambdaFunction } from '@aws-cdk/aws-events-targets';
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import sqs = require('@aws-cdk/aws-sqs');
import logs = require('@aws-cdk/aws-logs');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import path = require('path');

export class CloudWatchScheduledEventsFargateTask extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'Queue')

    const vpc = this.node.tryGetContext('USE_DEFAULT_VPC') == 1 ? ec2.Vpc.fromLookup(this, 'Vpc', { isDefault: true }) : new ec2.Vpc(this, 'Vpc', {
      maxAzs: 3,
      natGateways: 1
    })

    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc
    })

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'Task', {
      memoryLimitMiB: 512,
      cpu: 256,
    })

    const awscli = taskDefinition.addContainer('awscli', {
      image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../../', 'dockerAssets.d')),
      environment: {
        'SQS_QUEUE_URL': queue.queueUrl,
        'AWS_REGION': this.region,
        'AWS_DEFAULT_REGION': this.region
      },
      command: [
        'sh',
        '-c',
        'aws sqs send-message --queue-url $SQS_QUEUE_URL --message-body CDK_TEST'
      ],
      entryPoint: [''],
      logging: new ecs.AwsLogDriver({
        logRetention: logs.RetentionDays.ONE_MONTH,
        streamPrefix: 'hello'
      }) 
    })

    const ecsTaskTarget = new EcsTask({ cluster, taskDefinition });

    new Rule(this, 'ScheduleRule', {
      // schedule: Schedule.cron({ minute: '0', hour: '4' }),
      schedule: Schedule.rate(cdk.Duration.minutes(1)),
      targets: [ecsTaskTarget],
    });

    queue.grantSendMessages(taskDefinition.taskRole)
  }
}


export class CloudWatchScheduledEventsLambdaFargateTask extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'Queue')

    const vpc = this.node.tryGetContext('USE_DEFAULT_VPC') == 1 ? ec2.Vpc.fromLookup(this, 'Vpc', { isDefault: true }) : new ec2.Vpc(this, 'Vpc', {
      maxAzs: 3,
      natGateways: 1
    })

    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc
    })

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'Task', {
      memoryLimitMiB: 512,
      cpu: 256,
    })

    const awscli = taskDefinition.addContainer('awscli', {
      image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../../', 'dockerAssets.d')),
      environment: {
        'SQS_QUEUE_URL': queue.queueUrl,
        'AWS_REGION': this.region,
        'AWS_DEFAULT_REGION': this.region
      },
      command: [
        'sh',
        '-c',
        'aws sqs send-message --queue-url $SQS_QUEUE_URL --message-body CDK_TEST'
      ],
      entryPoint: [''],
      logging: new ecs.AwsLogDriver({
        logRetention: logs.RetentionDays.ONE_MONTH,
        streamPrefix: 'hello'
      })
    })

    const handler = new lambda.Function(this, 'Func', {
      runtime: lambda.Runtime.PYTHON_3_7,
      environment: {
        'TASK_DEFINITION_ARN': taskDefinition.taskDefinitionArn,
        'CLUSTER_NAME': cluster.clusterName,
        'REGION': this.region,
        'SUBNETS': vpc.privateSubnets.map(s=>s.subnetId).join(','),
        'SECURITY_GROUPS': new ec2.SecurityGroup(this, 'SG', {
          vpc
        }).securityGroupId

      },
      code: new lambda.InlineCode(`
import boto3
import os
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
  ecs = boto3.client('ecs')
  response = ecs.run_task(
    cluster=os.environ['CLUSTER_NAME'],
    count=1,
    launchType='FARGATE',
    taskDefinition=os.environ['TASK_DEFINITION_ARN'],
    networkConfiguration={
      'awsvpcConfiguration': {
        'subnets': os.environ['SUBNETS'].split(','),
        'securityGroups': os.environ['SECURITY_GROUPS'].split(','),
        'assignPublicIp': 'DISABLED',
      }
    }
  )
  logger.info(response)
`),
      handler: 'index.handler',
    })

    const LambdaFuncTarget = new LambdaFunction(handler)

    new Rule(this, 'ScheduleRule', {
      // schedule: Schedule.cron({ minute: '0', hour: '4' }),
      schedule: Schedule.rate(cdk.Duration.minutes(1)),
      targets: [LambdaFuncTarget],
    });

    // queue.grantSendMessages(handler.role!)
    handler.role!.addToPolicy(new iam.PolicyStatement({
      actions: ['ecs:RunTask'],
      resources: [`${taskDefinition.taskDefinitionArn}`]
    }))

    handler.role!.addToPolicy(new iam.PolicyStatement({
      actions: ['iam:PassRole'],
      resources: [
        `${taskDefinition.executionRole?.roleArn}`,
        `${taskDefinition.taskRole.roleArn}`,
    ]
    }))

    queue.grantSendMessages(taskDefinition.taskRole)


  }
}
