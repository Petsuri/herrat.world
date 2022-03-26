import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { UserPoolDomainTarget } from 'aws-cdk-lib/aws-route53-targets';
import * as route53 from 'aws-cdk-lib/aws-route53';

export interface DomainProps extends StackProps {
  readonly id: string;
  readonly scopes: cognito.ResourceServerScope[];
  readonly customDomainName: string;
  readonly certificate: ICertificate;
  readonly zone: IHostedZone;
  readonly callbackUrls: string[];
  readonly logoutUrls: string[];
}

export class Domain extends Stack {
  constructor(scope: Construct, id: string, props: DomainProps) {
    super(scope, id, props);

    const pool = this.createPool(props.id);
    const domain = pool.addDomain(`${props.id}Domain`, {
      customDomain: {
        certificate: props.certificate,
        domainName: props.customDomainName,
      },
    });

    const resourceServer = pool.addResourceServer(`${props.id}ResourceServer`, {
      scopes: props.scopes,
      identifier: `${props.id}ResourceServer`,
    });

    pool.addClient(`${props.id}Client`, {
      accessTokenValidity: Duration.minutes(15),
      oAuth: {
        callbackUrls: props.callbackUrls,
        logoutUrls: props.logoutUrls,
        scopes: [
          cognito.OAuthScope.resourceServer(
            resourceServer,
            new cognito.ResourceServerScope({ scopeName: '*', scopeDescription: 'Full access' })
          ),
        ],
      },
      preventUserExistenceErrors: true,
      readAttributes: new cognito.ClientAttributes().withStandardAttributes({
        fullname: true,
        email: true,
      }),
      authFlows: {
        userPassword: true,
      },
      supportedIdentityProviders: [cognito.UserPoolClientIdentityProvider.COGNITO],
    });

    new route53.ARecord(this, 'LoginKalastaARecord', {
      zone: props.zone,
      target: route53.RecordTarget.fromAlias(new UserPoolDomainTarget(domain)),
      recordName: 'login.kalastaja.herrat.world',
    });

    new route53.AaaaRecord(this, 'LoginKalastaAAAARecord', {
      zone: props.zone,
      target: route53.RecordTarget.fromAlias(new UserPoolDomainTarget(domain)),
      recordName: 'login.kalastaja.herrat.world',
    });
  }

  private createPool(id: string): cognito.UserPool {
    return new cognito.UserPool(this, `${id}UserPool`, {
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      deviceTracking: {
        challengeRequiredOnNewDevice: true,
        deviceOnlyRememberedOnUserPrompt: true,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
        tempPasswordValidity: Duration.days(3),
      },
      selfSignUpEnabled: false,
      signInAliases: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        fullname: {
          required: true,
          mutable: true,
        },
      },
      signInCaseSensitive: false,
      userInvitation: {
        emailSubject: 'Tervetuloa kalastaja herrojen maailmaan!',
        emailBody:
          'Heipä hei {username}, Teidät on kutsuttu käyttämään kalastaja herrojen maailmaa! Väliaikainen salasanasi on {####}. Kalaonnea toivottaa kalastaja herrojen maailma.',
      },
    });
  }
}
