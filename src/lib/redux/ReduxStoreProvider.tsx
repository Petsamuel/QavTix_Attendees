'use client'

import { useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from './store'

export default function ReduxStoreProvider({
  children
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    const originalRandom = Math.random
    Math.random = () => 0.5
    storeRef.current = makeStore()
    Math.random = originalRandom
  }

  return <Provider store={storeRef.current}>{children}</Provider>
}