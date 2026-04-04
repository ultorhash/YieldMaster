'use client'

import { RefreshCw } from 'lucide-react'
import { useState, useEffect } from 'react'

interface HeaderProps {
  onRefresh: () => void
  isLoading: boolean
  lastUpdated: Date | null
}

export function Header({ onRefresh, isLoading, lastUpdated }: HeaderProps) {
  const [formattedTime, setFormattedTime] = useState<string | null>(null)

  useEffect(() => {
    if (lastUpdated) {
      setFormattedTime(lastUpdated.toLocaleTimeString('en-US'))
    }
  }, [lastUpdated])

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">YA</span>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground tracking-tight">
                Yield Master
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                DeFi Lending Rates
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {formattedTime && (
              <span className="text-xs text-muted-foreground hidden md:block">
                Last updated: {formattedTime}
              </span>
            )}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground border border-border hover:border-muted-foreground transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
