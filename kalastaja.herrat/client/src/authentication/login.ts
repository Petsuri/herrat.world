import { getLoginClientId, getLoginHost, getLoginRedirectUri } from '../environmentVariables';

const scope_prefix = 'KalastajaHerrat';
const scopes = ['*'];

export function getRedirectToLoginUri(): string {
  const clientId = getLoginClientId();
  const redirectUri = getLoginRedirectUri();
  const host = getLoginHost();

  const requestScopes = scopes.map((value) => `${scope_prefix}/${value}`).join('+');

  return `${host}oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${requestScopes}`;
}
