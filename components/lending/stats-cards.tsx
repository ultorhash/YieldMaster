'use client'

import { LendingPool, formatTVL } from '@/lib/lending-data'
import { TrendingUp, DollarSign, Layers } from 'lucide-react'

interface StatsCardsProps {
  pools: LendingPool[]
  isLoading: boolean
}

export function StatsCards({ pools, isLoading }: StatsCardsProps) {
  const totalTVL = pools.reduce((sum, pool) => sum + pool.tvl, 0)
  const avgSupplyApy = pools.length > 0
    ? pools.reduce((sum, pool) => sum + pool.supplyApy, 0) / pools.length
    : 0
  const maxSupplyApy = pools.length > 0
    ? Math.max(...pools.map(pool => pool.supplyApy))
    : 0

  const stats = [
    { label: 'Total TVL', value: formatTVL(totalTVL), icon: DollarSign, description: `${pools.length} pools` },
    { label: 'Average APY', value: `${avgSupplyApy.toFixed(2)}%`, icon: TrendingUp, description: 'Supply APY' },
    { label: 'Highest APY', value: `${maxSupplyApy.toFixed(2)}%`, icon: Layers, description: 'Best offer' },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card border border-border p-3 lg:p-5 animate-pulse">
            <div className="h-4 w-4 bg-muted rounded mb-2 lg:mb-3" />
            <div className="h-7 lg:h-9 w-2/3 bg-muted rounded mb-2" />
            <div className="h-3 w-1/2 bg-muted rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <div key={index} className="bg-card border border-border p-3 lg:p-5 min-w-0">
          <div className="flex items-start justify-between mb-2 lg:mb-3">
            <stat.icon className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground shrink-0" />
          </div>
          <p className="text-base sm:text-xl lg:text-3xl font-mono font-bold text-foreground mb-1 truncate">
            {stat.value}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5">
            <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider truncate">
              {stat.label}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              {stat.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
