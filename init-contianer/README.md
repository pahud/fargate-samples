# init container 

This sample demonstrates how to build an init container in AWS Fargate for Task bootstrapping. The init container will write the config into `/mnt/secrets/bootstrap.conf` and the main container will spin up immediately after the init container and read in the content in `/mnt/secrets/bootstrap.conf`.

In this sample, init container just `echo export foo=bar > /mnt/secrets/bootstrap.conf` and main container just `source /mnt/secrets/bootstrap.conf; env` to print all the environment variables.

With this design pattern, we can bootstrap the fargate task with init container and fetch required secret strings or parameters from [AWS Secrets Manager](https://aws.amazon.com/tw/secrets-manager/), [AWS System Manager Parameter Store](https://docs.aws.amazon.com/en_us/systems-manager/latest/userguide/systems-manager-parameter-store.html), discover the service endpoints from [AWS Cloud Map](https://aws.amazon.com/tw/cloud-map/) API or even from any RESTful endpoints. The main container can just read in the config and get all required variables or parameters.

# 01 - Variables passed from init container

```bash
# import the taskDef into new task family and specify your `--execution-role-arn`
aws ecs register-task-definition --cli-input-json file://taskDef-01.json --family newFamily --execution-role-arn arn:aws:iam::903779448426:role/ecsTaskExecutionRole
# launch the fargate task
aws ecs run-task --task-definition newFamily --cluster fargate --network-configuration \
"awsvpcConfiguration={subnets=[subnet-025bf274,subnet-7034c928],securityGroups=[sg-01d3cd65],assignPublicIp=ENABLED}" \
--launch-type "FARGATE"
```
go to Amazon ECS console and check the task logs, in `mainContainer` log you should be able to see `foo=bar` in the log stream.

# YAML to JSON
Optionally, you can convert the `taskDef-01.yaml` to JSON and pipe to `ecs register-task-definition` to register a new task definition like this:

```bash
docker run -v ${PWD}:/workdir mikefarah/yq yq r -j taskDef-01.yaml | xargs -0 aws ecs register-task-definition \
--execution-role-arn arn:aws:iam::xxxxxxxxxxxx:role/ecsTaskExecutionRole \
--family newFamily --cli-input-json
```

# 02 - Define Environment Variables from SSM Parameter Store

We can define the environment variables in ECS Task Definition with `valueFrom` SSM Parameter Store.

Example:
```json
    {
      "environment": [],
      "name": "mainConainer",
      "secrets": [
        {
          "valueFrom": "DEMO_MYSQL_HOSTNAME",
          "name": "DEMO_MYSQL_HOSTNAME"
        },
        {
          "valueFrom": "DEMO_MYSQL_USERNAME",
          "name": "DEMO_MYSQL_USERNAME"
        },
        {
          "valueFrom": "DEMO_MYSQL_PASSWORD",
          "name": "DEMO_MYSQL_PASSWORD"
        }
      ]
```

Demo

```bash
# create parameters in parameter store
aws ssm put-parameter --name DEMO_MYSQL_HOSTNAME --value mysql.demo.local --type SecureString
aws ssm put-parameter --name DEMO_MYSQL_USERNAME --value user1234 --type SecureString
aws ssm put-parameter --name DEMO_MYSQL_PASSWORD --value pass1234 --type SecureString

# create a ECS task execution role with relevant SSM and KMS privileges
aws iam create-role --role-name ECSTaskRole4ParameterStore --assume-role-policy-document file://02-assume-role-policy.json
aws iam attach-role-policy --role-name ECSTaskRole4ParameterStore --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
aws iam put-role-policy --role-name ECSTaskRole4ParameterStore --policy-name ECSTaskRoleExtraPolicies --policy-document file://02-extra-policies.json


# import the taskDef into new task family and specify your `--execution-role-arn`
aws ecs register-task-definition --cli-input-json file://taskDef-02.json --family newFamily --execution-role-arn arn:aws:iam::903779448426:role/ECSTaskRole4ParameterStore
# launch the fargate task
aws ecs run-task --task-definition newFamily --cluster fargate --network-configuration \
"awsvpcConfiguration={subnets=[subnet-025bf274,subnet-7034c928],securityGroups=[sg-01d3cd65],assignPublicIp=ENABLED}" \
--launch-type "FARGATE"

```
check the log of the main container and you'll see the following variables in the log stream:

```bash
foo=bar
DEMO_MYSQL_HOSTNAME=mysql.demo.local
DEMO_MYSQL_USERNAME=user1234
DEMO_MYSQL_PASSWORD=pass1234
```
please note `DEMO_MYSQL_HOSTNAME`, `DEMO_MYSQL_USERNAME` and `DEMO_MYSQL_PASSWORD` are fetched from SSM Parameter Store with KMS decrypton on-the-fly as 
the ECS Task Execution Role(i.e. `ECSTaskRole4ParameterStore`).

# Reference
Amazon ECS Task Definition export/import [tips](https://gist.github.com/pahud/9affaa353f52e734a638b1329f7ca3d0)
