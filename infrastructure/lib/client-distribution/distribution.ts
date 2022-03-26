import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as certificate from 'aws-cdk-lib/aws-certificatemanager';
import * as s3Deploy from 'aws-cdk-lib/aws-s3-deployment';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import * as route53 from 'aws-cdk-lib/aws-route53';

export interface DistributionProps extends StackProps {
  readonly domain: string;
  readonly pathToCode: string;
  readonly certificate: certificate.ICertificate;
  readonly zone: IHostedZone;
}

export class Distribution extends Stack {
  constructor(scope: Construct, id: string, props: DistributionProps) {
    super(scope, id, props);

    const sourceBucket = new s3.Bucket(this, 'ClientDistributionBucket', {
      publicReadAccess: false,
      encryption: s3.BucketEncryption.UNENCRYPTED,
      versioned: false,
    });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(this, 'CloudFrontS3Identity');
    sourceBucket.grantRead(originAccessIdentity);

    const cloudFront = new cloudfront.CloudFrontWebDistribution(this, 'ClientDistribution', {
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
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
            originAccessIdentity,
          },
          behaviors: [
            {
              isDefaultBehavior: true,
              minTtl: Duration.days(31),
              defaultTtl: Duration.days(31),
            },
          ],
        },
      ],
    });

    new route53.ARecord(this, 'KalastaARecord', {
      zone: props.zone,
      target: route53.RecordTarget.fromAlias(new CloudFrontTarget(cloudFront)),
      recordName: 'kalastaja.herrat.world',
    });

    new route53.AaaaRecord(this, 'KalastaAAAARecord', {
      zone: props.zone,
      target: route53.RecordTarget.fromAlias(new CloudFrontTarget(cloudFront)),
      recordName: 'kalastaja.herrat.world',
    });

    new s3Deploy.BucketDeployment(this, 'ClientDistributionDeployment', {
      destinationBucket: sourceBucket,
      sources: [s3Deploy.Source.asset(props.pathToCode)],
      distribution: cloudFront,
    });
  }
}
