# Fargate Service with multiple Target Groups

Amazon ECS services supports multiple load balabncer target groups

https://aws.amazon.com/tw/about-aws/whats-new/2019/07/amazon-ecs-services-now-support-multiple-load-balancer-target-groups/

Let's demonstrate this with AWS CDK:

### Setup AWS CDK envorinment

```bash
# install the nvm installer
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
# nvm install 
nvm install lts/dubnium
nvm alias default lts/dubnium
# install AWS CDK
npm i -g aws-cdk
# check cdk version, make sure your version >=1.0.0
cdk --version
1.2.0 (build 6b763b7)
# install other required npm modules
npm install
# build the index.ts to index.js with tsc
npm run build
# cdk bootstrapping
cdk bootstrap
```

### Deploy

```bash
cdk synth
cdk deploy
```



### More detail explained in this Tweet

https://twitter.com/pahudnet/status/1156386534708277248

