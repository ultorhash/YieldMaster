'use client'

import { useState, useCallback, memo, useMemo } from 'react'
import { LendingPool, formatTVL, formatAPY, CHAIN_COLORS, PROTOCOL_COLORS, RISK_COLORS, PROTOCOL_URLS, Protocol, EXPLOITED_PROTOCOLS } from '@/lib/lending-data'
import { ChevronUp, ChevronDown, Info, Shield, ShieldCheck, ExternalLink, Bug, Gift } from 'lucide-react'
import { PoolDetailModal } from './pool-detail-modal'

type SortKey = 'asset' | 'protocol' | 'chain' | 'supplyApy' | 'tvl' | 'riskRating' | 'sigma'
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
  const exploit = EXPLOITED_PROTOCOLS[pool.protocol]

  return (
    <tr className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'}`}>
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
        <div className="flex items-center justify-end gap-1.5">
          <span className="font-mono text-primary font-medium">
            {formatAPY(pool.supplyApy)}
          </span>
          {pool.rewardApy > 0 && (
            <span
              className="font-mono text-[11px] text-violet-500 flex items-center gap-1"
              title="Rewards"
            >
              +{formatAPY(pool.rewardApy)}
              <Gift className="h-3 w-3" />
            </span>
          )}
        </div>
      </td>
      <td className="p-4 text-right">
        <span className="font-mono text-sm text-foreground">{formatTVL(pool.tvl)}</span>
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
        <span className={`text-xs font-medium ${pool.sigma < 0.1 ? 'text-primary' :
            pool.sigma < 0.25 ? 'text-yellow-500' :
              'text-destructive'
          }`}>
          {pool.sigma < 0.1 ? 'Low' : pool.sigma < 0.25 ? 'Medium' : 'High'}
        </span>
      </td>
      <td className="p-4 text-center">
        <div className="flex items-center justify-center gap-1">
          <span title={pool.audited ? 'Audited' : 'Not Audited'}>
            <ShieldCheck className={`h-4 w-4 ${pool.audited ? 'text-primary' : 'text-muted-foreground/30'}`} />
          </span>
          <span title={pool.insurance ? 'Insurance' : 'No Insurance'}>
            <Shield className={`h-4 w-4 ${pool.insurance ? 'text-chart-4' : 'text-muted-foreground/30'}`} />
          </span>
          <span title={
            exploit
              ? `${exploit.type === 'logic' ? 'Logic' : 'Oracle'} exploit`
              : 'No Exploits'
          }>
            <Bug className={`h-4 w-4 ${exploit?.type === 'logic'
              ? 'text-destructive'
              : exploit?.type === 'oracle'
                ? 'text-yellow-500'
                : 'text-muted-foreground/30'
              }`}
            />
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
  const [sortKey, setSortKey] = useState<SortKey>('riskRating')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [selectedPool, setSelectedPool] = useState<LendingPool | null>(null)

  const handleSort = useCallback((key: SortKey) => {
    setSortDirection(prev => sortKey === key ? (prev === 'asc' ? 'desc' : 'asc') : (key === 'riskRating' ? 'asc' : 'desc'))
    setSortKey(key)
  }, [sortKey])

  const handleSelect = useCallback((pool: LendingPool) => setSelectedPool(pool), [])
  const handleClose = useCallback(() => setSelectedPool(null), [])

  const sortedPools = useMemo(() => {
    return [...pools].sort((a, b) => {
      let comparison = 0
      switch (sortKey) {
        case 'asset': comparison = a.asset.localeCompare(b.asset); break
        case 'protocol': comparison = a.protocol.localeCompare(b.protocol); break
        case 'chain': comparison = a.chain.localeCompare(b.chain); break
        case 'supplyApy': comparison = a.supplyApy - b.supplyApy; break
        case 'tvl': comparison = a.tvl - b.tvl; break
        case 'riskRating': comparison = riskOrder[a.riskRating] - riskOrder[b.riskRating]; break
        case 'sigma': comparison = a.sigma - b.sigma; break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [pools, sortKey, sortDirection])

  const SortTh = ({ label, sortKeyName, align = 'left' }: { label: string; sortKeyName: SortKey; align?: 'left' | 'right' | 'center' }) => (
    <th
      className="p-4 cursor-pointer select-none"
      onClick={() => handleSort(sortKeyName)}
    >
      <div className={`flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider font-medium ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
        {label}
        <span className="flex flex-col">
          <ChevronUp className={`h-3 w-3 -mb-1 ${sortKey === sortKeyName && sortDirection === 'asc' ? 'text-primary' : 'text-muted-foreground/40'}`} />
          <ChevronDown className={`h-3 w-3 ${sortKey === sortKeyName && sortDirection === 'desc' ? 'text-primary' : 'text-muted-foreground/40'}`} />
        </span>
      </div>
    </th>
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
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-border">
          <h2 className="text-sm font-medium text-foreground uppercase tracking-wider">
            Lending Pools
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Gift className="h-4 w-4 text-violet-500" />
              <span>Rewards</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Audited</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-chart-4" />
              <span>Insurance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bug className="h-4 w-4 text-yellow-500" />
              <Bug className="h-4 w-4 text-destructive" />
              <span>Exploit</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <SortTh label="Asset" sortKeyName="asset" />
                <SortTh label="Protocol" sortKeyName="protocol" />
                <SortTh label="Chain" sortKeyName="chain" />
                <SortTh label="Supply APY" sortKeyName="supplyApy" align="right" />
                <SortTh label="TVL" sortKeyName="tvl" align="right" />
                <SortTh label="Risk" sortKeyName="riskRating" align="center" />
                <SortTh label="Volatility" sortKeyName="sigma" align="center" />
                <th className="p-4 text-center">
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
