"use client"

import { useModel } from "@/context/model-context"
import { Button } from "@/components/ui/button"
import { Trash2, Plus } from "lucide-react"

export function ChatSessionsManager() {
  const { clearCurrentChat, createNewChat, currentMessages, selectedModel } = useModel()

  // Only show if there are messages in the current chat
  if (currentMessages.length === 0) {
    return null
  }

  const handleNewChat = () => {
    createNewChat(selectedModel.provider, selectedModel.id)
  }

  return (
    <div className="bg-black border-b border-gray-800 p-4">
      <div className="mx-auto max-w-3xl flex justify-end items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewChat}
            className="text-gray-400 hover:text-green-400 border-gray-700 hover:border-green-800 bg-transparent"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearCurrentChat}
            className="text-gray-400 hover:text-red-400 border-gray-700 hover:border-red-800 bg-transparent"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Chat
          </Button>
        </div>
      </div>
    </div>
  )
}
