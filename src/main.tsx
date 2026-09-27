// Ensure window.fetch has both getter and setter in iframe sandboxes
if (typeof window !== 'undefined') {
  try {
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch') ||
                 Object.getOwnPropertyDescriptor(Object.getPrototypeOf(window), 'fetch');
    if (desc && desc.get && !desc.set) {
      let currentFetch = window.fetch.bind(window);
      Object.defineProperty(window, 'fetch', {
        get() {
          return currentFetch;
        },
        set(fn) {
          currentFetch = fn;
        },
        configurable: true,
        enumerable: true,
      });
    }
  } catch {
    // Ignore if environment prevents redefinition
  }
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
