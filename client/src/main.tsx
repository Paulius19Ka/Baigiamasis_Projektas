import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import App from './App.tsx';
import { UsersProvider } from './components/contexts/UsersContext.tsx';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <BrowserRouter>
    <UsersProvider>
      <App />
    </UsersProvider>
  </BrowserRouter>
)
