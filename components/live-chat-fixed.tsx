"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, User, Bot, X, Minimize2 } from "lucide-react"

interface Message {
  id: string
  type: "user" | "agent" | "bot"
  content: string
  timestamp: Date
  agentName?: string
}

type AgentStatus = "connecting" | "connected" | "offline"

export function LiveChatFixed() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [agentStatus, setAgentStatus] = useState<AgentStatus>("offline")
  const [unreadCount, setUnreadCount] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatButtonRef = useRef<HTMLButtonElement>(null)
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Handle connection simulation with cleanup
  useEffect(() => {
    if (isOpen && !isConnected) {
      setAgentStatus("connecting")

      connectionTimeoutRef.current = setTimeout(() => {
        setIsConnected(true)
        setAgentStatus("connected")
        setMessages([
          {
            id: "welcome",
            type: "bot",
            content: "Hello! I'm here to help you with your Swift Courier needs. How can I assist you today?",
            timestamp: new Date(),
          },
        ])
      }, 2000)
    }

    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current)
      }
    }
  }, [isOpen, isConnected])

  // Focus management
  useEffect(() => {
    if (isOpen && !isMinimized) {
      // Focus input when chat opens
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen, isMinimized])

  // Handle unread messages
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.type !== "user") {
        setUnreadCount((prev) => prev + 1)
      }
    } else if (isOpen) {
      setUnreadCount(0)
    }
  }, [messages, isOpen])

  const sendMessage = useCallback(() => {
    if (!inputValue.trim() || !isConnected) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate agent response with realistic delay
    setTimeout(
      () => {
        const responses = [
          "Thank you for your message. Let me help you with that. Can you provide your tracking number?",
          "I understand your concern. Let me look into this for you right away.",
          "That's a great question! Let me provide you with the information you need.",
          "I'm here to help. Could you please provide more details about your shipment?",
        ]

        const randomResponse = responses[Math.floor(Math.random() * responses.length)]

        const agentMessage: Message = {
          id: `agent-${Date.now()}`,
          type: "agent",
          content: randomResponse,
          timestamp: new Date(),
          agentName: "Sarah",
        }
        setMessages((prev) => [...prev, agentMessage])
      },
      1500 + Math.random() * 1000,
    ) // Random delay between 1.5-2.5s
  }, [inputValue, isConnected])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    },
    [sendMessage],
  )

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    setUnreadCount(0)
  }, [])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    // Return focus to the chat button
    setTimeout(() => {
      chatButtonRef.current?.focus()
    }, 100)
  }, [])

  const handleMinimize = useCallback(() => {
    setIsMinimized(!isMinimized)
    if (!isMinimized) {
      // Focus input when expanding
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isMinimized])

  // Keyboard navigation for chat button
  const handleChatButtonKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        handleOpen()
      }
    },
    [handleOpen],
  )

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          ref={chatButtonRef}
          onClick={handleOpen}
          onKeyDown={handleChatButtonKeyDown}
          className="rounded-full w-14 h-14 shadow-lg relative"
          size="lg"
          aria-label={`Open live chat${unreadCount > 0 ? ` (${unreadCount} unread messages)` : ""}`}
        >
          <MessageCircle className="h-6 w-6" aria-hidden="true" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs"
              aria-label={`${unreadCount} unread messages`}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 w-80 shadow-xl z-50 transition-all duration-200 ${
        isMinimized ? "h-16" : "h-96"
      }`}
      role="dialog"
      aria-labelledby="chat-title"
      aria-describedby="chat-description"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <CardTitle id="chat-title" className="text-sm">
              Live Chat Support
            </CardTitle>
            <Badge
              variant={agentStatus === "connected" ? "default" : "secondary"}
              className="text-xs"
              aria-label={`Agent status: ${agentStatus}`}
            >
              {agentStatus === "connected" ? "Online" : agentStatus === "connecting" ? "Connecting..." : "Offline"}
            </Badge>
          </div>
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleMinimize}
              aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
            >
              <Minimize2 className="h-3 w-3" aria-hidden="true" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleClose} aria-label="Close chat">
              <X className="h-3 w-3" aria-hidden="true" />
            </Button>
          </div>
        </div>
        {!isMinimized && (
          <CardDescription id="chat-description" className="text-xs">
            {agentStatus === "connected" ? "Connected to Sarah" : "Connecting to support agent..."}
          </CardDescription>
        )}
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex flex-col h-full p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4" role="log" aria-live="polite" aria-label="Chat messages">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  role="listitem"
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : message.type === "agent"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.type !== "user" && (
                      <div className="flex items-center mb-1">
                        {message.type === "agent" ? (
                          <User className="h-3 w-3 mr-1" aria-hidden="true" />
                        ) : (
                          <Bot className="h-3 w-3 mr-1" aria-hidden="true" />
                        )}
                        <span className="text-xs font-medium">
                          {message.agentName || (message.type === "agent" ? "Agent" : "Swift Bot")}
                        </span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      <time dateTime={message.timestamp.toISOString()}>{message.timestamp.toLocaleTimeString()}</time>
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={agentStatus !== "connected"}
                className="flex-1"
                aria-label="Type your message"
                aria-describedby="send-button"
              />
              <Button
                id="send-button"
                size="sm"
                onClick={sendMessage}
                disabled={!inputValue.trim() || agentStatus !== "connected"}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
