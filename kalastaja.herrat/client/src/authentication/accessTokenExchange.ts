import { failure, Result, success, unit, Unit } from '../common';
import { AccessToken } from './accessToken';
import { getLoginClientId, getLoginHost, getLoginRedirectUri } from '../environmentVariables';
import { add } from 'date-fns';

type CredentialsDto = {
  readonly access_token: string;
  readonly refresh_token: string;
  readonly expires_in: number;
  readonly token_type: string;
};

export async function exchangeCode(
  code: string,
  save: (token: AccessToken) => void
): Promise<Result<Unit, string>> {
  const host = getLoginHost();
  return await fetch(`${host}oauth2/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: getBody(code),
  })
    .then((value) => value.json())
    .then((json: CredentialsDto) => {
      save({
        token: json.access_token,
        refreshToken: json.refresh_token,
        tokenType: json.token_type,
        validUntil: add(new Date(), { seconds: json.expires_in }),
      });
      return success(unit());
    })
    .catch((error: string) => {
      return failure(error);
    });
}

const getBody = (code: string): string => {
  const redirectUri = getLoginRedirectUri();
  const clientId = getLoginClientId();

  const body = [];
  body.push(encodeUrlParameter('grant_type', 'authorization_code'));
  body.push(encodeUrlParameter('code', code));
  body.push(encodeUrlParameter('client_id', clientId));
  body.push(encodeUrlParameter('redirect_uri', redirectUri));

  return body.join('&');
};

const encodeUrlParameter = (key: string, value: string): string => {
  return encodeURIComponent(key) + '=' + encodeURIComponent(value);
};
