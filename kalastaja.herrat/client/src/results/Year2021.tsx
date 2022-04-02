import React from 'react';
import withAuthentication from '../authentication/withAuthentication';
import { Competitor } from './types';
import { YearlyResults } from './YearlyResults';
const Year2021 = () => {
  const results = [
    new Competitor({
      fishWeight: 6.75,
      name: 'Janne',
      place: 2,
      location: 'Suuri paljärvi',
    }),
    new Competitor({
      fishWeight: 7.0,
      name: 'Lauri',
      place: 1,
      location: 'Kärppä',
    }),
    new Competitor({
      fishWeight: 5.9,
      name: 'Petri',
      place: 3,
      location: 'Kärppä',
    }),
  ];

  return <YearlyResults competitors={results} />;
}

export default withAuthentication(Year2021);