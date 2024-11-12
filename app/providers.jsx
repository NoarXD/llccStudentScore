'use client'

import { NextUIProvider } from '@nextui-org/react'
import { AuthProvider } from './authProviders'

export function Providers({ children }) {
  return (
    <NextUIProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </NextUIProvider>
  )
}