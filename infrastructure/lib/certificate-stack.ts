import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as certificate from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';

export class CertificateStack extends Stack {
  public readonly certificate: certificate.ICertificate;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id);

    const hostedZone = new route53.HostedZone(this, 'HostedZone', {
      zoneName: 'herrat.world',
    });

    this.certificate = new certificate.Certificate(this, 'HerratCertificate', {
      domainName: 'herrat.world',
      subjectAlternativeNames: ['kalastaja.herrat.world'],
      validation: certificate.CertificateValidation.fromDnsMultiZone({
        'herrat.world': hostedZone,
        'kalastaja.herrat.world': hostedZone,
      }),
    });
  }
}
