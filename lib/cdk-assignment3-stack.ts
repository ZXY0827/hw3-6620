import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda  from 'aws-cdk-lib/aws-lambda';
import * as iam  from 'aws-cdk-lib/aws-iam';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { RemovalPolicy } from 'aws-cdk-lib';


export class CdkAssignment3Stack extends cdk.Stack {
  public readonly sourceBucketName: string;
  public readonly destinationBucketName: string;
  
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sourceBucket = new s3.Bucket(this, 'source', { removalPolicy: RemovalPolicy.DESTROY });
		const destinationBucket =new s3.Bucket(this, 'destination',{ removalPolicy: RemovalPolicy.DESTROY });
		
		this.sourceBucketName = sourceBucket.bucketName;
		this.destinationBucketName = destinationBucket.bucketName;
		
		new cdk.CfnOutput(this, 'DestinationBucketNameExport', {
        value: destinationBucket.bucketName,
        exportName: 'DestinationBucketName'
    });
    
    
    const lambdaExecutionRole = new iam.Role(this, 'LambdaExecutionRole', {
          assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    lambdaExecutionRole.addToPolicy(new iam.PolicyStatement({
          actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject','s3:ListBucket','s3:HeadObject'],
          resources: [sourceBucket.bucketArn, sourceBucket.bucketArn + '/*', destinationBucket.bucketArn, destinationBucket.bucketArn + '/*'],
          effect: iam.Effect.ALLOW
    }));
    
    
    const copierLogGroup = new logs.LogGroup(this, 'CopierLogs', {
          logGroupName: '/aws/lambda/CopierLogs',
          removalPolicy: cdk.RemovalPolicy.DESTROY // Automatically remove the log group on stack deletion
    });
    
    const copierLambda = new lambda.Function(this, 'copier', {
	        runtime: lambda.Runtime.PYTHON_3_8,
		      handler: 'copier_lambda.lambda_handler',
		      role: lambdaExecutionRole,
		      environment: {
                SOURCE_BUCKET_NAME: sourceBucket.bucketName,
                DESTINATION_BUCKET_NAME: destinationBucket.bucketName,
                // LOG_GROUP_NAME: copierLogGroup.logGroupName
          },
		      code: lambda.Code.fromAsset('copier'),
		      logGroup: copierLogGroup

    });
    
    sourceBucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(copierLambda));
    sourceBucket.grantRead(copierLambda);
    destinationBucket.grantWrite(copierLambda);
    
    copierLogGroup.grantWrite(copierLambda)
    
    const sizeMetricFilter = new logs.MetricFilter(this, 'SizeMetricFilter', {
          logGroup: copierLogGroup,
          metricNamespace: 'TemporaryObjects',
          metricName: 'TotalSize',
          filterPattern: logs.FilterPattern.literal('[info=Total, ... , size_value, unit="bytes"]'), 
          metricValue: '$size_value'
    });
  }
  
}
