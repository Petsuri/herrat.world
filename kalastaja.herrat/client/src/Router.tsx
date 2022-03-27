import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginCallback from './authentication/LoginCallback';
import Main from './Main';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login/callback/' element={<LoginCallback />} />
        <Route path='/2021' element={<Main />} />
        <Route path='/' element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}
