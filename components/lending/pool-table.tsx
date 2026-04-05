'use client'

import { useState, useCallback, memo } from 'react'
import { LendingPool, formatTVL, formatAPY, CHAIN_COLORS, PROTOCOL_COLORS, RISK_COLORS, PROTOCOL_URLS, Protocol } from '@/lib/lending-data'
import { ChevronUp, ChevronDown, Info, Shield, ShieldCheck, ExternalLink, Bug } from 'lucide-react'
import { PoolDetailModal } from './pool-detail-modal'

type SortKey = 'asset' | 'protocol' | 'chain' | 'supplyApy' | 'borrowApy' | 'tvl' | 'utilization' | 'riskRating'
type SortDirection = 'asc' | 'desc'

interface PoolTableProps {
  pools: LendingPool[]
}

const riskOrder = { 'A': 1, 'B+': 2, 'B': 3, 'C+': 4, 'C': 5, 'D': 6 }

interface PoolRowProps {
  pool: LendingPool
  index: number
  onSelect: (pool: LendingPool) => void
}

const PoolRow = memo(function PoolRow({ pool, index, onSelect }: PoolRowProps) {
  return (
    <tr
      className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
        }`}
    >
      <td className="p-4">
        <div className="flex items-center gap-2">
          <span className="font-mono font-medium text-foreground">{pool.asset}</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-muted text-muted-foreground">
            {pool.assetType}
          </span>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2"
            style={{ backgroundColor: PROTOCOL_COLORS[pool.protocol as keyof typeof PROTOCOL_COLORS] || '#888' }}
          />
          <span className="text-sm text-foreground">{pool.protocol}</span>
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2"
            style={{ backgroundColor: CHAIN_COLORS[pool.chain as keyof typeof CHAIN_COLORS] || '#888' }}
          />
          <span className="text-sm text-muted-foreground">{pool.chain}</span>
        </div>
      </td>
      <td className="p-4 text-right">
        <span className="font-mono text-primary font-medium">
          {formatAPY(pool.supplyApy)}
        </span>
      </td>
      <td className="p-4 text-right">
        <span className="font-mono text-muted-foreground">
          {pool.borrowApy > 0 ? formatAPY(pool.borrowApy) : '—'}
        </span>
      </td>
      <td className="p-4 text-right">
        <span className="font-mono text-sm text-foreground">
          {formatTVL(pool.tvl)}
        </span>
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <div className="w-16 h-1.5 bg-muted overflow-hidden">
            <div
              className="h-full bg-primary/70"
              style={{ width: `${pool.utilization}%` }}
            />
          </div>
          <span className="font-mono text-xs text-muted-foreground w-12 text-right">
            {pool.utilization.toFixed(1)}%
          </span>
        </div>
      </td>
      <td className="p-4 text-center">
        <span
          className="inline-flex items-center justify-center w-8 h-6 text-xs font-bold"
          style={{
            backgroundColor: RISK_COLORS[pool.riskRating] + '20',
            color: RISK_COLORS[pool.riskRating]
          }}
        >
          {pool.riskRating}
        </span>
      </td>
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-1">
          <span title={pool.audited ? 'Audited' : 'Not Audited'}>
            <ShieldCheck className={`h-4 w-4 ${pool.audited ? 'text-primary' : 'text-muted-foreground/30'}`} />
          </span>

          <span title={pool.insuranceCoverage ? 'Insurance Coverage' : 'No Insurance'}>
            <Shield className={`h-4 w-4 ${pool.insuranceCoverage ? 'text-chart-3' : 'text-muted-foreground/30'}`} />
          </span>

          <span title={pool.hadExploit ? (pool.exploitDetails || 'Protocol had exploit in the past') : 'No Past Exploits'}>
            <Bug className={`h-4 w-4 ${pool.hadExploit ? 'text-destructive cursor-help' : 'text-muted-foreground/30'}`} />
          </span>
          <button
            onClick={() => onSelect(pool)}
            className="p-1 ml-1 cursor-pointer group"
            title="View details"
          >
            <Info className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-blue-500" />
          </button>
          <a
            href={PROTOCOL_URLS[pool.protocol as Protocol] || `https://defillama.com/protocol/${pool.protocol.toLowerCase().replace(/\s+/g, '-')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 cursor-pointer group"
            title={`Open in ${pool.protocol}`}
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
          </a>
        </div>
      </td>
    </tr>
  )
})

