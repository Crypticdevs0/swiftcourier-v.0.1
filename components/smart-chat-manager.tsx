"use client"

import { FallbackChat } from "./fallback-chat"

export function SmartChatManager() {
  // Temporarily disable Tawk.to due to script errors
  // Only use the fallback chat for now
  return <FallbackChat />
}
