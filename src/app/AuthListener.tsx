// app/AuthListener.tsx
'use client'

import { useEffect } from 'react'
import { initAuthListener } from '../lib/authlistner'

export function AuthListener() {
  useEffect(() => {
    const cleanup = initAuthListener();
    return () => {
      if (typeof cleanup === 'function') (cleanup as Function)();
    }
  }, []);

  return null;
}