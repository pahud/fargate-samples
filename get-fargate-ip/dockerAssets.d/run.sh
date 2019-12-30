#!/bin/sh
set -x

export PATH=$PATH:/usr/local/bin

fgbootstrap(){
echo "getting metadata..."
curl -s http://169.254.170.2/v2/metadata
privip=$(curl -s http://169.254.170.2/v2/metadata | jq -r .Containers[0].Networks[0].IPv4Addresses[0])
cluster=$(curl -s http://169.254.170.2/v2/metadata | jq -r .Cluster)
task=$(curl -s http://169.254.170.2/v2/metadata | jq -r .TaskARN)
region=$(echo $task | cut -d: -f4)
eni=$(aws --region $region ecs describe-tasks --cluster $cluster --task $task | jq -r '.tasks[0].attachments[0].details[] | select(.name=="networkInterfaceId").value')
publicip=$(aws --region $region ec2 describe-network-interfaces --network-interface-ids $eni | jq -r .NetworkInterfaces[0].Association.PublicIp)

export FARGATE_PUBLIC_IP=$publicip
export FARGATE_PRIV_IP=$privip
export FARGATE_ENI=$eni
export FARGATE_REGION=$region
export FARGATE_ECS_CLUSTER=$cluster
export FARGATE_ECS_TASKARN=$task
}

fgbootstrap
cd /app
npm install express --save
node index.js
