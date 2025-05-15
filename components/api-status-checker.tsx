"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"

export function ApiStatusChecker() {
  const [status, setStatus] = useState<"loading" | "working" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    async function checkApiStatus() {
      try {
        const response = await fetch("/api/test")
        if (response.ok) {
          setStatus("working")
        } else {
          setStatus("error")
          setErrorMessage(`API returned status ${response.status}`)
        }
      } catch (error) {
        setStatus("error")
        setErrorMessage(error instanceof Error ? error.message : String(error))
      }
    }

    checkApiStatus()
  }, [])

  if (status === "loading") {
    return <span className="text-gray-400">Checking...</span>
  }

  if (status === "error") {
    return (
      <span className="text-red-400 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" /> Error
      </span>
    )
  }

  return (
    <span className="text-green-400 flex items-center gap-1">
      <CheckCircle className="h-3 w-3" /> Connected
    </span>
  )
}
