"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
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

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const [agentStatus, setAgentStatus] = useState<"connecting" | "connected" | "offline">("offline")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && !isConnected) {
      // Simulate connection to live chat
      setAgentStatus("connecting")
      setTimeout(() => {
        setIsConnected(true)
        setAgentStatus("connected")
        setMessages([
          {
            id: "1",
            type: "bot",
            content: "Hello! I'm here to help you with your Swift Courier needs. How can I assist you today?",
            timestamp: new Date(),
          },
        ])
      }, 2000)
    }
  }, [isOpen, isConnected])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate agent response
    setTimeout(() => {
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "agent",
        content: "Thank you for your message. Let me help you with that. Can you provide your tracking number?",
        timestamp: new Date(),
        agentName: "Sarah",
      }
      setMessages((prev) => [...prev, agentMessage])
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
        size="lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-80 shadow-xl z-50 ${isMinimized ? "h-16" : "h-96"}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4" />
            <CardTitle className="text-sm">Live Chat Support</CardTitle>
            <Badge variant={agentStatus === "connected" ? "default" : "secondary"} className="text-xs">
              {agentStatus === "connected" ? "Online" : agentStatus === "connecting" ? "Connecting..." : "Offline"}
            </Badge>
          </div>
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" onClick={() => setIsMinimized(!isMinimized)}>
              <Minimize2 className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsOpen(false)}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {!isMinimized && (
          <CardDescription className="text-xs">
            {agentStatus === "connected" ? "Connected to Sarah" : "Connecting to support agent..."}
          </CardDescription>
        )}
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex flex-col h-full p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
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
                          <User className="h-3 w-3 mr-1" />
                        ) : (
                          <Bot className="h-3 w-3 mr-1" />
                        )}
                        <span className="text-xs font-medium">
                          {message.agentName || (message.type === "agent" ? "Agent" : "Swift Bot")}
                        </span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={agentStatus !== "connected"}
                className="flex-1"
              />
              <Button size="sm" onClick={sendMessage} disabled={!inputValue.trim() || agentStatus !== "connected"}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
