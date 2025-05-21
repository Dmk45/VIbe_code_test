"use client"

import type React from "react"

import { useModel } from "@/context/model-context"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Zap, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ApiStatusChecker } from "@/components/api-status-checker"
import { useState, useMemo } from "react"
import { StandaloneModelSelector } from "@/components/standalone-model-selector"

export function ChatSidebar() {
  const { chatSessions, createNewChat, currentChatId, setSelectedChat, deleteChat, selectedModel, availableModels } =
    useModel()
  const [isCreatingNew, setIsCreatingNew] = useState(false)

  // Get all chats, sorted by creation date (newest first) - memoized
  const allChats = useMemo(() => {
    return Object.values(chatSessions).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }, [chatSessions])

  // Pre-compute model names for all chats to avoid hooks in render functions
  const modelNames = useMemo(() => {
    const names: Record<string, string> = {}

    Object.entries(chatSessions).forEach(([chatId, chat]) => {
      const model = availableModels.find((m) => m.id === chat.modelId && m.provider === chat.provider)
      names[chatId] = model ? model.name : chat.modelId
    })

    return names
  }, [chatSessions, availableModels])

  // Function to get a preview of the chat content
  const getChatPreview = (chatId: string) => {
    const chat = chatSessions[chatId]
    if (!chat || chat.messages.length === 0) return "New chat"

    // If the chat has a name, use that
    if (chat.name) return chat.name

    // Get the first user message as the title
    const firstUserMessage = chat.messages.find((m) => m.role === "user")
    if (firstUserMessage) {
      // Truncate to 30 characters
      return firstUserMessage.content.length > 30
        ? firstUserMessage.content.substring(0, 30) + "..."
        : firstUserMessage.content
    }

    return "New chat"
  }

  const handleCreateNewChat = () => {
    setIsCreatingNew(true)
  }

  const handleModelSelect = (provider: string, modelId: string) => {
    createNewChat(provider, modelId)
    setIsCreatingNew(false)
  }

  const handleChatSelect = (chatId: string) => {
    if (currentChatId !== chatId) {
      setSelectedChat(chatId)
    }
  }

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    deleteChat(chatId)
  }

  const handleCreateNewWithCurrentModel = () => {
    createNewChat(selectedModel.provider, selectedModel.id)
    setIsCreatingNew(false)
  }

  return (
    <div className="w-64 bg-gray-950 border-r border-gray-800 h-screen flex flex-col">
      <div className="p-3 border-b border-gray-800">
        <Button
          variant="outline"
          className="w-full justify-start text-white border-white/20 bg-gray-800 hover:bg-gray-700"
          onClick={handleCreateNewWithCurrentModel}
        >
          <Plus className="h-4 w-4 mr-2" />
          New chat with {selectedModel.name.split(" ")[0]}
        </Button>
      </div>

      {isCreatingNew && (
        <div className="p-3 border-b border-gray-800 bg-gray-900">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Select a model</h3>
          <StandaloneModelSelector onSelect={handleModelSelect} />
        </div>
      )}

      <div className="p-3 border-b border-gray-800">
        <h2 className="font-semibold text-lg text-white">Multi-Provider AI Chat</h2>
        <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
          <Zap className="h-3 w-3" /> API Status: <ApiStatusChecker />
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full text-gray-400 hover:text-white hover:bg-gray-800"
          onClick={handleCreateNewChat}
        >
          <Plus className="h-3 w-3 mr-1" />
          New chat with different model
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {allChats.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No chat history yet</div>
          ) : (
            <div className="space-y-1">
              {allChats.map((chat) => (
                <div key={chat.id} className="flex items-center">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left text-gray-300 hover:bg-gray-800 h-auto py-3 rounded-r-none",
                      currentChatId === chat.id && "bg-gray-800",
                    )}
                    onClick={() => handleChatSelect(chat.id)}
                  >
                    <div className="flex items-start w-full">
                      <div className="mr-2 mt-0.5">
                        <MessageCircle className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-medium truncate">{getChatPreview(chat.id)}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          {modelNames[chat.id]}
                          <span className="mx-1">•</span>
                          {chat.messages.filter((m) => m.role === "user").length} messages
                        </div>
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-[calc(100%-2px)] my-1 ml-px w-8 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded-l-none"
                    onClick={(e) => handleDeleteChat(e, chat.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
