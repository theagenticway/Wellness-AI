import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../App.tsx';
import '../styles/globals.css';

console.log('main.tsx executing...');
console.log('Root element:', document.getElementById('root'));

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
} else {
  console.log('Creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  console.log('Rendering App...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
  console.log('App rendered');
}