import { isAfter } from 'date-fns';
import { failure, Result, success } from '../common';

export enum AccessTokenState {
  Undefined,
  Valid,
  Missing,
  Expired,
}

export type AccessToken = {
  readonly token: string;
  readonly refreshToken: string;
  readonly validUntil: Date;
  readonly tokenType: string;
};

const AccessTokenKey = 'access_token';

export function getAccessTokenState(): AccessTokenState {
  const token = getAccessToken();
  if (!token.ok) {
    return AccessTokenState.Missing;
  }

  const now = new Date();
  if (isAfter(token.value.validUntil, now)) {
    return AccessTokenState.Expired;
  }

  return AccessTokenState.Valid;
}

export function save(token: AccessToken): void {
  sessionStorage.setItem(AccessTokenKey, JSON.stringify(token));
}

export function getAccessToken(): Result<AccessToken, string> {
  const token = sessionStorage.getItem(AccessTokenKey);
  if (token === null) {
    return failure('Credentials are not stored');
  }

  return success<AccessToken>(JSON.parse(token));
}

export function isLoginRequired(state: AccessTokenState): Boolean {
  return state === AccessTokenState.Missing || state === AccessTokenState.Expired;
}

export function clear(): void {
  sessionStorage.clear();
}
