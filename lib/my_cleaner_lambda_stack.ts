import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda  from 'aws-cdk-lib/aws-lambda';
import * as iam  from 'aws-cdk-lib/aws-iam';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as actions from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Construct } from 'constructs';
import { RemovalPolicy } from 'aws-cdk-lib';

export class MyCleanerLambdaStack extends cdk.Stack {
  // public readonly cleanerLambda: lambda.Function;
  
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const destinationBucketName = cdk.Fn.importValue('DestinationBucketName');
    
    const cleanerLambda = new lambda.Function(this, 'Cleaner', {
            runtime: lambda.Runtime.PYTHON_3_8,
            handler: 'cleaner_lambda.lambda_handler',
            code: lambda.Code.fromAsset('cleaner'),
            environment: {
              'DESTINATION_BUCKET_NAME': destinationBucketName 
            },
           
    });
    
    // destinationBucketName.grantReadWrite(cleanerLambda)
    
    cleanerLambda.addToRolePolicy(new iam.PolicyStatement({
        actions: ['s3:ListBucket', 's3:GetObject', 's3:DeleteObject'],
        resources: [
            `arn:aws:s3:::${destinationBucketName}`, 
            `arn:aws:s3:::${destinationBucketName}/*`
        ]
    }));
    
    // Create CloudWatch alarm
    const alarm = new cloudwatch.Alarm(this, 'TotalSizeAlarm', {
      metric: new cloudwatch.Metric({
        namespace: 'TemporaryObjects',
        metricName: 'TotalSize',
        statistic: 'Maximum',
        period: cdk.Duration.seconds(60)
      }),
      threshold: 3072,  //  3 * 1024 
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD
    });

    // Set the cleaner Lambda function as the alert's action
    alarm.addAlarmAction(new actions.LambdaAction(cleanerLambda));

  }
  
}
