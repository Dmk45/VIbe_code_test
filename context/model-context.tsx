"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

export type Message = {
  role: "user" | "assistant"
  content: string
}

type ChatSession = {
  modelId: string
  messages: Message[]
}

type ModelType = {
  provider: string
  id: string
  name: string
}

type ModelContextType = {
  selectedModel: ModelType
  setSelectedModel: (model: ModelType) => void
  availableModels: ModelType[]
  chatSessions: Record<string, ChatSession>
  currentMessages: Message[]
  setCurrentMessages: (messages: Message[]) => void
  clearCurrentChat: () => void
}

const defaultModel: ModelType = {
  provider: "openai",
  id: "gpt-4o",
  name: "GPT-4o (OpenAI)",
}

const availableModels: ModelType[] = [
  defaultModel,
  { provider: "openai", id: "gpt-4o-mini", name: "GPT-4o Mini (OpenAI)" },
  { provider: "openai", id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo (OpenAI)" },
  // OpenAI reasoning models
  { provider: "openai", id: "o1", name: "O1 - Reasoning (OpenAI)" },
  { provider: "openai", id: "o1-mini", name: "O1 Mini - Reasoning (OpenAI)" },
  { provider: "openai", id: "o1-preview", name: "O1 Preview - Reasoning (OpenAI)" },
  // Add Claude 3.7 Sonnet at the top of the Anthropic models
  { provider: "anthropic", id: "claude-3-7-sonnet-20250219", name: "Claude 3.7 Sonnet (Anthropic)" },
  { provider: "anthropic", id: "claude-3-5-sonnet-20240620", name: "Claude 3.5 Sonnet (Anthropic)" },
  { provider: "anthropic", id: "claude-3-haiku-20240307", name: "Claude 3 Haiku (Anthropic)" },
  { provider: "anthropic", id: "claude-3-opus-20240229", name: "Claude 3 Opus (Anthropic)" },
]

const ModelContext = createContext<ModelContextType>({
  selectedModel: defaultModel,
  setSelectedModel: () => {},
  availableModels,
  chatSessions: {},
  currentMessages: [],
  setCurrentMessages: () => {},
  clearCurrentChat: () => {},
})

export function ModelProvider({ children }: { children: React.ReactNode }) {
  const [selectedModel, setSelectedModel] = useState<ModelType>(defaultModel)
  const [chatSessions, setChatSessions] = useState<Record<string, ChatSession>>({
    [`${defaultModel.provider}:${defaultModel.id}`]: {
      modelId: defaultModel.id,
      messages: [],
    },
  })
  const [currentMessages, setCurrentMessages] = useState<Message[]>([])

  // This function will be called when the selected model changes
  const handleModelChange = (model: ModelType) => {
    setSelectedModel(model)
    const modelKey = `${model.provider}:${model.id}`

    // If this model doesn't have a chat session yet, create one
    if (!chatSessions[modelKey]) {
      setChatSessions((prev) => ({
        ...prev,
        [modelKey]: {
          modelId: model.id,
          messages: [],
        },
      }))
      setCurrentMessages([])
    } else {
      // Load this model's messages
      setCurrentMessages(chatSessions[modelKey].messages)
    }
  }

  // Update messages for the current model
  const updateCurrentMessages = (messages: Message[]) => {
    setCurrentMessages(messages)
    const modelKey = `${selectedModel.provider}:${selectedModel.id}`

    setChatSessions((prev) => ({
      ...prev,
      [modelKey]: {
        ...prev[modelKey],
        messages,
      },
    }))
  }

  const clearCurrentChat = () => {
    const modelKey = `${selectedModel.provider}:${selectedModel.id}`
    setCurrentMessages([])
    setChatSessions((prev) => ({
      ...prev,
      [modelKey]: {
        ...prev[modelKey],
        messages: [],
      },
    }))
  }

  return (
    <ModelContext.Provider
      value={{
        selectedModel,
        setSelectedModel: handleModelChange,
        availableModels,
        chatSessions,
        currentMessages,
        setCurrentMessages: updateCurrentMessages,
        clearCurrentChat,
      }}
    >
      {children}
    </ModelContext.Provider>
  )
}

export const useModel = () => useContext(ModelContext)
