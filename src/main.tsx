import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GalaxyMap from './components/GalaxyMap';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/galaxy-map" element={<GalaxyMap />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
