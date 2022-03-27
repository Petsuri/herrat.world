import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeCode } from './accessTokenExchange';
import { save } from './accessToken';
import { Unit, Result } from '../common';

const LoginCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');

  useEffect(() => {
    if (!code) {
      window.location.href = '/';
      return;
    }

    exchangeCode(code, save).then((result: Result<Unit, string>) => {
      if (result.ok) {
        return navigate('/');
      }

      window.location.href = '/';
    });
  }, [code, navigate]);

  return null;
};

export default LoginCallback;
