# Scheduled Fargate Tasks

In many cases, you may build serverless scheduled tasks with AWS Fargate to execute batch jobs periodically. You can created scheduled events from **CloudWatch Events** or **EventBridge** to bring up Fargate Tasks directly. However, in some regions which Fargate scheduled tasks are not supported yet such as Hong Kong and Paris(see [full list](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/scheduled_tasks.html)), you may need to invoke AWS Lambda function to execute "**aws ecs run-task**" to bring the Fargate tasks.

This sample demonstrates how we build the two scenarios in AWS CDK.

## Run Scheduled Fargate Tasks with CloudWatch Events or EventBridge

See [CloudWatchScheduledEventsFargateTask](https://github.com/pahud/fargate-samples/blob/81252ec4e66722e1caa4b7a0bac11c5caabd456c/scheduled-fargate-tasks/cdk/lib/cdk-stack.ts#L12-L61) class.

Deploy with AWS CDK

```bash
# let's deploy to Tokyo region(ap-northeast-1)
$ cdk deploy -c region=eu-west-3  FargateScheduledTasks
```

On deploy complete, CloudWatch Events wiill bring up one Fargate task every minute to send a SQS message to the queue.



## Run Scheduled Fargate Tasks through AWS Lambda function with CloudWatch Events or EventBridge

See [CloudWatchScheduledEventsLambdaFargateTask](https://github.com/pahud/fargate-samples/blob/81252ec4e66722e1caa4b7a0bac11c5caabd456c/scheduled-fargate-tasks/cdk/lib/cdk-stack.ts#L64-L169) class.

Deploy with AWS CDK

```bash
# let's deploy to Paris region(eu-west-3)
$ cdk deploy -c region=eu-west-3  FargateScheduledTasksLambda
```

On deploy complete, CloudWatch Events wiill <u>**invoke Lambda function**</u> to bring up(*aws ecs run-task*) one Fargate task every minute to send a SQS message to the queue.