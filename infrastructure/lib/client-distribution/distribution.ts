import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Duration } from 'aws-cdk-lib';
import * as certificate from 'aws-cdk-lib/aws-certificatemanager';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';

export class DistributionProps {
  readonly domain: string;
  readonly pathToCode: string;
  readonly certificate: certificate.ICertificate;
}

export class Distribution extends Construct {
  constructor(scope: Construct, id: string, props: DistributionProps) {
    super(scope, id);

    const sourceBucket = new s3.Bucket(this, 'ClientDistributionBucket', {
      publicReadAccess: false,
      encryption: s3.BucketEncryption.UNENCRYPTED,
      versioned: false,
    });

    const cloudFront = new cloudfront.CloudFrontWebDistribution(this, 'ClientDistribution', {
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.HTTPS_ONLY,
      viewerCertificate: {
        aliases: [props.domain],
        props: {
          acmCertificateArn: props.certificate.certificateArn,
          sslSupportMethod: 'sni-only',
          minimumProtocolVersion: 'TLSv1.2_2021',
        },
      },
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: sourceBucket,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              defaultTtl: Duration.days(31),
            },
          ],
        },
      ],
    });

    new s3Deploy.BucketDeployment(this, 'ClientDistributionDeployment', {
      destinationBucket: sourceBucket,
      sources: [s3Deploy.Source.asset(props.pathToCode)],
      distribution: cloudFront,
    });
  }
}
