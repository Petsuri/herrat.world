import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CertificateStack } from './certificate-stack';
import { KalastajaHerratStack } from './kalastaja-herrat/kalastaja-herrat-stack';

export class HerratStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const certificate = new CertificateStack(this, 'CertificateStack');
    new KalastajaHerratStack(this, 'KalastajaHerratStack', {
      certificate: certificate.kalastajaHerratCertificate,
      zone: certificate.zone,
    });
  }
}
