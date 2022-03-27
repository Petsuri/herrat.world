import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Distribution } from '../client-distribution/distribution';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Domain } from '../cognito/domain';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';

export interface KalastajaHerratStackProps extends StackProps {
  readonly certificateArn: string;
  readonly wildcardSubdomainCertificateArn: string;
  readonly hostedZoneDomainName: string;
}

export class KalastajaHerratStack extends Stack {
  constructor(scope: Construct, id: string, props: KalastajaHerratStackProps) {
    super(scope, id, props);

    const certificate = Certificate.fromCertificateArn(this, 'Certificate', props.certificateArn);
    const zone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.hostedZoneDomainName,
    });
    const distribution = new Distribution(this, 'KalastajaHerratDistribution', {
      certificate: certificate,
      zone,
      domain: 'kalastaja.herrat.world',
      pathToCode: '../kalastaja.herrat/client/build',
      ...props,
    });

    const wildcardSubdomainCertificate = Certificate.fromCertificateArn(
      this,
      'wildcardSubdomainCertificate',
      props.wildcardSubdomainCertificateArn
    );
    const cognitoDomain = new Domain(this, 'KalastajaHerratLogin', {
      id: 'KalastajaHerratLogin',
      callbackUrls: ['http://localhost:3000/login', 'https://kalastaja.herrat.world/login'],
      logoutUrls: ['http://localhost:3000/logout', 'https://kalastaja.herrat.world/logout'],
      certificate: wildcardSubdomainCertificate,
      zone,
      customDomainName: 'login.kalastaja.herrat.world',
      scopes: [
        {
          scopeDescription: 'Full access',
          scopeName: '*',
        },
      ],
      ...props,
    });

    cognitoDomain.addDependency(
      distribution,
      'Requires A record for domain before can create cognito domain'
    );
  }
}
