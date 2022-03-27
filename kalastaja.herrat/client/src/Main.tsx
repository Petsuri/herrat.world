import React from 'react';
import { Typography } from '@mui/material';
import withAuthentication from './authentication/withAuthentication';

const Main = () => {
  return (
    <Typography variant='body1' align='center' color='text.primary'>
      Hihheli hei Kalastaja Herra!
    </Typography>
  );
};

export default withAuthentication(Main);
