import boto3
import json
import os
import logging
import urllib.parse

# logger = logging.getLogger()
# logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    s3_client = boto3.client('s3')
    # source_bucket = os.environ['SOURCE_BUCKET_NAME']
    # destination_bucket = os.environ['DESTINATION_BUCKET_NAME']
    
    source_bucket = event['Records'][0]['s3']['bucket']['name']
    source_key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    destination_bucket = os.environ['DESTINATION_BUCKET_NAME']
    destination_key = f"{source_key}"
    
    try:
        response = s3_client.head_object(Bucket =source_bucket, Key =source_key)
        size = response['ContentLength']
        s3_client.copy_object(Bucket =destination_bucket, CopySource={'Bucket': source_bucket, 'Key': source_key}, Key =destination_key)
        print(f"Successfully copied {source_key} from {source_bucket} to {destination_bucket}. Size: {size} bytes")
        
        total_size = 0
        paginator = s3_client.get_paginator('list_objects_v2')
        pages = paginator.paginate(Bucket=destination_bucket)


        for page in pages:
            if 'Contents' in page:
                for obj in page['Contents']:
                    if "temp" in obj['Key']:
                        total_size += obj['Size']
                # total_size += sum(obj['Size'] for obj in page['Contents'] if "temp" in obj['Key'])
                # for obj in page['Contents']:
                #     total_size += obj['Size']
        print(f"Total size of all objects in {destination_bucket}. Size: {total_size} bytes")
        
    except Exception as e:
        print(f"Error copied {e}")
        raise e
    
    

    # try:
    #     for record in event['Records']:
    #         key = record['s3']['object']['key']
    #         size = record['s3']['object']['size']

    #         # copy object
    #         copy_source = {'Bucket': source_bucket, 'Key': key}
    #         s3_client.copy(copy_source, destination_bucket, key)
    #         print(f"Successfully copied {key} from {source_bucket} to {destination_bucket}. Size: {size} bytes")

    

    #     total_size = 0
    #     paginator = s3_client.get_paginator('list_objects_v2')


    #     for page in paginator.paginate(Bucket=destination_bucket):
    #         if 'Contents' in page:
    #             for obj in page['Contents']:
    #                 total_size += obj['Size']
    #     print(f"Total size of all objects in {destination_bucket}. Size: {total_size} bytes")

    # except Exception as e:
    #     print(f"Error copied {e}")
    #     raise e
         
    # return {
    #     'statusCode': 200,
    #     'body': 'Successfully uploaded files to S3'    
    # }
