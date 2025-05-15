"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Send } from "lucide-react"

export function SimpleChatTest() {
  const [provider, setProvider] = useState("openai")
  const [model, setModel] = useState("gpt-3.5-turbo")
  const [input, setInput] = useState("Hello, can you respond with a short greeting?")
  const [response, setResponse] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleProviderChange = (value: string) => {
    setProvider(value)
    // Set default model based on provider
    if (value === "openai") {
      setModel("gpt-3.5-turbo")
    } else if (value === "anthropic") {
      setModel("claude-3-haiku-20240307")
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setResponse("")

    try {
      const response = await fetch("/api/simple-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: input }],
          provider,
          modelId: model,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || `Error: ${response.status}`)
      }

      setResponse(data.text)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Simple Chat Test</CardTitle>
        <CardDescription>Test direct API communication with AI models</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Provider</label>
              <Select value={provider} onValueChange={handleProviderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Model</label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {provider === "openai" ? (
                    <>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="claude-3-haiku-20240307">Claude 3 Haiku</SelectItem>
                      <SelectItem value="claude-3-5-sonnet-20240620">Claude 3.5 Sonnet</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Message</label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={2}
              placeholder="Enter a message to test"
            />
          </div>

          <Button onClick={handleSubmit} disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Test API Call
          </Button>

          {error && (
            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300">
              <p className="font-medium">Error</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {response && (
            <div className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md">
              <p className="font-medium text-green-800 dark:text-green-300">Response</p>
              <p className="mt-2 text-gray-800 dark:text-gray-200">{response}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
