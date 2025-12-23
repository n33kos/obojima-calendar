import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import { CalendarDataProvider } from './contexts/CalendarDataContext';
import './styles/global.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CalendarDataProvider>
      <App />
    </CalendarDataProvider>
  </React.StrictMode>
);
