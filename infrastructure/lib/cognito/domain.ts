import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Duration } from 'aws-cdk-lib';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { UserPoolDomain } from 'aws-cdk-lib/aws-cognito';

export interface DomainProps {
  readonly id: string;
  readonly scopes: cognito.ResourceServerScope[];
  readonly customDomainName: string;
  readonly certificate: ICertificate;
  readonly callbackUrls: string[];
  readonly logoutUrls: string[];
}

export class Domain extends Construct {
  public readonly value: UserPoolDomain;

  constructor(scope: Construct, id: string, props: DomainProps) {
    super(scope, id);

    const pool = this.createPool();
    this.value = pool.addDomain(`${props.id}Domain`, {
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
  }

  private createPool(): cognito.UserPool {
    return new cognito.UserPool(this, 'Userpool', {
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
