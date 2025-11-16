'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const SmartChatManager = dynamic(
  () => import('@/components/smart-chat-manager').then(mod => mod.SmartChatManager),
  { ssr: false }
)

export function SmartChatManagerWrapper() {
  return <SmartChatManager />
}
