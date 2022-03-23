import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as certificate from 'aws-cdk-lib/aws-certificatemanager';
import { Distribution } from '../client-distribution/distribution';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';

export interface KalastajaHerratStackProps {
  readonly certificate: certificate.ICertificate;
  readonly zone: route53.IHostedZone;
}

export class KalastajaHerratStack extends Stack {
  constructor(scope: Construct, id: string, props: KalastajaHerratStackProps) {
    super(scope, id);

    const distribution = new Distribution(this, 'KalastajaHerratDistribution', {
      certificate: props.certificate,
      domain: 'kalastaja.herrat.world',
      pathToCode: '../kalastaja.herrat/client/build',
    });

    new route53.ARecord(this, 'KalastaARecord', {
      zone: props.zone,
      target: route53.RecordTarget.fromAlias(new CloudFrontTarget(distribution.value)),
      recordName: 'kalastaja.herrat.world',
    });

    new route53.AaaaRecord(this, 'KalastaAAAARecord', {
      zone: props.zone,
      target: route53.RecordTarget.fromAlias(new CloudFrontTarget(distribution.value)),
      recordName: 'kalastaja.herrat.world',
    });
  }
}
