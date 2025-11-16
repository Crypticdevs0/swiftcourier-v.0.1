'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const Header = dynamic(
  () => import('@/components/header').then(mod => mod.Header),
  { ssr: false }
)

export function HeaderWrapper() {
  return <Header />
}
