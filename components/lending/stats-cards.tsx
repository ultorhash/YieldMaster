'use client'

import { LendingPool, formatTVL } from '@/lib/lending-data'
import { TrendingUp, DollarSign, Layers, Activity } from 'lucide-react'

interface StatsCardsProps {
  pools: LendingPool[]
}

export function StatsCards({ pools }: StatsCardsProps) {
  const totalTVL = pools.reduce((sum, pool) => sum + pool.tvl, 0)
  const avgSupplyApy = pools.length > 0
    ? pools.reduce((sum, pool) => sum + pool.supplyApy, 0) / pools.length
    : 0
  const maxSupplyApy = pools.length > 0
    ? Math.max(...pools.map(pool => pool.supplyApy))
    : 0

  const stats = [
    {
      label: 'Total TVL',
      value: formatTVL(totalTVL),
      icon: DollarSign,
      description: `${pools.length} pools`
    },
    {
      label: 'Average APY',
      value: `${avgSupplyApy.toFixed(2)}%`,
      icon: TrendingUp,
      description: 'Supply APY'
    },
    {
      label: 'Highest APY',
      value: `${maxSupplyApy.toFixed(2)}%`,
      icon: Layers,
      description: 'Best offer'
    }
  ]

  return (
    <div className="grid grid-cols-3 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-card border border-border p-4 lg:p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <stat.icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-2xl lg:text-3xl font-mono font-bold text-foreground mb-1">
            {stat.value}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              {stat.label}
            </p>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
