import boto3
import os

def lambda_handler(event, context):
    s3_client = boto3.client('s3')
    bucket_name = os.getenv('DESTINATION_BUCKET_NAME')

    try: 
        # response = s3_client.list_objects_v2(Bucket=bucket_name)
        paginator = s3_client.get_paginator('list_objects_v2')
        pages = paginator.paginate(Bucket=bucket_name)
        
        temp_objects = []
        for page in pages:
            if "Contents" in page:
                temp_objects.extend([obj for obj in page['Contents'] if 'temp' in obj['Key']])
            
        if temp_objects:
            
            old_object_key = min(temp_objects, key=lambda x: x['LastModified'])['Key']
            
            s3_client.delete_object(Bucket=bucket_name, Key=old_object_key)
            print(f"Successfully deleted the oldest object {old_object_key} from {bucket_name}")
    except Exception as e:
        print(f"Error for deleting temporary objects with 'temp' in the name: {e}")
            
    
    
    # if 'Contents' in response:
    #     temp_objects.extend([obj for obj in response['Contents'] if 'temp' in obj['Key']])
    #     if temp_objects:
    #         # 按 LastModified 排序并找到最旧的包含 'temp' 的对象
    #         old_object_key = min(temp_objects, key=lambda x: x['LastModified'])['Key']
    #         # 删除最旧的对象
    #         s3_client.delete_object(Bucket=bucket_name, Key=old_object_key)
    #         print(f"Successfully deleted the oldest object {old_object_key} from {bucket_name}")
            
    #     else:
    #         return {
    #             'statusCode': 200,
    #             'body': 'No temporary objects with "temp" in the name to delete.'
    #         }
        

   
    return {
        'statusCode': 200,
        'body': 'No temporary objects to delete.'
    }
