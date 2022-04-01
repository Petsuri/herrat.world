import React from 'react';
import { Container, Grid } from '@mui/material';
import { ResultCard } from './ResultCard';
import { Competitor } from './types';

export interface YearlyResultsProps {
  readonly competitors: Competitor[];
}

export function YearlyResults(props: YearlyResultsProps) {
  const { competitors } = props;
  return (
    <Container maxWidth='md' component='main'>
      <Grid container spacing={5} alignItems='flex-end'>
        {competitors.map((competitor, index) => (
          <ResultCard key={index} competitor={competitor} />
        ))}
      </Grid>
    </Container>
  );
}
