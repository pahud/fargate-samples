import cdk = require('@aws-cdk/core');
import ecs = require('@aws-cdk/aws-ecs');
import ecsPatterns = require('@aws-cdk/aws-ecs-patterns');



export class CdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const vpc = new ec2.Vpc(this, 'VPC');
    // const cluster = new ecs.Cluster(this, 'Cluster', { 
    //   vpc: vpc
    // });

    new ecsPatterns.LoadBalancedFargateService(this, 'Service', {
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
    })

  }
}
