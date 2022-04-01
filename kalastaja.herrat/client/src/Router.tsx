import { Container } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginCallback from './authentication/LoginCallback';
import Year2021 from './results/Year2021';

export default function Router() {
  return (
    <Container sx={{ height: '100vh', padding: '2rem' }}>
      <BrowserRouter>
        <Routes>
          <Route path='/login/callback/' element={<LoginCallback />} />
          <Route path='/2021/results' element={<Year2021 />} />
          <Route path='/' element={<Year2021 />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}
