'use client';

import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#161b27',
            color: '#fff',
            border: '1px solid rgba(0, 255, 208, 0.12)',
            borderRadius: '8px',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#00ffd0', secondary: '#0d1117' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0d1117' },
          },
        }}
      />
    </>
  );
}
