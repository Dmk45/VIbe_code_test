"use client"

import { useEffect, useState } from "react"

export function ThinkingIndicator() {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return <span className="inline-block w-6 text-left">{dots}</span>
}
