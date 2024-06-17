import './index.css';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { LoadingPage } from './pages/LoadingPage';
import router from './pages/route';
createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider
      router={router}
      fallbackElement={<LoadingPage />}
    />
    <Toaster />
  </>,
);
