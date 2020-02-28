# Hosting on AWS
The first step is to clone this repository to your computer

```
git clone <repository_url>
```

### Setup AWS
1. Create AWS Account
2. Log Into AWS CLI

From here the infrastructure is split into two parts:

### 1. The Web App Stack
This stack is what controls the web app and the backend server. Both are run using fargate on AWS.

### 2. The Virtual Browser Stack
Virtual browsers are isolated docker containers that are launched on demand on an EC2 instance. The more compute power the EC2 instance the more rooms can be launched, but obviously the more costly self-hosting might become.

### Destroy
1. Run `terraform destroy` to unprovision all of the previously created resources
