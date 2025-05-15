"use client"

import { useModel } from "@/context/model-context"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export function ChatSessionsManager() {
  const { chatSessions, clearCurrentChat } = useModel()

  // Count active chat sessions (those with messages)
  const activeSessions = Object.values(chatSessions).filter((session) => session.messages.length > 0).length

  if (activeSessions === 0) {
    return null
  }

  return (
    <div className="bg-black border-b border-gray-800 p-4">
      <div className="mx-auto max-w-3xl flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-400">
            You have {activeSessions} active chat {activeSessions === 1 ? "session" : "sessions"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={clearCurrentChat}
          className="text-gray-400 hover:text-red-400 border-gray-700 hover:border-red-800 bg-transparent"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Current Chat
        </Button>
      </div>
    </div>
  )
}
