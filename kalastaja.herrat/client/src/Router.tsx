
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from './App';

const Router = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={App} />
        <Route path="/2021" element={App} />

    </Routes>
    </BrowserRouter>
  )
  

}