"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"

export function ApiDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDebugInfo = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/debug")
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`)
      }
      const data = await response.json()
      setDebugInfo(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebugInfo()
  }, [])

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">API Diagnostics</CardTitle>
          <Button variant="outline" size="sm" onClick={fetchDebugInfo} disabled={loading}>
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
        <CardDescription>Check API connection and environment variables</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-800 dark:text-red-300">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">API Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : debugInfo ? (
          <div className="space-y-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              <span className="font-medium">{debugInfo.status}</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Environment</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400">OpenAI API Key:</span>
                </div>
                <div className="flex items-center">
                  {debugInfo.environment.openaiKeySet ? (
                    <span className="text-green-500 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> Set ({debugInfo.environment.openaiKeyPreview})
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" /> Not set
                    </span>
                  )}
                </div>

                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400">Anthropic API Key:</span>
                </div>
                <div className="flex items-center">
                  {debugInfo.environment.anthropicKeySet ? (
                    <span className="text-green-500 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" /> Set ({debugInfo.environment.anthropicKeyPreview})
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" /> Not set
                    </span>
                  )}
                </div>

                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400">Node Version:</span>
                </div>
                <div>{debugInfo.environment.nodeVersion}</div>

                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400">Runtime:</span>
                </div>
                <div>{debugInfo.environment.runtime}</div>
              </div>
            </div>

            <div className="pt-2 text-sm text-gray-500 dark:text-gray-400">
              {!debugInfo.environment.openaiKeySet && !debugInfo.environment.anthropicKeySet ? (
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-md text-yellow-800 dark:text-yellow-300">
                  <p className="font-medium">No API keys are set</p>
                  <p className="mt-1">
                    You need to add at least one API key to use the AI models. Add OPENAI_API_KEY or ANTHROPIC_API_KEY
                    to your environment variables.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-4">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
