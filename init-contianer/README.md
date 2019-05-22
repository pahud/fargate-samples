# init container 

```bash
# import the taskDef into new task family
$ aws ecs register-task-definition --cli-input-json file://taskDef.json --family newFamily
# launch the fargate task
$ aws ecs run-task --task-definition newFamily --cluster fargate --network-configuration \
"awsvpcConfiguration={subnets=[subnet-025bf274,subnet-7034c928],securityGroups=[sg-01d3cd65],assignPublicIp=ENABLED}" \
--launch-type "FARGATE"
```
go to Amazon ECS console and check the task logs, in `mainContainer` log you should be able to see `foo=bar` in the log stream.