import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './Main';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/2021' element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
}
