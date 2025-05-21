"use client"

import type React from "react"

import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react"

export type Message = {
  role: "user" | "assistant"
  content: string
}

type ChatSession = {
  modelId: string
  provider: string
  messages: Message[]
  id: string
  createdAt: Date
  name?: string
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
  createNewChat: (provider?: string, modelId?: string) => void
  currentChatId: string | null
  setSelectedChat: (chatId: string) => void
  deleteChat: (chatId: string) => void
  renameChat: (chatId: string, name: string) => void
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

// Helper function to generate a unique ID
const generateId = () => `chat_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

const ModelContext = createContext<ModelContextType>({
  selectedModel: defaultModel,
  setSelectedModel: () => {},
  availableModels,
  chatSessions: {},
  currentMessages: [],
  setCurrentMessages: () => {},
  clearCurrentChat: () => {},
  createNewChat: () => {},
  currentChatId: null,
  setSelectedChat: () => {},
  deleteChat: () => {},
  renameChat: () => {},
})

export function ModelProvider({ children }: { children: React.ReactNode }) {
  // Generate initial chat ID only once
  const initialChatId = useRef(generateId()).current

  const [selectedModel, setSelectedModel] = useState<ModelType>(defaultModel)
  const [currentChatId, setCurrentChatId] = useState<string | null>(initialChatId)

  // Initialize chat sessions with the initial chat
  const [chatSessions, setChatSessions] = useState<Record<string, ChatSession>>({
    [initialChatId]: {
      modelId: defaultModel.id,
      provider: defaultModel.provider,
      messages: [],
      id: initialChatId,
      createdAt: new Date(),
    },
  })

  const [currentMessages, setCurrentMessages] = useState<Message[]>([])

  // Flag to prevent infinite loops
  const isUpdatingRef = useRef(false)

  // Load current messages when currentChatId changes
  useEffect(() => {
    if (currentChatId && chatSessions[currentChatId]) {
      setCurrentMessages(chatSessions[currentChatId].messages)
    }
  }, [currentChatId, chatSessions])

  // This function will be called when the selected model changes
  const handleModelChange = useCallback(
    (model: ModelType) => {
      // Don't update if it's the same model
      if (model.id === selectedModel.id && model.provider === selectedModel.provider) {
        return
      }

      console.log(`Changing model to: ${model.provider}:${model.id}`)

      // Update the selected model first
      setSelectedModel(model)

      // Find the most recent chat for this model or create a new one
      const modelChats = Object.values(chatSessions)
        .filter((session) => session.modelId === model.id && session.provider === model.provider)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      if (modelChats.length > 0) {
        // Use the most recent chat for this model
        const chatId = modelChats[0].id
        setCurrentChatId(chatId)
        setCurrentMessages(chatSessions[chatId].messages)
      } else {
        // Create a new chat for this model
        const newChatId = generateId()
        const newChat = {
          modelId: model.id,
          provider: model.provider,
          messages: [],
          id: newChatId,
          createdAt: new Date(),
        }

        setChatSessions((prev) => ({
          ...prev,
          [newChatId]: newChat,
        }))

        setCurrentChatId(newChatId)
        setCurrentMessages([])
      }
    },
    [selectedModel, chatSessions],
  )

  // Update messages for the current chat
  const updateCurrentMessages = useCallback(
    (messages: Message[]) => {
      if (!currentChatId) return

      setCurrentMessages(messages)
      setChatSessions((prev) => ({
        ...prev,
        [currentChatId]: {
          ...prev[currentChatId],
          messages,
        },
      }))
    },
    [currentChatId],
  )

  // Clear the current chat
  const clearCurrentChat = useCallback(() => {
    if (!currentChatId) return

    setCurrentMessages([])
    setChatSessions((prev) => ({
      ...prev,
      [currentChatId]: {
        ...prev[currentChatId],
        messages: [],
      },
    }))
  }, [currentChatId])

  // Create a new chat with the specified model or current model
  const createNewChat = useCallback(
    (provider?: string, modelId?: string) => {
      let model = selectedModel

      // If provider and modelId are provided, find the corresponding model
      if (provider && modelId) {
        const foundModel = availableModels.find((m) => m.provider === provider && m.id === modelId)
        if (foundModel) {
          model = foundModel
          setSelectedModel(foundModel)
        }
      }

      const newChatId = generateId()
      const newChat = {
        modelId: model.id,
        provider: model.provider,
        messages: [],
        id: newChatId,
        createdAt: new Date(),
      }

      setChatSessions((prev) => ({
        ...prev,
        [newChatId]: newChat,
      }))

      setCurrentChatId(newChatId)
      setCurrentMessages([])

      console.log(`Created new chat with ID: ${newChatId} for model: ${model.provider}:${model.id}`)
      return newChatId
    },
    [selectedModel],
  )

  // Delete a chat
  const deleteChat = useCallback(
    (chatId: string) => {
      if (!chatSessions[chatId]) return

      setChatSessions((prev) => {
        const newSessions = { ...prev }
        delete newSessions[chatId]
        return newSessions
      })

      // If the deleted chat is the current chat, select another chat or create a new one
      if (currentChatId === chatId) {
        const remainingChats = Object.values(chatSessions).filter((chat) => chat.id !== chatId)
        if (remainingChats.length > 0) {
          // Select the most recent chat
          const mostRecentChat = remainingChats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
          setCurrentChatId(mostRecentChat.id)
          setCurrentMessages(mostRecentChat.messages)

          // Update selected model to match the chat's model
          const model = availableModels.find(
            (m) => m.provider === mostRecentChat.provider && m.id === mostRecentChat.modelId,
          )
          if (model) {
            setSelectedModel(model)
          }
        } else {
          // Create a new chat with the current model
          createNewChat()
        }
      }
    },
    [chatSessions, currentChatId, createNewChat],
  )

  // Rename a chat
  const renameChat = useCallback(
    (chatId: string, name: string) => {
      if (!chatSessions[chatId]) return

      setChatSessions((prev) => ({
        ...prev,
        [chatId]: {
          ...prev[chatId],
          name,
        },
      }))
    },
    [chatSessions],
  )

  // Set the selected chat
  const setSelectedChat = useCallback(
    (chatId: string) => {
      if (!chatSessions[chatId] || currentChatId === chatId || isUpdatingRef.current) return

      // Set flag to prevent infinite loops
      isUpdatingRef.current = true

      try {
        // Update the current chat ID
        setCurrentChatId(chatId)

        // Update the messages
        setCurrentMessages(chatSessions[chatId].messages)

        // Update the selected model to match the chat's model
        const chat = chatSessions[chatId]
        const model = availableModels.find((m) => m.provider === chat.provider && m.id === chat.modelId)

        if (model && (model.id !== selectedModel.id || model.provider !== selectedModel.provider)) {
          setSelectedModel(model)
        }
      } finally {
        // Reset the flag after a short delay to ensure all updates have been processed
        setTimeout(() => {
          isUpdatingRef.current = false
        }, 100)
      }
    },
    [chatSessions, currentChatId, selectedModel],
  )

  const contextValue = {
    selectedModel,
    setSelectedModel: handleModelChange,
    availableModels,
    chatSessions,
    currentMessages,
    setCurrentMessages: updateCurrentMessages,
    clearCurrentChat,
    createNewChat,
    currentChatId,
    setSelectedChat,
    deleteChat,
    renameChat,
  }

  return <ModelContext.Provider value={contextValue}>{children}</ModelContext.Provider>
}

export const useModel = () => useContext(ModelContext)
