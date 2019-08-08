import cdk = require("@aws-cdk/core");
import ec2 = require("@aws-cdk/aws-ec2");
import ecs = require("@aws-cdk/aws-ecs");
import elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");

class FargateCdkStack extends cdk.Stack {

    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        //new vpc
        const vpc = new ec2.Vpc(this, 'cdk-fargate-vpc', {
            cidr: '10.100.0.0/16',
            maxAzs: 3
        });

        //sg for HTTP public access
        const httpPublicSecurityGroup = new ec2.SecurityGroup(this, "HttpPublicSecurityGroup", {
            allowAllOutbound: true,
            securityGroupName: 'HttpPublicSecurityGroup',
            vpc: vpc
        });

        httpPublicSecurityGroup.connections.allowFromAnyIpv4(ec2.Port.tcp(80));

        // // Fargate Cluster
        const fgCluster = new ecs.Cluster(this, 'fgCluster', {
            vpc: vpc
        });

        // ECS task definition
        const demoTaskDef = new ecs.FargateTaskDefinition(this, 'cdk-fargate-demo-taskdef', {
            cpu: 256,
            memoryLimitMiB: 512,
        })

        const mainContainer = demoTaskDef.addContainer('main', {
            //   image: ecs.ContainerImage.fromAsset('./nginx', {}),
            image: ecs.ContainerImage.fromRegistry('nginx:latest'),
            cpu: 0,
            logging: new ecs.AwsLogDriver({
                streamPrefix: 'fargate-dual-alb-demo'
            }),
        })

        //   mainContainer.addLink(phpContainer, 'app')
        mainContainer.addPortMappings({
            containerPort: 80
        })

        const demoService = new ecs.FargateService(this, 'demo-service', {
            cluster: fgCluster,
            desiredCount: 2,
            taskDefinition: demoTaskDef,
            securityGroup: ec2.SecurityGroup.fromSecurityGroupId(this, 'SgDemoService', vpc.vpcDefaultSecurityGroup),
        });

        const healthCheckDefault = {
            "port": 'traffic-port',
            "path": '/',
            "intervalSecs": 30,
            "timeoutSeconds": 5,
            "healthyThresholdCount": 5,
            "unhealthyThresholdCount": 2,
            "healthyHttpCodes": "200,301,302"
        };

        const externalLB = new elbv2.ApplicationLoadBalancer(this, 'external', {
            vpc: vpc,
            internetFacing: true,
            securityGroup: httpPublicSecurityGroup,
        });

        const externalListener = externalLB.addListener('PublicListener', {
            port: 80
        });

        const internalLB = new elbv2.ApplicationLoadBalancer(this, 'internal', {
            vpc: vpc,
            internetFacing: false,
            securityGroup: httpPublicSecurityGroup,
        })

        const internalListener = internalLB.addListener('PrivateListener', {
            port: 80
        })

        externalListener.addTargets('fg-echo-req', {
            port: 80,
            protocol: elbv2.ApplicationProtocol.HTTP,
            healthCheck: healthCheckDefault,
            targets: [demoService],
            deregistrationDelay: cdk.Duration.seconds(3)
        });

        internalListener.addTargets('fg-echo-req', {
            port: 80,
            protocol: elbv2.ApplicationProtocol.HTTP,
            healthCheck: healthCheckDefault,
            targets: [demoService],
            deregistrationDelay: cdk.Duration.seconds(3)
        });

        new cdk.CfnOutput(this, 'ClusterARN: ', { value: fgCluster.clusterArn });
        new cdk.CfnOutput(this, 'ExteranlURL: ', { value: 'http://' + externalListener.loadBalancer.loadBalancerDnsName });
        new cdk.CfnOutput(this, 'InternalURL: ', { value: 'http://' + internalListener.loadBalancer.loadBalancerDnsName });

    }
}

exports.FargateCdkStack = FargateCdkStack;

const app = new cdk.App();

const FgStack = new FargateCdkStack(app, 'fargate-dual-alb');

app.synth();