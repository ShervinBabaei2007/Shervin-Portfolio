import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './fonts.css';
import './styles.css';

const container = document.getElementById('root')!;
const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Production pages are prerendered, so attach to the existing markup.
// The dev server serves an empty root, so render from scratch there.
if (container.firstElementChild) ReactDOM.hydrateRoot(container, app);
else ReactDOM.createRoot(container).render(app);
