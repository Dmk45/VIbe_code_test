"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle } from "lucide-react"

type Provider = {
  id: string
  name: string
  status: "configured" | "not_configured"
  models: string[]
}

export function ProviderStatus() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProviders() {
      try {
        const response = await fetch("/api/providers")
        const data = await response.json()
        setProviders(data.providers)
      } catch (error) {
        console.error("Failed to fetch providers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
  }, [])

  if (loading) {
    return <div className="text-center py-4">Loading provider status...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {providers.map((provider) => (
        <Card key={provider.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>{provider.name}</CardTitle>
              <Badge variant={provider.status === "configured" ? "default" : "destructive"}>
                {provider.status === "configured" ? (
                  <CheckCircle className="h-3 w-3 mr-1" />
                ) : (
                  <AlertCircle className="h-3 w-3 mr-1" />
                )}
                {provider.status === "configured" ? "Configured" : "Not Configured"}
              </Badge>
            </div>
            <CardDescription>
              {provider.status === "configured"
                ? `${provider.models.length} models available`
                : "API key not configured"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {provider.status === "configured" && (
              <div className="flex flex-wrap gap-2">
                {provider.models.map((model) => (
                  <Badge key={model} variant="outline">
                    {model.split("/").pop()}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
