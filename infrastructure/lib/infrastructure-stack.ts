import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CertificateStack } from './certificate-stack';

export interface InfrastructureStackProps extends StackProps {
  readonly certificate: CertificateStack;
}

export class InfrastructureStack extends Stack {
  constructor(scope: Construct, id: string, props: InfrastructureStackProps) {
    super(scope, id, props);

    console.log(id);
  }
}
