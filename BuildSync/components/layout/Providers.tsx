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
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            borderRadius: '12px',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            padding: '12px 14px',
            boxShadow: '0 12px 32px rgba(15, 23, 42, 0.08)',
          },
          success: {
            iconTheme: {
              primary: '#2563eb',   // accent
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#dc2626',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </>
  );
}