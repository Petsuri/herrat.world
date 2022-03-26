import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as certificate from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';

export class CertificateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hostedZone = new route53.HostedZone(this, 'HostedZone', {
      zoneName: 'herrat.world',
    });
    new CfnOutput(this, 'HostedZoneId', {
      value: hostedZone.hostedZoneId,
      exportName: 'HerratWorldHostedZoneId',
    });

    this.addCertificate(hostedZone, 'HerratCertificate', 'herrat.world');
    this.addCertificate(hostedZone, 'KalastajaHerratCertificate', 'kalastaja.herrat.world');
    this.addCertificate(
      hostedZone,
      'KalastajaHerratWildcardSubdomainCertificate',
      '*.kalastaja.herrat.world'
    );
  }

  private addCertificate(zone: route53.HostedZone, id: string, domainName: string): void {
    const cert = new certificate.Certificate(this, id, {
      domainName,
      validation: certificate.CertificateValidation.fromDns(zone),
    });
    new CfnOutput(this, `${id}CertificateArn`, {
      value: cert.certificateArn,
      exportName: `${id}CertificateArn`,
    });
  }
}
