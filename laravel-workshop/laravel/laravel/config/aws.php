<?php

use Aws\Laravel\AwsServiceProvider;

return [

    /*
    |--------------------------------------------------------------------------
    | AWS SDK Configuration
    |--------------------------------------------------------------------------
    |
    | The configuration options set in this file will be passed directly to the
    | `Aws\Sdk` object, from which all client objects are created. The minimum
    | required options are declared here, but the full set of possible options
    | are documented at:
    | http://docs.aws.amazon.com/aws-sdk-php/v3/guide/guide/configuration.html
    |
    */

    'region' => env('AWS_DEFAULT_REGION', 'ap-northeast-1'),
    'version' => 'latest',
    'ua_append' => [
        'L5MOD/' . AwsServiceProvider::VERSION,
    ],



        /*
		 |--------------------------------------------------------------------------
		 | Amazon S3 config
		 |--------------------------------------------------------------------------
		 |
		 | Fill in S3 config
		 |
		 */
    's3' => [

        /*
         |--------------------------------------------------------------------------
         | Amazon S3 URL
         |--------------------------------------------------------------------------
         |
         | Environment		value
         | production	:	https://a.a-p-i.io
         | test			:	https://test.udn-device-dept.net
         | local		:	https://test.udn-device-dept.net
         |
         */
        'url' => env('AWS_S3_URL', ''),

        /*
         |--------------------------------------------------------------------------
         | Amazon S3 bucket name
         |--------------------------------------------------------------------------
         |
         | Fill in S3 bucket name
         |
         */
        'bucket' => env('AWS_S3_BUCKET', ''),

        /*
         |--------------------------------------------------------------------------
         | Amazon S3 Path
         |--------------------------------------------------------------------------
         |
         | Environment		value
         | production	:
         | test			:	lab
         | local		:	lab
         |
         */
        'branch' => env('AWS_S3_BRANCH', ""),
    ]
];