export function PoolTable({ pools }: PoolTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('supplyApy')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedPool, setSelectedPool] = useState<LendingPool | null>(null)

  const handleSort = useCallback((key: SortKey) => {
    setSortKey(prev => {
      if (prev === key) {
        setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
        return prev
      }
      setSortDirection(key === 'riskRating' ? 'asc' : 'desc')
      return key
    })
  }, [])

  const handleSelect = useCallback((pool: LendingPool) => {
    setSelectedPool(pool)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedPool(null)
  }, [])

  const sortedPools = [...pools].sort((a, b) => {
    let comparison = 0
    switch (sortKey) {
      case 'asset': comparison = a.asset.localeCompare(b.asset); break
      case 'protocol': comparison = a.protocol.localeCompare(b.protocol); break
      case 'chain': comparison = a.chain.localeCompare(b.chain); break
      case 'supplyApy': comparison = a.supplyApy - b.supplyApy; break
      case 'borrowApy': comparison = a.borrowApy - b.borrowApy; break
      case 'tvl': comparison = a.tvl - b.tvl; break
      case 'utilization': comparison = a.utilization - b.utilization; break
      case 'riskRating': comparison = riskOrder[a.riskRating] - riskOrder[b.riskRating]; break
    }
    return sortDirection === 'asc' ? comparison : -comparison
  })

  const SortHeader = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <button
      onClick={() => handleSort(sortKeyName)}
      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider font-medium cursor-pointer"
    >
      {label}
      <span className="flex flex-col">
        <ChevronUp className={`h-3 w-3 -mb-1 ${sortKey === sortKeyName && sortDirection === 'asc' ? 'text-primary' : 'text-muted-foreground/40'}`} />
        <ChevronDown className={`h-3 w-3 ${sortKey === sortKeyName && sortDirection === 'desc' ? 'text-primary' : 'text-muted-foreground/40'}`} />
      </span>
    </button>
  )

  if (pools.length === 0) {
    return (
      <div className="bg-card border border-border p-12 text-center">
        <p className="text-muted-foreground">No pools match the filter criteria</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-card border border-border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider">
            Lending Pools
          </h2>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Audited</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-chart-3" />
              <span>Insurance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bug className="h-4 w-4 text-destructive" />
              <span>Past Exploit</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4"><SortHeader label="Asset" sortKeyName="asset" /></th>
                <th className="text-left p-4"><SortHeader label="Protocol" sortKeyName="protocol" /></th>
                <th className="text-left p-4"><SortHeader label="Chain" sortKeyName="chain" /></th>
                <th className="text-right p-4"><SortHeader label="Supply APY" sortKeyName="supplyApy" /></th>
                <th className="text-right p-4"><SortHeader label="Borrow APY" sortKeyName="borrowApy" /></th>
                <th className="text-right p-4"><SortHeader label="TVL" sortKeyName="tvl" /></th>
                <th className="text-right p-4"><SortHeader label="Utilization" sortKeyName="utilization" /></th>
                <th className="text-center p-4"><SortHeader label="Risk" sortKeyName="riskRating" /></th>
                <th className="text-center p-4">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Info</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPools.map((pool, index) => (
                <PoolRow
                  key={pool.id}
                  pool={pool}
                  index={index}
                  onSelect={handleSelect}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PoolDetailModal
        pool={selectedPool}
        onClose={handleClose}
      />
    </>
  )
}