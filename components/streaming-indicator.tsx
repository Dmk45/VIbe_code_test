"use client"

import { useEffect, useState } from "react"

export function StreamingIndicator() {
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

  return <span className="text-gray-500">{dots}</span>
}
