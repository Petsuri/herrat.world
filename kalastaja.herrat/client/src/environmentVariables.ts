export const getLoginHost = (): string => {
  if (process.env.REACT_APP_LOGIN_HOST === undefined) {
    throw new Error('REACT_APP_LOGIN_HOST environment variable must be defined');
  }

  return process.env.REACT_APP_LOGIN_HOST;
};

export const getLoginRedirectUri = (): string => {
  if (process.env.REACT_APP_LOGIN_REDIRECT_URI === undefined) {
    throw new Error('REACT_APP_LOGIN_REDIRECT_URI environment variable must be defined');
  }

  return process.env.REACT_APP_LOGIN_REDIRECT_URI;
};

export const getLoginClientId = (): string => {
  if (process.env.REACT_APP_LOGIN_CLIENT_ID === undefined) {
    throw new Error('REACT_APP_LOGIN_CLIENT_ID environment variable must be defined');
  }

  return process.env.REACT_APP_LOGIN_CLIENT_ID;
};
