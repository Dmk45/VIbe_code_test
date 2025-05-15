"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useModel, type Message } from "@/context/model-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ThinkingIndicator } from "@/components/thinking-indicator"

export function ChatInterface() {
  const { selectedModel, currentMessages, setCurrentMessages, clearCurrentChat } = useModel()
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [currentMessages])

  // Clean up abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort()
      }
    }
  }, [abortController])

  const cancelRequest = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
    }
    setIsLoading(false)
    setStatusMessage("")
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Reset error state
    setError(null)

    // Create a new abort controller for this request
    const controller = new AbortController()
    setAbortController(controller)

    const userMessage: Message = { role: "user", content: input }
    const updatedMessages = [...currentMessages, userMessage]
    setCurrentMessages(updatedMessages)
    setInput("")
    setIsLoading(true)
    setStatusMessage("AI is thinking...")

    try {
      console.log("Sending request to simple API")
      console.log(`Provider: ${selectedModel.provider}, Model: ${selectedModel.id}`)

      // Use the simple-chat API endpoint that works in the debug page
      const response = await fetch("/api/simple-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          provider: selectedModel.provider,
          modelId: selectedModel.id,
        }),
        signal: controller.signal,
      })

      console.log(`Response status: ${response.status}`)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          `Server responded with ${response.status}: ${response.statusText}. ${data.details || data.error || ""}`,
        )
      }

      // Add the AI response to the messages
      const assistantMessage: Message = { role: "assistant", content: data.text }
      setCurrentMessages([...updatedMessages, assistantMessage])
    } catch (error) {
      // Don't show error for aborted requests
      if (error instanceof DOMException && error.name === "AbortError") {
        console.log("Request aborted")
      } else {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error("Error:", errorMessage)

        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
      setStatusMessage("")
      setAbortController(null)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          {currentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Bot className="h-12 w-12 mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-white">Start a new conversation</h3>
              <p className="text-sm text-gray-400 max-w-md mt-2">
                This is a new chat with {selectedModel.name}. Your conversation will appear here.
              </p>
            </div>
          ) : (
            <div>
              {error && (
                <div className="mx-auto max-w-3xl px-4 py-4">
                  <div className="mb-4 p-4 bg-red-900/30 border border-red-800 rounded-md text-red-300">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Error connecting to AI model</p>
                        <p className="text-sm mt-1">{error}</p>
                        <p className="text-sm mt-2">
                          Please check your API keys and try again. If the problem persists, try a different model.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentMessages.map((message, index) => (
                <div
                  key={index}
                  className={cn("border-b border-gray-800 py-6", message.role === "user" ? "bg-black" : "bg-gray-900")}
                >
                  <div className="mx-auto max-w-3xl px-4">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        {message.role === "user" ? (
                          <div className="bg-gray-700 h-8 w-8 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-300" />
                          </div>
                        ) : (
                          <div className="bg-purple-900 h-8 w-8 rounded-full flex items-center justify-center">
                            <Bot className="h-5 w-5 text-purple-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium mb-1 flex items-center gap-2 text-white">
                          {message.role === "user" ? "You" : selectedModel.name}
                        </div>
                        <div className="text-gray-300 whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Status message */}
              {statusMessage && (
                <div className="border-b border-gray-800 py-6 bg-gray-900">
                  <div className="mx-auto max-w-3xl px-4">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <div className="bg-purple-900 h-8 w-8 rounded-full flex items-center justify-center">
                          <Bot className="h-5 w-5 text-purple-300" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium mb-1 flex items-center gap-2 text-white">{selectedModel.name}</div>
                        <div className="text-gray-300 flex items-center">
                          {statusMessage} <ThinkingIndicator />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>

      <div className="border-t border-gray-800 p-4 bg-black">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={handleSubmit} className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${selectedModel.name}...`}
              className="resize-none pr-12 bg-gray-950 border-gray-800 text-white placeholder:text-gray-400 focus-visible:ring-gray-700"
              rows={3}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 bottom-2 bg-gray-700 hover:bg-gray-600"
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}
