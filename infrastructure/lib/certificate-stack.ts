import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as certificate from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';

export class CertificateStack extends Stack {
  public readonly herrat: certificate.ICertificate;
  public readonly kalastajaHerrat: certificate.ICertificate;
  public readonly zone: route53.IHostedZone;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hostedZone = new route53.HostedZone(this, 'HostedZone', {
      zoneName: 'herrat.world',
    });

    this.herrat = new certificate.Certificate(this, 'HerratCertificate', {
      domainName: 'herrat.world',
      validation: certificate.CertificateValidation.fromDns(hostedZone),
    });

    this.kalastajaHerrat = new certificate.Certificate(this, 'KalastajaHerratCertificate', {
      domainName: 'kalastaja.herrat.world',
      validation: certificate.CertificateValidation.fromDns(hostedZone),
    });

    this.zone = hostedZone;
  }
}
