# get-public-ip

This sample demonstrates how to get Fargate task **public IP, private IP, Cluster name, Task ARN** and other info right from the nodejs application running in the Fargate task.



## Demo

create a sample service(demosvc) with the pre-built docker image listening on port 80.

```
$ fargate --region us-west-2 service create demosvc -i pahud/fargate-samples:get-fargate-ip -n 1 -p 80 --security-group-id=sg-0a08f8ad32663513b --task-role arn:aws:iam::{AWS_ACCOUNT_ID}:role/fargate-describer-task-role
[i] Created service demosvc
```

list the task and get the public IP

```
$ fargate --region=us-west-2 service ps demosvc
ID					IMAGE					STATUS	RUNNING	IP		CPU	MEMORY
ae11e0ee-545e-4622-94e8-abe8f384ce96	pahud/fargate-samples:get-fargate-ip	running	1m43s	54.201.199.135	256	512
$ curl 54.201.199.135 | jq
```

![](images/01.png)



cURL the public IP to see the response

```
$ curl -s 54.201.199.135 | jq
```



![](images/02.png)



## clean up

```
//scale to 0
$ fargate --region=us-west-2 service scale demosvc 0

//destroy the service
fargate --region=us-west-2 service destroy demosvc
```



## How it works?

Read `fargate-samples/get-fargate-ip/run.sh` to see how it get all the info and bootstraps the `FARGATE_*` environment variables for nodeJS.