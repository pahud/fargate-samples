import cdk = require('@aws-cdk/core');
import ecs = require('@aws-cdk/aws-ecs');
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns');
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import logs = require('@aws-cdk/aws-logs');
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');
import path = require('path');


export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = this.node.tryGetContext('USE_DEFAULT_VPC') == 1 ?  ec2.Vpc.fromLookup(this, 'Vpc', { isDefault: true }) : new ec2.Vpc(this, 'Vpc', {
      maxAzs: 3, 
      natGateways: 1
    })

    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc
    })

    const task = new ecs.FargateTaskDefinition(this, 'Task', {
      cpu: 256,
      memoryLimitMiB: 512,
    })

    var defaultContainer = task.addContainer('web', {
      image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../../', 'dockerAssets.d')),
      logging: new ecs.AwsLogDriver({
        logRetention: logs.RetentionDays.ONE_MONTH,
        streamPrefix: 'hello'
      })
    })


    task.taskRole.addToPolicy(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['ecs:DescribeTasks', 'ec2:DescribeNetworkInterfaces']
    }))

    const svc = new ecs.FargateService(this, 'Svc', {
      assignPublicIp: true,
      taskDefinition: task,
      cluster
    })

    defaultContainer.addPortMappings({
      containerPort: 80
    })

    const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', { vpc, internetFacing: true });
    const listener = lb.addListener('PublicListener', { port: 80 });
    svc.registerLoadBalancerTargets(
      {
        containerName: 'web',
        newTargetGroupId: 'ECS',
        containerPort: 80,
        listener: ecs.ListenerConfig.applicationListener(listener),
      },
    )

    new cdk.CfnOutput(this, 'ServiceURL', {
      value: `http://${lb.loadBalancerDnsName}`
    })
  }
}
