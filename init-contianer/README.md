# init container 

This sample demonstrates how to build an init container in AWS Fargate for Task bootstrapping. The init container will write the config into `/mnt/secrets/bootstrap.conf` and the main container will spin up immediately after the init container and read in the content in `/mnt/secrets/bootstrap.conf`.

In this sample, init container just `echo export foo=bar > /mnt/secrets/bootstrap.conf` and main container just `source /mnt/secrets/bootstrap.conf; env` to print all the environment variables.

With this design pattern, we can bootstrap the fargate task with init container and fetch required secret strings or parameters from [AWS Secrets Manager](https://aws.amazon.com/tw/secrets-manager/), [AWS System Manager Parameter Store](https://docs.aws.amazon.com/en_us/systems-manager/latest/userguide/systems-manager-parameter-store.html), discover the service endpoints from [AWS Cloud Map](https://aws.amazon.com/tw/cloud-map/) API or even from any RESTful endpoints. The main container can just read in the config and get all required variables or parameters.

# HOWTO

```bash
# import the taskDef into new task family and specify your `--execution-role-arn`
$ aws ecs register-task-definition --cli-input-json file://taskDef.json --family newFamily --execution-role-arn arn:aws:iam::xxxxxxxxxxxx:role/ecsTaskExecutionRole
# launch the fargate task
$ aws ecs run-task --task-definition newFamily --cluster fargate --network-configuration \
"awsvpcConfiguration={subnets=[subnet-025bf274,subnet-7034c928],securityGroups=[sg-01d3cd65],assignPublicIp=ENABLED}" \
--launch-type "FARGATE"
```
go to Amazon ECS console and check the task logs, in `mainContainer` log you should be able to see `foo=bar` in the log stream.

# YAML to JSON
Optionally, you can convert the `taskDef.yaml` to JSON and pipe to `ecs register-task-definition` to register a new task definition like this:

```bash
docker run -v ${PWD}:/workdir mikefarah/yq yq r -j taskDef.yaml | xargs -0 aws ecs register-task-definition \
--execution-role-arn arn:aws:iam::xxxxxxxxxxxx:role/ecsTaskExecutionRole \
--family newFamily --cli-input-json
```
