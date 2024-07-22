import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda  from 'aws-cdk-lib/aws-lambda';
import * as iam  from 'aws-cdk-lib/aws-iam';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import { Construct } from 'constructs';
import { RemovalPolicy } from 'aws-cdk-lib';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class MyCopierLambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkAssignment3Queue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    //new s3.Bucket(this, 'source', {
    //	          removalPolicy: RemovalPolicy.DESTROY
    //});
		 
    //new s3.Bucket(this, 'destination',{
    //              removalPolicy: RemovalPolicy.DESTROY
    //});
  //   const sourceBucket = s3.Bucket.fromBucketName(this,'source','dk-hnb659fds-assets-211125353886-us-west-1' )
  //   const destinationBucket = s3.Bucket.fromBucketName(this,'destination','cdkassignment3stack-destinationdb878fb5-foc5er4za9ig' )
    
  //   const lambdaExecutionRole = new iam.Role(this, 'LambdaExecutionRole', {
  //         assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
  //         inlinePolicies: {
  //             'BucketAccessPolicy': new iam.PolicyDocument({
  //                 statements: [new iam.PolicyStatement({
  //                     actions: ['s3:GetObject', 's3:PutObject'],
  //                     resources: [sourceBucket.bucketArn + '/*', destinationBucket.bucketArn + '/*'],
  //                 })],
  //             })
  //         }
  //   });
    
  //   const copierLambda = new lambda.Function(this, 'copier', {
	 //       runtime: lambda.Runtime.PYTHON_3_12,
		//       handler: 'copier_lambda_code.lambda_handler',
		//       environment: {
  //               BUCKET_NAME: sourceBucket.bucketName
		//       },
		//       code: lambda.Code.fromBucket(sourceBucket, 'copier_lambda_handler.zip'),
  //   });
    
  //   // 给 Lambda 函数赋予读取 source bucket 和写入 destination bucket 的权限
  //   sourceBucket.grantRead(copierLambda);
  //   destinationBucket.grantWrite(copierLambda);

    
  //   // Add an event notification to trigger the Lambda function
  //   sourceBucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(copierLambda));
  }
  
}
