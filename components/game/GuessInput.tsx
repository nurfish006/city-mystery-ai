"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

interface GuessInputProps {
  onGuess: (guess: string) => void
  disabled?: boolean
}

export function GuessInput({ onGuess, disabled }: GuessInputProps) {
  const [guess, setGuess] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (guess.trim()) {
      onGuess(guess)
      setGuess("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <Input
        placeholder="Enter city name..."
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        disabled={disabled}
        className="flex-1"
      />
      <Button type="submit" disabled={disabled || !guess.trim()}>
        <Send className="w-4 h-4 mr-2" />
        Guess
      </Button>
    </form>
  )
}
