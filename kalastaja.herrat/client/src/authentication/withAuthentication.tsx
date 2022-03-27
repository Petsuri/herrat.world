import React, { useEffect, useState } from 'react';
import { AccessTokenState, getAccessTokenState, isLoginRequired } from './accessToken';
import { getRedirectToLoginUri } from './login';

const withAuthentication = (Component: React.FC) => {
  return () => {
    const [tokenState, setCredentialState] = useState<AccessTokenState>(AccessTokenState.Undefined);

    useEffect(() => {
      setCredentialState(getAccessTokenState());
    }, []);

    if (tokenState === AccessTokenState.Undefined) {
      return null;
    }

    if (isLoginRequired(tokenState)) {
      const loginUri = getRedirectToLoginUri();
      window.location.href = loginUri;
      return null;
    }

    return <Component />;
  };
};

export default withAuthentication;
