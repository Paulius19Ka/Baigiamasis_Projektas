import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import App from './App.tsx';
import { UsersProvider } from './components/contexts/UsersContext.tsx';
import { PostsProvider } from './components/contexts/PostsContext.tsx';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <BrowserRouter>
    <UsersProvider>
      <PostsProvider>
        <App />
      </PostsProvider>
    </UsersProvider>
  </BrowserRouter>
)
