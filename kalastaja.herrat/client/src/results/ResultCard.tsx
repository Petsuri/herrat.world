import React from 'react';
import { Box, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';
import { Competitor } from './types';
import { styled } from '@mui/system';

export interface ResultCardProps {
  readonly competitor: Competitor;
}

const List = styled('ul')({
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export function ResultCard(props: ResultCardProps) {
  const { competitor } = props;

  return (
    <Grid item xs={12} sm={12} md={4}>
      <Card>
        <CardHeader
          title={competitor.title()}
          titleTypographyProps={{ align: 'center' }}
          subheader={competitor.isFirstPlace() ? 'Winner' : ''}
          subheaderTypographyProps={{
            align: 'center',
          }}
          sx={{
            backgroundColor: competitor.color(),
          }}
        />
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'baseline',
              mb: 2,
            }}>
            <Typography component='h2' variant='h3' color='text.primary'>
              {competitor.weight()}
            </Typography>
            <Typography variant='h6' color='text.secondary'>
              kg
            </Typography>
          </Box>
          <List>
            <Typography component='li' variant='subtitle1' align='center'>
              {competitor.location()}
            </Typography>
          </List>
        </CardContent>
      </Card>
    </Grid>
  );
}
